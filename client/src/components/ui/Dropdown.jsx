const Dropdown = ({
  label,
  value,
  name,
  onChange = () => {},
  options = [],
  containerStyles,
  labelStyles,
  inputStyles,
  required = false,
  disabled = false,
}) => {
  return (
    <div className={`w-full flex flex-col ${containerStyles}`}>
      {label && <label className={`text-sm font-bold mb-2 ${labelStyles}`}>{label}</label>}
      <select
        value={value}
        name={name}
        onChange={onChange}
        className={`bg-slate-200 border-r-8 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-acent ${inputStyles}`}
        required={required}
        disabled={disabled}
      >
        {options.length ? (
          options.map((el) => (
            <option key={el.value} value={el.value}>
              {el.label}
            </option>
          ))
        ) : (
          <option value="">No options available</option>
        )}
      </select>
    </div>
  );
};

export default Dropdown;
