import React, { useState } from 'react';
import axios from 'axios';

export default function NewReportModal({ isOpen, onClose, projectId, onReportCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('titulo', title);
    formData.append('descripcion', description);
    if (file) formData.append('imagen', file);

    try {
      const response = await axios.post(
        `http://localhost:3000/api/proyectos/${projectId}/bitacora`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true }
      );
      const data = response.data;
      const normalizado = {
        id_bitacora: data.id_bitacora || data.id || data._id,
        titulo: data.titulo || title,
        descripcion: data.descripcion || description,
        fecha_registro: data.fecha_registro || data.fecha || new Date().toISOString(),
        autor: data.autor || data.usuario || data.user || 'Tú',
        fotos: Array.isArray(data.fotos) && data.fotos.length > 0
          ? data.fotos
          : (data.fotos ? [data.fotos] : (data.imagen ? [data.imagen] : (data.url ? [data.url] : []))),
      };
      if (onReportCreated) onReportCreated(normalizado);
    } catch (error) {
      console.error('Error al enviar reporte:', error);
    } finally {
      setLoading(false);
    }

    setTitle('');
    setDescription('');
    setFile(null);
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
          <h3 className="text-lg font-bold text-blue-700">Nuevo Reporte</h3>
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
            placeholder="Título del reporte"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className={inputClass}
            required
          />
          <textarea
            placeholder="Descripción"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className={`${inputClass} resize-none`}
            rows={4}
            required
          />

          {/* File upload */}
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-blue-200 rounded-xl py-5 px-4 cursor-pointer hover:bg-blue-50 transition">
            <span className="text-2xl">📷</span>
            <span className="text-sm text-gray-500 text-center">
              {file ? file.name : 'Agregar imagen (opcional)'}
            </span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={e => setFile(e.target.files[0] || null)}
              className="hidden"
            />
          </label>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold min-h-[52px] transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Crear Reporte'}
          </button>
        </form>
      </div>
    </div>
  );
}
