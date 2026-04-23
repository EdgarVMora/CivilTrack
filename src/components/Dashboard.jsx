import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, Pencil, Trash2, MapPin, Calendar, CheckCircle, Clock, ChevronRight, Sun, Moon } from 'lucide-react';
import { NewProjectModal } from './NewProjectModal.jsx';
import { EditProjectModal } from './EditProjectModal.jsx';
import { DeleteConfirmModal } from './DeleteConfirmModal.jsx';

function Drawer({ user, onLogout, open, onClose, darkMode, toggleDarkMode }) {
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

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
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div
        ref={drawerRef}
        className="relative w-72 max-w-[85vw] h-full bg-white dark:bg-gray-800 shadow-2xl flex flex-col animate-slide-in-right"
        style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* Header del drawer: avatar + info de usuario */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100 dark:border-gray-700">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {initials}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-gray-800 dark:text-gray-100 truncate">{user?.nombre || 'Usuario'}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500 truncate">{user?.correo || ''}</span>
          </div>
          <button
            className="ml-auto w-9 h-9 flex items-center justify-center rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col flex-1 px-3 py-4 gap-1">
          {/* Toggle modo oscuro */}
          <button
            className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 active:bg-gray-100 dark:active:bg-gray-700 min-h-[52px] transition"
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
          >
            <div className="flex items-center gap-3">
              {darkMode
                ? <Moon size={18} className="text-blue-400 shrink-0" />
                : <Sun size={18} className="text-amber-500 shrink-0" />
              }
              <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">
                Modo oscuro
              </span>
            </div>
            {/* Pill toggle */}
            <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${darkMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}>
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </button>

          {/* Separador */}
          <div className="my-1 border-t border-gray-100 dark:border-gray-700" />

          {/* Cerrar sesión */}
          <button
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 active:bg-red-100 dark:active:bg-red-900/30 min-h-[44px] font-medium transition"
            onClick={() => { onClose(); onLogout(); }}
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, onNavigate, onEdit, onDelete }) {
  const isActive = !!project.activo;
  const fecha = project.fecha_inicio
    ? new Date(project.fecha_inicio).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'N/A';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Franja de color superior según estado */}
      <div className={`h-1 w-full ${isActive ? 'bg-gradient-to-r from-blue-500 to-blue-300' : 'bg-gray-200 dark:bg-gray-600'}`} />

      {/* Cuerpo — clickeable para navegar */}
      <div
        className="flex flex-col gap-2.5 p-4 cursor-pointer active:bg-gray-50 dark:active:bg-gray-700/50 transition-colors"
        onClick={onNavigate}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onNavigate(); }}
        aria-label={`Ver detalles de ${project.nombre}`}
      >
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-base font-bold text-gray-800 dark:text-gray-100 leading-snug flex-1">{project.nombre}</h4>
          <span className={`shrink-0 inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
            isActive
              ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          }`}>
            {isActive ? <CheckCircle size={11} /> : <Clock size={11} />}
            {isActive ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        {project.descripcion && (
          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">{project.descripcion}</p>
        )}

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-0.5">
          <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
            <MapPin size={12} className="text-blue-400 shrink-0" />
            <span className="truncate max-w-[160px]">{project.ubicacion || 'Sin ubicación'}</span>
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
            <Calendar size={12} className="text-blue-400 shrink-0" />
            {fecha}
          </span>
        </div>
      </div>

      {/* Footer de acciones */}
      <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-700 px-4 py-2.5">
        <div className="flex items-center gap-1">
          {/* Editar */}
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 active:bg-blue-200 dark:active:bg-blue-900/60 transition min-h-[36px]"
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            aria-label="Editar proyecto"
          >
            <Pencil size={13} />
            Editar
          </button>
          {/* Eliminar */}
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 active:bg-red-200 dark:active:bg-red-900/60 transition min-h-[36px]"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            aria-label="Eliminar proyecto"
          >
            <Trash2 size={13} />
            Eliminar
          </button>
        </div>

        {/* Ver detalle */}
        <button
          className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition"
          onClick={onNavigate}
          aria-label="Ver bitácora"
        >
          Ver bitácora
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}

