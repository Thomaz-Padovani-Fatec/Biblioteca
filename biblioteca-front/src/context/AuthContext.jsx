// Context API nunca foi um conteúdo formal das nossas aulas.
// Em resumo: é um jeito do React compartilhar um mesmo state
// (Nesse caso, o usuário logado) entre componentes sem precisar
// passar como prop de componente em componente. Todo o resto
// do arquivo usa só useState e useEffect, exatamente como vimos em aula.
import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCarregando(false);
      return;
    }
    api
      .get("/me")
      .then((res) => setUsuario(res.data))
      .catch((err) => {
        // só apaga o token se o servidor disse que ele não vale mais (401);
        // se o servidor só estiver fora do ar ou lento, o token é mantido
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
        }
      })
      .finally(() => setCarregando(false));
  }, []);

  async function login(email, password) {
    const { data } = await api.post("/login", { email, password });
    localStorage.setItem("token", data.token);
    setUsuario(data.usuario);
  }

  async function logout() {
    try {
      await api.post("/logout");
    } catch (err) {
      // se o servidor não respondeu (ou o token já expirou), seguimos com o
      // logout local mesmo assim: o usuário precisa conseguir sair
    } finally {
      localStorage.removeItem("token");
      setUsuario(null);
    }
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth precisa ser usado dentro de um <AuthProvider>");
  }
  return contexto;
}
