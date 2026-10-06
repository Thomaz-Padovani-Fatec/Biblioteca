<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Emprestimo;

class DevolucaoController extends Controller
{
  public function __invoke(Emprestimo $emprestimo) {
    if (! $emprestimo->estaEmAberto()) {
      return respostaErro('Este empréstimo já foi devolvido.');
    }

    $emprestimo->update(['data_devolucao_real' => now()->toDateString()]);

    return $emprestimo->load(['livro', 'usuario']);
  }
}
