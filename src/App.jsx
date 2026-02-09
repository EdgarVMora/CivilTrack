import './App.css';

function App() {
  const handleClick = () => {
    alert("Tarea completada");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold underline">
        Boton solicitado
      </h1>

      <button
        onClick={handleClick}
        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Click aquí
      </button>
    </div>
  );
}

export default App;
