function ButtonComponent({ text, type, onClick, disabled = false, buttonStyles = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`hover:opacity-80 ${disabled && "opacity-80"} ${
        buttonStyles ? buttonStyles : "w-full bg-primary text-white rounded-lg p-3"
      } z-10`}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default ButtonComponent;
