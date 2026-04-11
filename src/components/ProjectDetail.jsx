
import React, { useState } from 'react';
import NewReportModal from './NewReportModal';
import { useLocation } from 'react-router-dom';

export default function ProjectDetail() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const project = location.state?.project;

  // Dummy handler for form submit
  const handleNewReport = (data) => {
    // No backend logic, just log
    console.log('Nuevo reporte:', data);
  };

  if (!project) {
    return <div className="p-4">No se encontró información del proyecto.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-blue-700 mb-2">{project.nombre}</h2>
      <p className="mb-4 text-gray-700">{project.descripcion}</p>
      <button
        className="bg-blue-600 text-white rounded px-4 py-2 mb-4 hover:bg-blue-700"
        onClick={() => setIsModalOpen(true)}
      >
        Nuevo Reporte
      </button>
      <NewReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewReport}
      />
      {/* ...rest of project detail... */}
    </div>
  );
}
