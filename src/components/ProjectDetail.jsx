
import React, { useState } from 'react';
import NewReportModal from './NewReportModal';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ProjectDetail() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const project = location.state?.project;

  if (!project) {
    return <div className="p-4">No se encontró información del proyecto.</div>;
  }

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center py-6 px-2 sm:px-4">
      {/* Botón de volver */}
      <div className="w-full max-w-2xl flex items-center mb-4">
        <button
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-base px-3 py-2 rounded transition bg-white shadow-sm border border-blue-100"
          onClick={() => navigate(-1)}
        >
          <span className="text-xl">←</span> Volver
        </button>
      </div>

      {/* Card principal del proyecto */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <h2 className="text-3xl font-bold text-blue-700 leading-tight">{project.nombre}</h2>
          <button
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold px-6 py-2 rounded-full shadow hover:from-blue-700 hover:to-blue-500 transition text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={() => setIsModalOpen(true)}
          >
            + Nuevo Reporte
          </button>
        </div>
        <p className="text-gray-700 text-lg mb-2 whitespace-pre-line">{project.descripcion}</p>
        <div className="flex flex-wrap gap-4 text-gray-500 text-sm">
          <div className="bg-blue-50 rounded px-3 py-1 shadow-sm">Ubicación: <span className="font-medium text-gray-700">{project.ubicacion || 'N/A'}</span></div>
          <div className="bg-blue-50 rounded px-3 py-1 shadow-sm">Inicio: <span className="font-medium text-gray-700">{project.fecha_inicio ? new Date(project.fecha_inicio).toLocaleDateString() : 'N/A'}</span></div>
          <div className="bg-blue-50 rounded px-3 py-1 shadow-sm">Estado: <span className="font-medium text-gray-700">{project.activo ? 'Activo' : 'Inactivo'}</span></div>
        </div>
      </div>

      {/* Sección de reportes (placeholder visual) */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-4 flex flex-col gap-2 mb-8">
        <h3 className="text-xl font-bold text-blue-600 mb-2">Reportes del proyecto</h3>
        <div className="text-gray-400 italic">(Aquí aparecerán los reportes enviados para este proyecto)</div>
      </div>

      {/* Modal para nuevo reporte */}
      <NewReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={project.id_proyecto || project.id}
      />
    </div>
  );
}
