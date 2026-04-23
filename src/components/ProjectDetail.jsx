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
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2800);
  };

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
    showToast('Reporte creado correctamente');
  };

  if (!project && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-blue-50 dark:bg-gray-900 p-8 gap-4">
        <p className="text-gray-500 dark:text-gray-400 text-center">No se encontró información del proyecto.</p>
        <button
          className="text-blue-600 dark:text-blue-400 font-semibold underline"
          onClick={() => navigate(-1)}
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-blue-50 dark:bg-gray-900 flex flex-col">

      {/* Header sticky */}
      <header
        className="sticky top-0 z-30 w-full bg-blue-50/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-blue-100 dark:border-gray-700 shadow-sm"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="w-full max-w-2xl mx-auto flex items-center gap-3 px-4 py-3">
          {/* Botón Volver — solo visible en iPad (md+) */}
          <button
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 shadow-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 active:scale-95 transition shrink-0"
            onClick={() => navigate(-1)}
            aria-label="Volver"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 14L6 9L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Proyectos</span>
            <h1 className="text-base font-bold text-blue-700 dark:text-blue-400 truncate leading-tight">{project.nombre}</h1>
          </div>
          {/* Botón Nuevo Reporte inline — solo en iPad (md+) */}
          <button
            className="hidden md:flex items-center bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold px-5 py-2 rounded-full shadow hover:from-blue-700 hover:to-blue-500 active:scale-95 transition min-h-[40px] text-sm whitespace-nowrap shrink-0"
            onClick={() => setIsModalOpen(true)}
          >
            + Nuevo Reporte
          </button>
        </div>
      </header>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full shadow-lg text-sm font-medium text-white animate-fade-in-out ${
          toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Contenido — pb-32 en mobile para no quedar bajo la barra inferior */}
      <div className="flex flex-col items-center px-4 pt-5 pb-32 md:pb-10 gap-6 w-full max-w-2xl mx-auto">

        {/* Card del proyecto */}
        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow p-5 flex flex-col gap-3">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 leading-snug">{project.nombre}</h2>
          <p className="text-gray-600 dark:text-gray-300 text-base whitespace-pre-line">{project.descripcion}</p>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className="bg-blue-50 dark:bg-blue-900/30 text-gray-600 dark:text-gray-300 text-xs rounded-lg px-3 py-1">
              📍 <span className="font-medium text-gray-700 dark:text-gray-200">{project.ubicacion || 'N/A'}</span>
            </span>
            <span className="bg-blue-50 dark:bg-blue-900/30 text-gray-600 dark:text-gray-300 text-xs rounded-lg px-3 py-1">
              Inicio: <span className="font-medium text-gray-700 dark:text-gray-200">
                {project.fecha_inicio ? new Date(project.fecha_inicio).toLocaleDateString() : 'N/A'}
              </span>
            </span>
            <span className={`text-xs rounded-lg px-3 py-1 font-medium ${project.activo ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
              {project.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>

        {/* Sección timeline */}
        <div className="w-full">
          <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-5">Reportes del proyecto</h3>

          {loading ? (
            <div className="text-center text-gray-400 dark:text-gray-500 py-12">Cargando reportes...</div>
          ) : error ? (
            <div className="text-center text-red-400 py-8">{error}</div>
          ) : bitacora.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <span className="text-5xl">📋</span>
              <p className="text-blue-700 dark:text-blue-400 font-bold text-lg text-center leading-snug">
                Aún no hay reportes en esta obra.<br />¡Sé el primero en documentar el avance!
              </p>
            </div>
          ) : (
            <div className="relative flex flex-col gap-6">
              {/* Línea vertical */}
              <div className="absolute left-[18px] top-3 bottom-3 w-0.5 bg-blue-100 dark:bg-blue-900/50 rounded-full z-0" />
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
                        <div className="w-[14px] h-[14px] bg-blue-500 rounded-full border-2 border-white dark:border-gray-900 shadow-md z-10 group-hover:scale-110 transition" />
                      </div>
                      {/* Card */}
                      <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow p-4 flex flex-col gap-2 hover:shadow-lg transition-all duration-150">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                          <span>{fechaFormateada || 'Sin fecha'}</span>
                          <span>·</span>
                          <span className="font-medium text-blue-600 dark:text-blue-400">
                            {report.autor || report.usuario || report.creador || report.user || 'Usuario'}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-blue-700 dark:text-blue-400">
                          {report.titulo || report.titulo_reporte || report.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-line">
                          {report.descripcion || report.descripcion_reporte || report.description}
                        </p>
                        {Array.isArray(report.fotos) && report.fotos.length > 0 && report.fotos[0] && (
                          <img
                            src={report.fotos[0]}
                            alt={report.titulo || report.titulo_reporte || report.title}
                            className="w-full aspect-video object-cover rounded-xl border border-gray-100 dark:border-gray-700 mt-1"
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

      {/* Barra inferior — solo en mobile (< md) */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-blue-50/90 dark:bg-gray-900/90 backdrop-blur-sm border-t border-blue-100 dark:border-gray-700 flex items-center gap-3 px-4"
        style={{ paddingTop: '0.75rem', paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      >
        {/* Volver */}
        <button
          className="flex items-center justify-center gap-2 flex-1 py-3 rounded-full bg-white dark:bg-gray-800 border border-blue-200 dark:border-gray-600 text-blue-600 dark:text-blue-400 font-semibold shadow-sm hover:bg-blue-50 dark:hover:bg-gray-700 active:scale-95 transition min-h-[52px] text-base"
          onClick={() => navigate(-1)}
        >
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <path d="M11 14L6 9L11 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Volver
        </button>
        {/* Nuevo Reporte */}
        <button
          className="flex items-center justify-center flex-[2] py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-blue-500 active:scale-95 transition min-h-[52px] text-base"
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
