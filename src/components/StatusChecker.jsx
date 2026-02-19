import { useStatusCheck } from '../hooks/useStatusCheck.js';

export function StatusChecker() {
  const { mensaje, cargando, error, checkStatus } = useStatusCheck();

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-2xl font-bold">Verificar conexión</h2>
      <button
        onClick={checkStatus}
        disabled={cargando}
        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {cargando ? 'Conectando...' : 'Comprobar backend'}
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
