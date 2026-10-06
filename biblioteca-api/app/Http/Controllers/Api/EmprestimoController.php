<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Emprestimo;
use App\Models\Livro;
use App\Services\EmprestimoService;
use Illuminate\Http\Request;

class EmprestimoController extends Controller
{
  public function index(Request $request) {
    $query = Emprestimo::with(['livro', 'usuario']);

    if (!$request->user()->ehBibliotecario()) {
      $query->where('usuario_id', $request->user()->id);
    }

    if ($request->boolean('em_aberto')) {
      $query->whereNull('data_devolucao_real');
    }

    return $query->orderByDesc('data_emprestimo')->paginate(15);
  }

  public function store(Request $request, Livro $livro, EmprestimoService $service) {
    $emprestimo = $service->registrar($livro, $request->user());

    return response()->json($emprestimo, 201);
  }
}
