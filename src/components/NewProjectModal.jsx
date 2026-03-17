import React, { useState } from 'react';

export function NewProjectModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ name, description, photo });
    setName('');
    setDescription('');
    setPhoto(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-1 sm:px-2" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-lg p-2 sm:p-4 md:p-6 w-full max-w-md relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <h3 className="text-xl font-bold mb-4 text-blue-700 text-center">Nuevo Proyecto</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nombre del proyecto"
            value={name}
            onChange={e => setName(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <textarea
            placeholder="Descripción"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="border p-2 rounded w-full"
            rows={3}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="border p-2 rounded w-full"
            style={{ maxWidth: '100%' }}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Crear Proyecto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
