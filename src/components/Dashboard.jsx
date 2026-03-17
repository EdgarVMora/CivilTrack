import React, { useState } from 'react';
import { NewProjectModal } from './NewProjectModal.jsx';

function HamburgerMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        className="bg-gray-200 p-2 rounded-full text-gray-700 hover:bg-gray-300 focus:outline-none"
        onClick={() => setOpen(!open)}
        aria-label="Menú usuario"
      >
        <span className="text-xl">☰</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-20 flex flex-col">
          <div className="px-4 py-2 border-b text-blue-700 font-semibold">{user?.nombre || 'Usuario'}</div>
          <button
            className="px-4 py-2 text-left text-red-500 hover:bg-gray-100"
            onClick={() => { setOpen(false); onLogout(); }}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

export function Dashboard({ user, onLogout }) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreateProject = (project) => {
    // Aquí puedes manejar el proyecto creado (enviar a backend, etc.)
    console.log('Proyecto creado:', project);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-blue-50 pb-8 relative">
      {/* Header fijo en la parte superior, fuera del flujo del contenido */}
      <header className="w-full fixed top-0 left-0 z-30 bg-blue-50 border-b border-blue-100">
        <div className="relative w-full max-w-5xl mx-auto flex items-center justify-between px-4 py-4">
          {/* Título centrado respecto a la página */}
          <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
            <h1 className="text-3xl font-bold text-blue-700 text-center pointer-events-auto">CivilTrack</h1>
          </div>
          {/* Acciones a la derecha */}
          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded font-semibold hover:bg-blue-700 transition text-sm sm:text-base"
            >
              + Nuevo Proyecto
            </button>
            <HamburgerMenu user={user} onLogout={onLogout} />
          </div>
        </div>
      </header>
      {/* Espaciador para el header fijo */}
      <div className="h-20" />
      {/* Contenido principal centrado y max-width */}
      <div className="w-full max-w-5xl mx-auto p-2 sm:p-4 md:p-8 bg-white rounded shadow flex flex-col gap-6 mt-4">
        {/* Cards grid responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <section className="flex flex-col gap-4 col-span-1 sm:col-span-2 lg:col-span-2">
            <h2 className="text-2xl font-bold text-blue-700">Bienvenido, {user?.nombre || 'Usuario'}!</h2>
            <p className="text-gray-600 text-sm">Panel principal de CivilTrack</p>
            <p className="text-gray-700">Aquí irá el contenido principal del dashboard, accesos rápidos, estadísticas, etc.</p>
          </section>
          <section className="flex flex-col gap-4">
            {/* Aquí puedes agregar widgets, gráficos, etc. */}
          </section>
        </div>
        {/* ...existing code... */}
      </div>
      <NewProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateProject}
      />
    </div>
  );
}
