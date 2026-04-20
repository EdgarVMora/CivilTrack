import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchProjectBitacora } from '../api/project.api.js';
import NewReportModal from './NewReportModal';

export default function ProjectDetail() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [project, setProject] = useState(location.state?.project || null);
  const [bitacora, setBitacora] = useState(Array.isArray(location.state?.project?.bitacora) ? location.state.project.bitacora : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch bitácora al montar
  useEffect(() => {
    const fetchData = async () => {
      if (!project) return;
      setLoading(true);
      setError('');
      try {
        const bitacoraData = await fetchProjectBitacora(project.id_proyecto || project.id);
        setBitacora(Array.isArray(bitacoraData) ? bitacoraData : []);
      } catch (err) {
        setError('Error al cargar los reportes del proyecto');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  // Handler para agregar un nuevo reporte al timeline
  const handleReportCreated = (nuevoReporte) => {
    setBitacora(prev => [nuevoReporte, ...(Array.isArray(prev) ? prev : [])]);
  };

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

      {/* Timeline de reportes */}
      <div className="w-full max-w-2xl flex flex-col items-center relative py-4 mb-8">
        <h3 className="text-xl font-bold text-blue-600 mb-6">Reportes del proyecto</h3>
        {/* Línea vertical timeline */}
        <div className="absolute left-6 top-10 bottom-0 w-1 bg-blue-100 rounded-full z-0" />
        {loading ? (
          <div className="w-full text-center text-gray-400 py-8">Cargando reportes...</div>
        ) : error ? (
          <div className="w-full text-center text-red-400 py-8">{error}</div>
        ) : (bitacora.length === 0) ? (
          <div className="w-full flex flex-col items-center justify-center py-12">
            <div className="text-2xl text-blue-700 font-bold mb-4 text-center">Aún no hay reportes en esta obra.<br />¡Sé el primero en documentar el avance!</div>
            <button
              className="mt-6 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white text-xl font-bold shadow-lg hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
              onClick={() => setIsModalOpen(true)}
            >
              + Crear Reporte
            </button>
          </div>
        ) : (
          <ul className="w-full flex flex-col gap-8 z-10">
            {bitacora.map((report, idx) => {
              // Formateo de fecha bonito
              let fecha = report.fecha_registro || report.fecha || report.fecha_creacion || report.createdAt;
              let fechaFormateada = '';
              if (fecha) {
                const dateObj = new Date(fecha);
                fechaFormateada = dateObj.toLocaleDateString('es-MX', {
                  day: '2-digit', month: 'long', year: 'numeric'
                });
                // Capitalizar mes
                fechaFormateada = fechaFormateada.replace(/(^|\s)([a-záéíóúñ])/g, l => l.toUpperCase());
              }
              return (
                <li key={report.id || report.id_bitacora || idx} className="relative flex gap-4 group animate-fade-in">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg z-10 mt-2 group-hover:scale-110 transition" />
                  </div>
                  {/* Card */}
                  <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2 hover:shadow-2xl transition-all duration-200">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                      <span>{fechaFormateada || 'Sin fecha'}</span>
                      <span className="mx-1">·</span>
                      <span className="font-medium text-blue-600">{report.autor || report.usuario || report.creador || report.user || 'Usuario'}</span>
                    </div>
                    <h4 className="text-xl font-bold text-blue-700">{report.titulo || report.titulo_reporte || report.title}</h4>
                    <p className="text-gray-700 text-base mb-2 whitespace-pre-line">{report.descripcion || report.descripcion_reporte || report.description}</p>
                    {Array.isArray(report.fotos) && report.fotos.length > 0 && report.fotos[0] && (
                      <img
                        src={report.fotos[0]}
                        alt={report.titulo || report.titulo_reporte || report.title}
                        className="w-full max-h-72 object-cover rounded-xl border mt-2"
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Modal para nuevo reporte */}
      <NewReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={project.id_proyecto || project.id}
        onReportCreated={handleReportCreated}
      />
    </div>
  );
}
