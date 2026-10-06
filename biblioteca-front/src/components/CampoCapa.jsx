export default function CampoCapa({ onChange }) {
  return (
    <label>
      Capa do livro (opcional)
      <input
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={(e) => onChange(e.target.files[0])}
      />
    </label>
  );
}