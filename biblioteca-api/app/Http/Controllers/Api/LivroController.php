<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLivroRequest;
use App\Http\Requests\UpdateLivroRequest;
use App\Models\Livro;
use Illuminate\Http\Request;

class LivroController extends Controller
{
  public function index(Request $request) {
    $query = Livro::with(['autor', 'categorias']);

    if ($request->boolean('disponiveis')) {
      $query->disponiveis();
    }

    if ($busca = $request->query('busca')) {
      $query->where('titulo', 'like', "%{$busca}%");
    }

    // whitelist simples: evita passar qualquer string do usuário direto pro orderBy
    $ordenar = in_array($request->query('ordenar'), ['titulo', 'ano_publicacao'], true)
      ? $request->query('ordenar')
      : 'titulo';

    return $query->orderBy($ordenar)->paginate(15);
  }

  public function show(Livro $livro) {
    return $livro->load([
      'autor',
      'categorias',
      'emprestimos' => function ($q) {
        $q->whereNull('data_devolucao_real');
      }
    ]);
  }

  public function store(StoreLivroRequest $request) {
    $livro = Livro::create($request->validated());

    if ($request->has('categorias')) {
      $livro->categorias()->sync($request->input('categorias'));
    }

    return response()->json($livro->load(['autor', 'categorias']), 201);
  }

  public function update(UpdateLivroRequest $request, Livro $livro) {
    $livro->update($request->validated());

    if ($request->has('categorias')) {
      $livro->categorias()->sync($request->input('categorias'));
    }

    return $livro->load(['autor', 'categorias']);
  }

  public function destroy(Livro $livro) {
    if ($livro->emprestimos()->whereNull('data_devolucao_real')->exists()) {
      return response()->json([
        'message' => 'Não é possível remover um livro com empréstimo em aberto.',
      ], 422);
    }

    $livro->delete();

    return response()->noContent();
  }
}
