import CampoTexto from "./CampoTexto";
import MensagemErro from "./MensagemErro";

export default function CampoIsbn({ value, onChange, onBuscar, buscando, erro }) {
  return (
    <>
      <CampoTexto label="ISBN" name="isbn" value={value} onChange={onChange} required />
      <button type="button" onClick={onBuscar} disabled={buscando}>
        {buscando ? "Buscando..." : "Buscar pelo ISBN"}
      </button>
      {erro && <MensagemErro mensagem={erro} />}
    </>
  );
}