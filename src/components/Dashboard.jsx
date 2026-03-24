import React, { useState, useEffect } from 'react';
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
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      setFetchError('');
      try {
        const response = await fetch('/api/projects', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Error fetching projects');
        }
        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleCreateProject = async (project) => {
    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);
    try {
      // Generar valores por defecto para los campos requeridos
      const activo = 1;
      // Formatear fecha_inicio a 'YYYY-MM-DD'
      let fecha_inicio = project.fechaInicio;
      if (fecha_inicio) {
        // Si viene en formato 'YYYY-MM-DDTHH:MM', extraer solo la fecha
        fecha_inicio = fecha_inicio.split('T')[0];
      }
      const body = {
        id_proyecto: null,
        id_creador: user?.id || null,
        nombre: project.name,
        descripcion: project.description,
        ubicacion: project.ubicacion,
        fecha_inicio,
        activo
      };
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error saving project');
      }
      setSaveSuccess(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      // Aquí podrías actualizar la lista de proyectos si la tienes
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
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
              disabled={saving}
            >
              {saving ? 'Guardando...' : '+ Nuevo Proyecto'}
            </button>
            <HamburgerMenu user={user} onLogout={onLogout} />
          </div>
        </div>
      </header>
      {/* Espaciador para el header fijo */}
      <div className="h-20" />
      {/* Contenido principal centrado y max-width */}
      <div className="w-full max-w-5xl mx-auto p-2 sm:p-4 md:p-8 bg-white rounded shadow flex flex-col gap-6 mt-4">
        {/* Mensaje de éxito o error al guardar */}
        {/* Toast flotante de éxito */}
        {showToast && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded shadow-lg transition-all animate-fade-in-out">
            Proyecto creado correctamente
          </div>
        )}
        {/* Mensaje inline para fallback */}
        {saveSuccess && !showToast && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-2 text-center">Proyecto guardado correctamente.</div>
        )}

        {saveError && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2 text-center">{saveError}</div>
        )}
        {/* Cards grid responsive para proyectos */}
        <div className="my-4">
          {loadingProjects ? (
            <div className="text-center text-blue-600">Cargando proyectos...</div>
          ) : fetchError ? (
            <div className="text-center text-red-600">{fetchError}</div>
          ) : projects.length === 0 ? (
            <div className="text-center text-gray-600">No hay proyectos disponibles.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div key={project.id_proyecto || project.id || project.nombre} className="bg-white border rounded shadow p-4 flex flex-col gap-2">
                  <h4 className="text-lg font-bold text-blue-700">{project.nombre}</h4>
                  <p className="text-gray-700 text-sm">{project.descripcion}</p>
                  <p className="text-gray-500 text-xs">Ubicación: {project.ubicacion || 'N/A'}</p>
                  <p className="text-gray-500 text-xs">Inicio: {project.fecha_inicio ? new Date(project.fecha_inicio).toLocaleDateString() : 'N/A'}</p>
                  <p className="text-gray-500 text-xs">Estado: {project.activo ? 'Activo' : 'Inactivo'}</p>
                </div>
              ))}
            </div>
          )}
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
