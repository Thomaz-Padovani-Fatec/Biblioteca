import { useEffect, useState } from "react";
import EmprestimoItem from "../components/EmprestimoItem";
import api from "../api/client";

export default function Emprestimos() {
  const [emprestimos, setEmprestimos] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  function carregar() {
    api.get("/emprestimos", { params: { em_aberto: true } }).then((res) => setEmprestimos(res.data.data));
  }

  async function devolver(id) {
    await api.patch(`/emprestimos/${id}/devolucao`);
    carregar();
  }

  return (
    <div className="pagina-emprestimos">
      <h1>Meus empréstimos em aberto</h1>
      <ul>
        {emprestimos.map((emp) => (
          <EmprestimoItem key={emp.id} emprestimo={emp} onDevolver={devolver} />
        ))}
      </ul>
    </div>
  );
}
