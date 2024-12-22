const TextInput = ({
  label,
  type = "text",
  placeholder = "",
  value,
  name,
  maxLength,
  onChange = () => {},
  containerStyles,
  labelStyles,
  inputStyles,
  required = false,
  disabled = false,
}) => {
  return (
    <div className={`w-full flex flex-col ${containerStyles}`}>
      {label && <label className={`text-sm font-bold mb-2 ${labelStyles}`}>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        name={name}
        onChange={onChange}
        className={`bg-slate-200 rounded-lg p-3 ${
          !disabled ? "focus:outline-none focus:ring-2 focus:ring-acent" : ""
        } ${inputStyles}`}
        required={required}
        disabled={disabled}
        maxLength={maxLength || null}
      />
    </div>
  );
};

export default TextInput;
