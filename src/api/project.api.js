import { API_URL } from '../config/api.js';

/**
 * Obtiene la bitácora (reportes) de un proyecto por ID.
 * @param {string|number} projectId
 * @returns {Promise<Array>} Lista de reportes
 */
export async function fetchProjectBitacora(projectId) {
  const res = await fetch(`${API_URL}/proyectos/${projectId}/bitacora`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error fetching project bitácora');
  const data = await res.json();
  // El backend devuelve { success, proyecto, reportes: [...] }
  return Array.isArray(data.reportes) ? data.reportes : [];
}
