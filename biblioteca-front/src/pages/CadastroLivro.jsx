import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api/client";
import CampoTexto from "../components/CampoTexto";
import CampoIsbn from "../components/CampoIsbn";
import SelectAutor from "../components/SelectAutor";
import MensagemErro from "../components/MensagemErro";

export default function CadastroLivro() {
  const [autores, setAutores] = useState([]);
  const [form, setForm] = useState({ titulo: "", isbn: "", ano_publicacao: "", autor_id: "" });
  const [erro, setErro] = useState(null);
  const [buscandoIsbn, setBuscandoIsbn] = useState(false);
  const [erroIsbn, setErroIsbn] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/autores").then((res) => setAutores(res.data.data));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Aula 15 (Construindo o Front-end: Consumo de API Pública).
  // Aqui preenchemos parte do formulário automaticamente a partir do ISBN.
  // Repare que aqui usamos axios "puro" (axios.get) ao invés da nossa própria
  // instância api (api.get). A nossa já vem configurada com a baseURL da nossa
  // própria API Laravel e nosso token. Essa é para um serviço externo, então não
  // faz sentido reaproveitar a mesma configuração, muito menos enviar nosso token.
  async function buscarPorIsbn() {
    if (!form.isbn) return;

    setBuscandoIsbn(true);
    setErroIsbn(null);
    try {
      const { data } = await axios.get(`https://openlibrary.org/isbn/${form.isbn}.json`);
      setForm((f) => ({
        ...f,
        titulo: data.title ?? f.titulo,
        ano_publicacao: data.publish_date ? data.publish_date.slice(-4) : f.ano_publicacao,
      }));
    } catch (err) {
      setErroIsbn("ISBN não encontrado na Open Library. Preencha manualmente.");
    } finally {
      setBuscandoIsbn(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    try {
      await api.post("/livros", form);
      
      navigate("/livros");
    } catch (err) {
      setErro(err.response?.data?.message ?? "Não foi possível cadastrar o livro.");
    }
  }

  return (
    <div className="pagina-cadastro-livro">
      <h1>Cadastrar novo livro</h1>
      <form onSubmit={handleSubmit}>
        <CampoIsbn
          value={form.isbn}
          onChange={handleChange}
          onBuscar={buscarPorIsbn}
          buscando={buscandoIsbn}
          erro={erroIsbn}
        />
        <CampoTexto
          label="Título"
          name="titulo"
          value={form.titulo}
          onChange={handleChange}
          required
        />
        <CampoTexto
          label="Ano de publicação"
          name="ano_publicacao"
          type="number"
          value={form.ano_publicacao}
          onChange={handleChange}
        />
        <SelectAutor
          autores={autores}
          value={form.autor_id}
          onChange={handleChange}
        />
        
        {erro && <MensagemErro mensagem={erro} />}
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}