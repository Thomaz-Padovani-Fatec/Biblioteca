import { Navigate, Route, Routes, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Livros from "./pages/Livros";
import CadastroLivro from "./pages/CadastroLivro";
import Emprestimos from "./pages/Emprestimos";
import Cabecalho from "./components/Cabecalho";
import RotaProtegida from "./components/RotaProtegida";
import "./App.css";

// Aula 10 (Tour Guiado pelo Projeto Completo).
// Cada <Route path="..."> abaixo mapeia uma URL a um componente.
// Para mudar o que já aparece numa tela existente, edite o arquivo do
// componente dentro de src/pages (por exemplo, Livros.jsx). Para criar
// uma tela nova, crie o componente e registre uma nova <Route> apontando
// para ele nesse arquivo.
export default function App() {
  return (
    <AuthProvider>
      <Cabecalho />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/livros" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/livros" element={<Livros />} />
          <Route path="/livros/novo"
            element={
              <RotaProtegida>
                <CadastroLivro />
              </RotaProtegida>
            }
          />
          <Route path="/emprestimos"
            element={
              <RotaProtegida>
                <Emprestimos />
              </RotaProtegida>
            }
          />
          
          {/* Rota fallback. Se tentar acessar "/qualquer-coisa" cai por padrão em "/livros" */}
          <Route path="*" element={<Navigate to="/livros" replace />} />
        </Routes>
      </main>
    </AuthProvider>
  );
}