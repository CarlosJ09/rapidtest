function Badge({ text, customStyles }) {
  return (
    <div className={`border rounded-3xl py-2 px-4 text-sm font-semibold ${customStyles}`}>
      {text}
    </div>
  );
}

export default Badge;
