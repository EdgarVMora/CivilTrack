import React, { useState } from 'react';

export function NewProjectModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'El nombre es obligatorio.';
    else if (name.length > 150) e.name = 'Máximo 150 caracteres.';
    if (!ubicacion.trim()) e.ubicacion = 'La ubicación es obligatoria.';
    else if (ubicacion.length > 200) e.ubicacion = 'Máximo 200 caracteres.';
    if (!fechaInicio) e.fechaInicio = 'La fecha de inicio es obligatoria.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await onCreate({ name: name.trim(), description: description.trim(), ubicacion: ubicacion.trim(), fechaInicio });
      setName('');
      setDescription('');
      setUbicacion('');
      setFechaInicio('');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const inputBase = "border py-3 px-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition";
  const inputNormal = `${inputBase} border-gray-300 dark:border-gray-600`;
  const inputError  = `${inputBase} border-red-400 dark:border-red-500`;

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
          <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400">Nuevo Proyecto</h3>
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-xl font-bold"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 py-5 overflow-y-auto max-h-[75dvh]">

          <div className="flex flex-col gap-1">
            <input
              type="text"
              placeholder="Nombre del proyecto"
              value={name}
              onChange={e => { setName(e.target.value); if (errors.name) setErrors(p => ({ ...p, name: '' })); }}
              className={errors.name ? inputError : inputNormal}
            />
            {errors.name && <p className="text-red-500 dark:text-red-400 text-xs px-1">{errors.name}</p>}
          </div>

          <textarea
            placeholder="Descripción (opcional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className={`${inputNormal} resize-none`}
            rows={3}
          />

          <div className="flex flex-col gap-1">
            <input
              type="text"
              placeholder="Ubicación"
              value={ubicacion}
              onChange={e => { setUbicacion(e.target.value); if (errors.ubicacion) setErrors(p => ({ ...p, ubicacion: '' })); }}
              className={errors.ubicacion ? inputError : inputNormal}
            />
            {errors.ubicacion && <p className="text-red-500 dark:text-red-400 text-xs px-1">{errors.ubicacion}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <input
              type="date"
              value={fechaInicio}
              onChange={e => { setFechaInicio(e.target.value); if (errors.fechaInicio) setErrors(p => ({ ...p, fechaInicio: '' })); }}
              className={errors.fechaInicio ? inputError : inputNormal}
            />
            {errors.fechaInicio && <p className="text-red-500 dark:text-red-400 text-xs px-1">{errors.fechaInicio}</p>}
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 text-gray-700 dark:text-gray-200 font-semibold min-h-[44px] transition"
              onClick={onClose}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold min-h-[44px] transition disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting ? 'Creando...' : 'Crear Proyecto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
