import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import LivroItem from "../components/LivroItem";

export default function Livros() {
  const [livros, setLivros] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const { usuario } = useAuth();

  useEffect(() => {
    buscarLivros();
  }, [busca]);

  function buscarLivros() {
    setCarregando(true);
    api
      .get("/livros", { params: { busca } })
      .then((res) => setLivros(res.data.data))
      .finally(() => setCarregando(false));
  }

  async function emprestar(livroId) {
    try {
      await api.post(`/livros/${livroId}/emprestimos`);
      buscarLivros();
    } catch (err) {
      alert(err.response?.data?.message ?? "Não foi possível emprestar este livro.");
    }
  }

  return (
    <div className="pagina-livros">
      <h1>Acervo</h1>
      <input
        type="search"
        placeholder="Buscar por título..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <ul className="lista-livros">
          {livros.map((livro) => (
            <LivroItem
              key={livro.id}
              livro={livro}
              podeEmprestar={!!usuario}
              onEmprestar={emprestar}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
