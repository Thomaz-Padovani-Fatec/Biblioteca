export default function SelectAutor({ autores, value, onChange }) {
  return (
    <label>
      Autor
      <select name="autor_id" value={value} onChange={onChange} required>
        <option value="">Selecione...</option>
        {autores.map((autor) => (
          <option key={autor.id} value={autor.id}>{autor.nome}</option>
        ))}
      </select>
    </label>
  );
}