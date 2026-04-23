import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function NewReportModal({ isOpen, onClose, projectId, onReportCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0] || null;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(selected);
    setPreviewUrl(selected ? URL.createObjectURL(selected) : null);
    if (error) setError('');
  };

  const clearFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('titulo', title);
    formData.append('descripcion', description);
    if (file) formData.append('imagen', file);

    try {
      const response = await axios.post(
        `/api/proyectos/${projectId}/bitacora`,
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
      setTitle('');
      setDescription('');
      clearFile();
      onClose();
    } catch {
      setError('No se pudo enviar el reporte. Revisa tu conexión e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputClass = "border border-gray-300 dark:border-gray-600 py-3 px-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition";
  const labelClass = "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide";

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
          <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400">Nuevo Reporte</h3>
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
            <label className={labelClass}>Título</label>
            <input
              type="text"
              placeholder="Ej: Colado de losa nivel 3"
              value={title}
              onChange={e => { setTitle(e.target.value); if (error) setError(''); }}
              className={inputClass}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Descripción</label>
            <textarea
              placeholder="Describe el avance, observaciones o incidencias..."
              value={description}
              onChange={e => { setDescription(e.target.value); if (error) setError(''); }}
              className={`${inputClass} resize-none`}
              rows={4}
              required
            />
          </div>

          {/* Foto — preview o zona de carga */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>
              Foto <span className="normal-case font-normal text-gray-400 dark:text-gray-500">(opcional)</span>
            </label>

            {previewUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  className="w-full aspect-video object-cover"
                />
                {/* Overlay con acciones */}
                <div className="absolute inset-x-0 bottom-0 flex gap-2 p-2.5 bg-gradient-to-t from-black/60 to-transparent">
                  <button
                    type="button"
                    className="flex-1 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white text-xs font-semibold hover:bg-white/30 active:bg-white/40 transition"
                    onClick={clearFile}
                  >
                    Quitar
                  </button>
                  <label className="flex-1 py-2 rounded-lg bg-blue-600/80 backdrop-blur-sm text-white text-xs font-semibold text-center cursor-pointer hover:bg-blue-600 active:bg-blue-700 transition">
                    Cambiar
                    <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-blue-200 dark:border-blue-700 rounded-xl py-6 px-4 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 active:bg-blue-100 dark:active:bg-blue-900/30 transition">
                <span className="text-3xl">📷</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 text-center font-medium">Toca para agregar una foto</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">Cámara o galería</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Error inline */}
          {error && (
            <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
              <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

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
