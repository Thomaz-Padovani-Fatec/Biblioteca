export default function EmprestimoItem({ emprestimo, onDevolver }) {
  return (
    <li>
      <span>{emprestimo.livro?.titulo}</span>
      <span>, devolução prevista: {emprestimo.data_devolucao_prevista}</span>
      <button onClick={() => onDevolver(emprestimo.id)}>Registrar devolução</button>
    </li>
  );
}