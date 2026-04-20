import React, { useState } from 'react';
import axios from 'axios';

export default function NewReportModal({ isOpen, onClose, projectId, onReportCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleFileChange = (e) => setFile(e.target.files[0] || null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('titulo', title);
    formData.append('descripcion', description);
    if (file) formData.append('imagen', file);

    // Verificar el ID antes de enviar
    console.log('Enviando reporte para projectId:', projectId);

    try {
      const response = await axios.post(
        `http://localhost:3000/api/proyectos/${projectId}/bitacora`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );
      console.log('Respuesta backend:', response.data);
      // Normalizar el objeto para que coincida con la estructura de los reportes del backend
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
      if (onReportCreated) {
        onReportCreated(normalizado);
      }
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Nuevo Reporte</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={handleTitleChange}
            className="border rounded p-2"
            required
          />
          <textarea
            placeholder="Descripción"
            value={description}
            onChange={handleDescriptionChange}
            className="border rounded p-2"
            rows={4}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border rounded p-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Crear Reporte'}
          </button>
        </form>
      </div>
    </div>
  );
}
