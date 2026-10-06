export default function LivroItem({ livro, podeEmprestar, onEmprestar }) {
  return (
    <li>
      {livro.capa_url && (
        <img
          src={livro.capa_url}
          alt={`Capa de ${livro.titulo}`}
          width={40}
          height={60}
          loading="lazy"
        />
      )}
      <div>
        <strong>{livro.titulo}</strong>
        <span>, {livro.autor?.nome}</span>
      </div>
      {podeEmprestar && <button onClick={() => onEmprestar(livro.id)}>Emprestar</button>}
    </li>
  );
}