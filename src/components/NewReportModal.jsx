import React, { useState } from 'react';

export default function NewReportModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend logic, just call onSubmit with form data
    onSubmit({ title, description, file });
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
            onChange={e => setTitle(e.target.value)}
            className="border rounded p-2"
            required
          />
          <textarea
            placeholder="Descripción"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="border rounded p-2"
            rows={4}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={e => setFile(e.target.files[0])}
            className="border rounded p-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
          >
            Crear Reporte
          </button>
        </form>
      </div>
    </div>
  );
}
