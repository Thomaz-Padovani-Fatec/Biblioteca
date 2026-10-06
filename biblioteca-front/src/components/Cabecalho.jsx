import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Cabecalho() {
  const { usuario, logout } = useAuth();
  return (
    <header className="cabecalho">
      <Link to="/livros">📚 Biblioteca</Link>
      <nav>
        <Link to="/livros">Acervo</Link>
        {usuario?.perfil === "bibliotecario" && <Link to="/livros/novo">Cadastrar livro</Link>}
        {usuario && <Link to="/emprestimos">Meus empréstimos</Link>}
        {usuario ? (
          <button onClick={logout}>Sair ({usuario.nome})</button>
        ) : (
          <Link to="/login">Entrar</Link>
        )}
      </nav>
    </header>
  );
}