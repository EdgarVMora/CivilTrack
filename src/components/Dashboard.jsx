import React, { useState, useEffect, useRef } from 'react';
import { NewProjectModal } from './NewProjectModal.jsx';
import { useNavigate } from 'react-router-dom';

function Drawer({ user, onLogout, open, onClose }) {
  const drawerRef = useRef(null);

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  // Bloquear scroll del body cuando está abierto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const initials = user?.nombre
    ? user.nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div
        ref={drawerRef}
        className="relative w-72 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col animate-slide-in-right"
        style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* Header del drawer */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {initials}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-gray-800 truncate">{user?.nombre || 'Usuario'}</span>
            <span className="text-xs text-gray-400 truncate">{user?.correo || ''}</span>
          </div>
          <button
            className="ml-auto p-2 text-gray-400 hover:text-gray-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>

        {/* Opciones */}
        <div className="flex flex-col flex-1 px-3 py-4 gap-1">
          <button
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-500 hover:bg-red-50 active:bg-red-100 min-h-[44px] font-medium transition"
            onClick={() => { onClose(); onLogout(); }}
          >
            <span className="text-lg">⎋</span>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      setFetchError('');
      try {
        const response = await fetch('/api/projects', { method: 'GET', credentials: 'include' });
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

  const handleCreateProject = async (project) => {
    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);
    try {
      let fecha_inicio = project.fechaInicio;
      if (fecha_inicio) fecha_inicio = fecha_inicio.split('T')[0];
      const body = {
        id_proyecto: null,
        id_creador: user?.id || null,
        nombre: project.name,
        descripcion: project.description,
        ubicacion: project.ubicacion,
        fecha_inicio,
        activo: 1,
      };
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      // Refetch para ver el nuevo proyecto
      const res2 = await fetch('/api/projects', { credentials: 'include' });
      if (res2.ok) {
        const updated = await res2.json();
        setProjects(Array.isArray(updated) ? updated : []);
      }
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full min-h-[100dvh] flex flex-col bg-blue-50">

      {/* Header sticky */}
      <header
        className="w-full bg-blue-50/90 backdrop-blur-sm border-b border-blue-100 shadow-sm sticky top-0 z-30"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="w-full max-w-4xl mx-auto px-4 flex items-center justify-between py-3 gap-3">
          {/* Título — centrado en mobile, alineado a la izquierda en iPad */}
          <h1 className="flex-1 text-center md:text-left text-2xl md:text-3xl font-bold text-blue-700 tracking-wide">
            CIVILTRACK
          </h1>

          {/* Botón "Nuevo Proyecto" — solo visible en iPad (md+) */}
          <button
            onClick={() => setModalOpen(true)}
            className="hidden md:flex items-center bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold px-5 py-2.5 rounded-full shadow hover:from-blue-700 hover:to-blue-500 active:scale-95 transition min-h-[44px] text-base whitespace-nowrap"
            disabled={saving}
          >
            {saving ? 'Guardando...' : '+ Nuevo Proyecto'}
          </button>

          {/* Hamburguesa */}
          <button
            className="w-11 h-11 flex items-center justify-center bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-full transition shrink-0"
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menú"
          >
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="20" height="2" rx="1" fill="#374151"/>
              <rect y="6" width="20" height="2" rx="1" fill="#374151"/>
              <rect y="12" width="20" height="2" rx="1" fill="#374151"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Toast */}
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg animate-fade-in-out text-sm font-medium">
          Proyecto creado correctamente
        </div>
      )}

      {/* Main — pb-32 en mobile para no quedar bajo el FAB */}
      <main className="w-full max-w-4xl mx-auto flex flex-col gap-4 mt-6 px-4 pb-32 md:pb-10">
        {saveSuccess && !showToast && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-center text-sm">
            Proyecto guardado correctamente.
          </div>
        )}
        {saveError && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-center text-sm">{saveError}</div>
        )}

        {loadingProjects ? (
          <div className="text-center text-blue-600 py-12">Cargando proyectos...</div>
        ) : fetchError ? (
          <div className="text-center text-red-600 py-8">{fetchError}</div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <span className="text-4xl">🏗️</span>
            <p className="text-gray-500 text-center text-base">Aún no hay proyectos.<br />¡Crea el primero!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div
                key={project.id_proyecto || project.id || project.nombre}
                className="bg-white rounded-2xl shadow p-5 flex flex-col gap-3 cursor-pointer border border-blue-50 hover:shadow-lg active:scale-[0.98] transition-all duration-150"
                onClick={() => navigate(`/proyectos/${project.id_proyecto || project.id || project.nombre}`, { state: { project } })}
                tabIndex={0}
                role="button"
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ')
                    navigate(`/proyectos/${project.id_proyecto || project.id || project.nombre}`, { state: { project } });
                }}
                aria-label={`Ver detalles de ${project.nombre}`}
              >
                <h4 className="text-xl font-bold text-blue-700 leading-snug">{project.nombre}</h4>
                <p className="text-gray-600 text-sm line-clamp-2">{project.descripcion}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="bg-blue-50 text-gray-600 text-xs rounded-lg px-3 py-1">
                    📍 <span className="font-medium text-gray-700">{project.ubicacion || 'N/A'}</span>
                  </span>
                  <span className="bg-blue-50 text-gray-600 text-xs rounded-lg px-3 py-1">
                    Inicio: <span className="font-medium text-gray-700">
                      {project.fecha_inicio ? new Date(project.fecha_inicio).toLocaleDateString() : 'N/A'}
                    </span>
                  </span>
                  <span className={`text-xs rounded-lg px-3 py-1 font-medium ${project.activo ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {project.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FAB "Nuevo Proyecto" — solo en mobile (< md) */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 flex justify-center z-40 pointer-events-none"
        style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={() => setModalOpen(true)}
          className="pointer-events-auto bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold px-8 py-3.5 rounded-full shadow-xl hover:from-blue-700 hover:to-blue-500 active:scale-95 transition min-h-[52px] text-base"
          disabled={saving}
        >
          {saving ? 'Guardando...' : '+ Nuevo Proyecto'}
        </button>
      </div>

      <Drawer user={user} onLogout={onLogout} open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <NewProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateProject}
      />
    </div>
  );
}
