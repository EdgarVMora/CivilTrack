import { API_URL } from '../config/api.js';

export async function fetchProjectBitacora(projectId) {
  const res = await fetch(`${API_URL}/proyectos/${projectId}/bitacora`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error fetching project bitácora');
  const data = await res.json();
  return Array.isArray(data.reportes) ? data.reportes : [];
}

/** Devuelve { project, bitacora } usando el mismo endpoint de bitácora. */
export async function fetchProjectWithBitacora(projectId) {
  const res = await fetch(`${API_URL}/proyectos/${projectId}/bitacora`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error fetching project');
  const data = await res.json();
  return {
    project: data.proyecto || null,
    bitacora: Array.isArray(data.reportes) ? data.reportes : [],
  };
}
