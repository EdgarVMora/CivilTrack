import React, { useState } from 'react';
import { X, CheckCircle, Clock } from 'lucide-react';

export function EditProjectModal({ isOpen, onClose, onSave, project, loading }) {
  const raw = project?.fecha_inicio || '';
  const [name, setName] = useState(project?.nombre || '');
  const [description, setDescription] = useState(project?.descripcion || '');
  const [ubicacion, setUbicacion] = useState(project?.ubicacion || '');
  const [fechaInicio, setFechaInicio] = useState(raw ? raw.split('T')[0] : '');
  const [activo, setActivo] = useState(!!project?.activo);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = {};
    if (!name.trim()) e2.name = 'El nombre es obligatorio.';
    else if (name.length > 150) e2.name = 'Máximo 150 caracteres.';
    if (!ubicacion.trim()) e2.ubicacion = 'La ubicación es obligatoria.';
    else if (ubicacion.length > 200) e2.ubicacion = 'Máximo 200 caracteres.';
    if (!fechaInicio) e2.fechaInicio = 'La fecha de inicio es obligatoria.';
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    setErrors({});
    onSave({
      nombre: name.trim(),
      descripcion: description.trim(),
      ubicacion: ubicacion.trim(),
      fecha_inicio: fechaInicio,
      activo: activo ? 1 : 0,
    });
  };

  if (!isOpen) return null;

  const inputBase = "border py-3 px-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition";
  const inputNormal = `${inputBase} border-gray-300 dark:border-gray-600`;
  const inputError  = `${inputBase} border-red-400 dark:border-red-500`;
  const labelClass  = "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full md:max-w-md bg-white dark:bg-gray-800 rounded-t-3xl md:rounded-2xl shadow-2xl flex flex-col animate-slide-up md:animate-none overflow-hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400">Editar Proyecto</h3>
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 py-5 overflow-y-auto max-h-[75dvh]">

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Nombre</label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); if (errors.name) setErrors(p => ({ ...p, name: '' })); }}
              className={errors.name ? inputError : inputNormal}
            />
            {errors.name && <p className="text-red-500 dark:text-red-400 text-xs px-1">{errors.name}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Descripción</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className={`${inputNormal} resize-none`}
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Ubicación</label>
            <input
              type="text"
              value={ubicacion}
              onChange={e => { setUbicacion(e.target.value); if (errors.ubicacion) setErrors(p => ({ ...p, ubicacion: '' })); }}
              className={errors.ubicacion ? inputError : inputNormal}
            />
            {errors.ubicacion && <p className="text-red-500 dark:text-red-400 text-xs px-1">{errors.ubicacion}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Fecha de inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={e => { setFechaInicio(e.target.value); if (errors.fechaInicio) setErrors(p => ({ ...p, fechaInicio: '' })); }}
              className={errors.fechaInicio ? inputError : inputNormal}
            />
            {errors.fechaInicio && <p className="text-red-500 dark:text-red-400 text-xs px-1">{errors.fechaInicio}</p>}
          </div>

          {/* Estado activo/inactivo */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Estado del proyecto</label>
            <button
              type="button"
              className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 min-h-[48px] hover:border-blue-300 dark:hover:border-blue-500 transition"
              onClick={() => setActivo(a => !a)}
              aria-label={activo ? 'Proyecto activo — click para desactivar' : 'Proyecto inactivo — click para activar'}
            >
              <div className="flex items-center gap-2">
                {activo
                  ? <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                  : <Clock size={16} className="text-gray-400 dark:text-gray-500 shrink-0" />
                }
                <span className={`font-medium text-sm ${activo ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  {activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              {/* Pill toggle */}
              <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${activo ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-600'}`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${activo ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 text-gray-700 dark:text-gray-200 font-semibold min-h-[44px] transition"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold min-h-[44px] transition disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
