import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CampoTexto from "../components/CampoTexto";
import MensagemErro from "../components/MensagemErro";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    try {
      await login(email, password);
      navigate("/livros");
    } catch (err) {
      setErro("E-mail ou senha inválidos.");
    }
  }

  return (
    <div className="pagina-login">
      <h1>Entrar na Biblioteca</h1>
      <form onSubmit={handleSubmit}>
        <CampoTexto
          label="E-mail"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <CampoTexto
          label="Senha"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {erro && <MensagemErro mensagem={erro} />}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
