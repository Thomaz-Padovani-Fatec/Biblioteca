export default function CampoTexto({ label, name, value, onChange, type = "text", required = false }) {
  return (
    <label>
      {label}
      <input name={name} type={type} value={value} onChange={onChange} required={required} />
    </label>
  );
}