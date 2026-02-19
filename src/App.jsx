import { useState } from 'react';
import './App.css';

const API_URL = '/api'; // Usa el proxy de Vite en desarrollo

function App() {
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const handleClick = async () => {
    setCargando(true);
    setError('');
    setMensaje('');
    try {
      const res = await fetch(`${API_URL}/status`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error en la petición');
      setMensaje(data.mensaje || 'Sin mensaje');
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el backend');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-3xl font-bold underline">
        Boton solicitado
      </h1>

      <button
        onClick={handleClick}
        disabled={cargando}
        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {cargando ? 'Conectando...' : 'Click aquí'}
      </button>

      {mensaje && (
        <p className="text-green-600 font-medium">✓ {mensaje}</p>
      )}
      {error && (
        <p className="text-red-600 font-medium">✗ {error}</p>
      )}
    </div>
  );
}

export default App;
