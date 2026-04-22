import React, { useState } from 'react';

export function NewProjectModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || name.length > 150) {
      alert('El nombre es obligatorio y debe tener máximo 150 caracteres.');
      return;
    }
    if (!ubicacion.trim() || ubicacion.length > 200) {
      alert('La ubicación es obligatoria y debe tener máximo 200 caracteres.');
      return;
    }
    if (!fechaInicio || !/^\d{4}-\d{2}-\d{2}$/.test(fechaInicio)) {
      alert('La fecha de inicio es obligatoria.');
      return;
    }
    onCreate({ name: name.trim(), description: description.trim(), ubicacion: ubicacion.trim(), fechaInicio });
    setName('');
    setDescription('');
    setUbicacion('');
    setFechaInicio('');
    onClose();
  };

  if (!isOpen) return null;

  const inputClass = "border border-gray-300 py-3 px-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full md:max-w-md bg-white rounded-t-3xl md:rounded-2xl shadow-2xl flex flex-col animate-slide-up md:animate-none overflow-hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle (solo mobile) */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-blue-700">Nuevo Proyecto</h3>
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition text-xl font-bold"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 py-5 overflow-y-auto max-h-[75dvh]">
          <input
            type="text"
            placeholder="Nombre del proyecto"
            value={name}
            onChange={e => setName(e.target.value)}
            className={inputClass}
            required
          />
          <textarea
            placeholder="Descripción (opcional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className={`${inputClass} resize-none`}
            rows={3}
          />
          <input
            type="text"
            placeholder="Ubicación"
            value={ubicacion}
            onChange={e => setUbicacion(e.target.value)}
            className={inputClass}
            required
          />
          <input
            type="date"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
            className={inputClass}
            required
          />

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-semibold min-h-[44px] transition"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold min-h-[44px] transition"
            >
              Crear Proyecto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
