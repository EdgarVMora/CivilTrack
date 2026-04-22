import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchProjectWithBitacora } from '../api/project.api.js';
import NewReportModal from './NewReportModal';

export default function ProjectDetail() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [project, setProject] = useState(location.state?.project || null);
  const [bitacora, setBitacora] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const projectId = project?.id_proyecto || project?.id || id;
        const { project: fetchedProject, bitacora: fetchedBitacora } =
          await fetchProjectWithBitacora(projectId);
        if (!project && fetchedProject) setProject(fetchedProject);
        setBitacora(fetchedBitacora);
      } catch {
        setError('Error al cargar los reportes del proyecto');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReportCreated = (nuevoReporte) => {
    setBitacora(prev => [nuevoReporte, ...(Array.isArray(prev) ? prev : [])]);
  };

  if (!project && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-blue-50 p-8 gap-4">
        <p className="text-gray-500 text-center">No se encontró información del proyecto.</p>
        <button
          className="text-blue-600 font-semibold underline"
          onClick={() => navigate(-1)}
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-blue-50 flex flex-col"
         style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>

      {/* Header sticky */}
      <header
        className="sticky top-0 z-30 w-full bg-blue-50/90 backdrop-blur-sm border-b border-blue-100 shadow-sm"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="w-full max-w-2xl mx-auto flex items-center gap-3 px-4 py-3">
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-blue-100 shadow-sm text-blue-600 hover:bg-blue-50 active:scale-95 transition shrink-0"
            onClick={() => navigate(-1)}
            aria-label="Volver"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 14L6 9L11 4" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="flex flex-col min-w-0">
            <span className="text-xs text-gray-400 font-medium">Proyectos</span>
            <h1 className="text-base font-bold text-blue-700 truncate leading-tight">{project.nombre}</h1>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <div className="flex flex-col items-center px-4 pt-5 pb-28 gap-6 w-full max-w-2xl mx-auto">

        {/* Card del proyecto */}
        <div className="w-full bg-white rounded-2xl shadow p-5 flex flex-col gap-3">
          <h2 className="text-2xl font-bold text-blue-700 leading-snug">{project.nombre}</h2>
          <p className="text-gray-600 text-base whitespace-pre-line">{project.descripcion}</p>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className="bg-blue-50 text-gray-600 text-xs rounded-lg px-3 py-1">
              📍 <span className="font-medium text-gray-700">{project.ubicacion || 'N/A'}</span>
            </span>
            <span className="bg-blue-50 text-gray-600 text-xs rounded-lg px-3 py-1">
              Inicio: <span className="font-medium text-gray-700">
                {project.fecha_inicio ? new Date(project.fecha_inicio).toLocaleDateString() : 'N/A'}
              </span>
            </span>
            <span className={`text-xs rounded-lg px-3 py-1 font-medium ${project.activo ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {project.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>

        {/* Sección timeline */}
        <div className="w-full">
          <h3 className="text-lg font-bold text-blue-600 mb-5">Reportes del proyecto</h3>

          {loading ? (
            <div className="text-center text-gray-400 py-12">Cargando reportes...</div>
          ) : error ? (
            <div className="text-center text-red-400 py-8">{error}</div>
          ) : bitacora.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <span className="text-5xl">📋</span>
              <p className="text-blue-700 font-bold text-lg text-center leading-snug">
                Aún no hay reportes en esta obra.<br />¡Sé el primero en documentar el avance!
              </p>
            </div>
          ) : (
            <div className="relative flex flex-col gap-6">
              {/* Línea vertical */}
              <div className="absolute left-[18px] top-3 bottom-3 w-0.5 bg-blue-100 rounded-full z-0" />
              <ul className="flex flex-col gap-6 z-10">
                {bitacora.map((report, idx) => {
                  let fecha = report.fecha_registro || report.fecha || report.fecha_creacion || report.createdAt;
                  let fechaFormateada = '';
                  if (fecha) {
                    const dateObj = new Date(fecha);
                    fechaFormateada = dateObj.toLocaleDateString('es-MX', {
                      day: '2-digit', month: 'long', year: 'numeric',
                    });
                    fechaFormateada = fechaFormateada.replace(/(^|\s)([a-záéíóúñ])/g, l => l.toUpperCase());
                  }
                  return (
                    <li key={report.id || report.id_bitacora || idx} className="flex gap-4 group">
                      {/* Dot */}
                      <div className="flex flex-col items-center pt-2 shrink-0">
                        <div className="w-[14px] h-[14px] bg-blue-500 rounded-full border-2 border-white shadow-md z-10 group-hover:scale-110 transition" />
                      </div>
                      {/* Card */}
                      <div className="flex-1 bg-white rounded-2xl shadow p-4 flex flex-col gap-2 hover:shadow-lg transition-all duration-150">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <span>{fechaFormateada || 'Sin fecha'}</span>
                          <span>·</span>
                          <span className="font-medium text-blue-600">
                            {report.autor || report.usuario || report.creador || report.user || 'Usuario'}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-blue-700">
                          {report.titulo || report.titulo_reporte || report.title}
                        </h4>
                        <p className="text-gray-600 text-sm whitespace-pre-line">
                          {report.descripcion || report.descripcion_reporte || report.description}
                        </p>
                        {Array.isArray(report.fotos) && report.fotos.length > 0 && report.fotos[0] && (
                          <img
                            src={report.fotos[0]}
                            alt={report.titulo || report.titulo_reporte || report.title}
                            className="w-full aspect-video object-cover rounded-xl border mt-1"
                            onError={e => { e.target.style.display = 'none'; }}
                          />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* FAB — Nuevo Reporte */}
      <div
        className="fixed bottom-0 left-0 right-0 flex justify-center pb-6 pointer-events-none z-40"
        style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
      >
        <button
          className="pointer-events-auto bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold px-8 py-3.5 rounded-full shadow-xl hover:from-blue-700 hover:to-blue-500 active:scale-95 transition min-h-[52px] text-base"
          onClick={() => setIsModalOpen(true)}
        >
          + Nuevo Reporte
        </button>
      </div>

      <NewReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={project.id_proyecto || project.id}
        onReportCreated={handleReportCreated}
      />
    </div>
  );
}
