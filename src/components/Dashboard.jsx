import React, { useState, useEffect } from 'react';
import { NewProjectModal } from './NewProjectModal.jsx';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
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
    <div className="w-full min-h-screen flex flex-col items-center bg-blue-50 pb-8 relative">
      {/* Header principal */}
      <header className="w-full bg-blue-50 border-b border-blue-100 shadow-sm sticky top-0 z-30">
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between px-4 py-6">
          <div className="flex-1 flex justify-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 text-center">CIVILTRACK</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            <button
              onClick={() => setModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold px-6 py-2 rounded-full shadow hover:from-blue-700 hover:to-blue-500 transition text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              disabled={saving}
            >
              {saving ? 'Guardando...' : '+ Nuevo Proyecto'}
            </button>
            <HamburgerMenu user={user} onLogout={onLogout} />
          </div>
        </div>
      </header>
      {/* Toast flotante de éxito */}
      {showToast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded shadow-lg transition-all animate-fade-in-out">
          Proyecto creado correctamente
        </div>
      )}
      {/* Mensaje inline para fallback */}
      <main className="w-full max-w-6xl mx-auto flex flex-col gap-6 mt-8 px-2 sm:px-4 md:px-8">
        {saveSuccess && !showToast && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-2 text-center">Proyecto guardado correctamente.</div>
        )}
        {saveError && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2 text-center">{saveError}</div>
        )}
        <div className="my-2">
          {loadingProjects ? (
            <div className="text-center text-blue-600">Cargando proyectos...</div>
          ) : fetchError ? (
            <div className="text-center text-red-600">{fetchError}</div>
          ) : projects.length === 0 ? (
            <div className="text-center text-gray-600">No hay proyectos disponibles.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id_proyecto || project.id || project.nombre}
                  className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-3 cursor-pointer border border-blue-100 hover:shadow-2xl hover:scale-[1.025] transition-all duration-200"
                  onClick={() => navigate(`/proyectos/${project.id_proyecto || project.id || project.nombre}`, { state: { project } })}
                  tabIndex={0}
                  role="button"
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/proyectos/${project.id_proyecto || project.id || project.nombre}`, { state: { project } }); }}
                  aria-label={`Ver detalles de ${project.nombre}`}
                >
                  <h4 className="text-2xl font-bold text-blue-700 mb-1 truncate">{project.nombre}</h4>
                  <p className="text-gray-700 text-base mb-2 line-clamp-3">{project.descripcion}</p>
                  <div className="flex flex-wrap gap-2 text-gray-500 text-sm">
                    <div className="bg-blue-50 rounded px-3 py-1 shadow-sm">Ubicación: <span className="font-medium text-gray-700">{project.ubicacion || 'N/A'}</span></div>
                    <div className="bg-blue-50 rounded px-3 py-1 shadow-sm">Inicio: <span className="font-medium text-gray-700">{project.fecha_inicio ? new Date(project.fecha_inicio).toLocaleDateString() : 'N/A'}</span></div>
                    <div className="bg-blue-50 rounded px-3 py-1 shadow-sm">Estado: <span className="font-medium text-gray-700">{project.activo ? 'Activo' : 'Inactivo'}</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <NewProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateProject}
      />
    </div>
  );
}