export function Dashboard({ user, onLogout, darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalProject, setEditModalProject] = useState(null);
  const [deleteModalProject, setDeleteModalProject] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null); // { message, type: 'success'|'error' }

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2800);
  };

  const refetchProjects = async () => {
    const res = await fetch('/api/projects', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoadingProjects(true);
      setFetchError('');
      try {
        const response = await fetch('/api/projects', { method: 'GET', credentials: 'include' });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Error al cargar proyectos');
        }
        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setLoadingProjects(false);
      }
    };
    load();
  }, []);

  const handleCreate = async (project) => {
    setSaving(true);
    try {
      let fecha_inicio = project.fechaInicio?.split('T')[0];
      const body = {
        id_proyecto: null,
        id_creador: user?.id || null,
        nombre: project.name,
        descripcion: project.description,
        ubicacion: project.ubicacion,
        fecha_inicio,
        activo: 1,
      };
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Error al crear');
      await refetchProjects();
      showToast('Proyecto creado correctamente');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (updated) => {
    if (!editModalProject) return;
    const id = editModalProject.id_proyecto || editModalProject.id;
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...editModalProject, ...updated }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Error al editar');
      await refetchProjects();
      setEditModalProject(null);
      showToast('Proyecto actualizado correctamente');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModalProject) return;
    const id = deleteModalProject.id_proyecto || deleteModalProject.id;
    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Error al eliminar');
      setProjects(prev => prev.filter(p => (p.id_proyecto || p.id) !== id));
      setDeleteModalProject(null);
      showToast('Proyecto eliminado');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full min-h-[100dvh] flex flex-col bg-gray-50 dark:bg-gray-900">

      {/* Header */}
      <header
        className="w-full bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 shadow-sm sticky top-0 z-30"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="w-full max-w-4xl mx-auto px-4 flex items-center justify-between py-3 gap-3">
          <h1 className="flex-1 text-center md:text-left text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-400 tracking-wide">
            CIVILTRACK
          </h1>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-5 py-2.5 rounded-full shadow-sm transition min-h-[44px] text-sm whitespace-nowrap"
            disabled={saving}
          >
            + Nuevo Proyecto
          </button>
          <button
            className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-500 rounded-full transition shrink-0"
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </header>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full shadow-lg text-sm font-medium text-white animate-fade-in-out ${
          toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Main */}
      <main className="w-full max-w-4xl mx-auto flex flex-col gap-4 mt-6 px-4 pb-32 md:pb-10">
        {loadingProjects ? (
          <div className="text-center text-blue-600 dark:text-blue-400 py-16">Cargando proyectos...</div>
        ) : fetchError ? (
          <div className="text-center text-red-500 py-8 text-sm">{fetchError}</div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <span className="text-3xl">🏗️</span>
            </div>
            <p className="text-gray-400 dark:text-gray-500 text-sm text-center">Aún no hay proyectos.<br />Crea el primero.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id_proyecto || project.id || project.nombre}
                project={project}
                onNavigate={() => navigate(
                  `/proyectos/${project.id_proyecto || project.id || project.nombre}`,
                  { state: { project } }
                )}
                onEdit={() => setEditModalProject(project)}
                onDelete={() => setDeleteModalProject(project)}
              />
            ))}
          </div>
        )}
      </main>

      {/* FAB mobile */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 flex justify-center z-40 pointer-events-none"
        style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={() => setCreateModalOpen(true)}
          className="pointer-events-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-8 py-3.5 rounded-full shadow-xl transition min-h-[52px] text-base"
          disabled={saving}
        >
          + Nuevo Proyecto
        </button>
      </div>

      <Drawer
        user={user}
        onLogout={onLogout}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <NewProjectModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreate}
      />

      <EditProjectModal
        key={editModalProject?.id_proyecto || editModalProject?.id || 'edit'}
        isOpen={!!editModalProject}
        onClose={() => setEditModalProject(null)}
        onSave={handleEdit}
        project={editModalProject}
        loading={saving}
      />

      <DeleteConfirmModal
        isOpen={!!deleteModalProject}
        onClose={() => setDeleteModalProject(null)}
        onConfirm={handleDelete}
        projectName={deleteModalProject?.nombre}
        loading={deleting}
      />
    </div>
  );
}
