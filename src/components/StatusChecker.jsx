import { useStatusCheck } from '../hooks/useStatusCheck.js';

export function StatusChecker({ small }) {
  const { mensaje, cargando, error, checkStatus } = useStatusCheck();

  return (
    <div className={`flex flex-col items-center gap-2 p-2 ${small ? 'w-40 text-xs' : 'w-64'} bg-white rounded shadow`}>
      <button
        onClick={checkStatus}
        disabled={cargando}
        className={`px-3 py-1 ${small ? 'text-xs' : 'text-base'} bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed`}
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
