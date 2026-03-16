export function Dashboard({ user, onLogout }) {
  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded shadow flex flex-col gap-6">
      <header className="flex justify-between items-center border-b pb-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-700">Bienvenido, {user?.nombre || 'Usuario'}!</h2>
          <p className="text-gray-600 text-sm">Panel principal de CivilTrack</p>
        </div>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Cerrar sesión
        </button>
      </header>
      <main className="flex flex-col gap-4">
        <p className="text-gray-700">Aquí irá el contenido principal del dashboard, accesos rápidos, estadísticas, etc.</p>
        {/* Puedes agregar aquí tarjetas, gráficos, accesos, etc. */}
      </main>
    </div>
  );
}
