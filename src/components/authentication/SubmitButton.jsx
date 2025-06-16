function SubmitButton({ children, onClick }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full hover:bg-cyan-600 hover:cursor-pointer h-10 flex items-center justify-center font-bold text-white rounded bg-cyan-400"
      >
        {children}
      </button>
    );
  }
  
  export default SubmitButton;  