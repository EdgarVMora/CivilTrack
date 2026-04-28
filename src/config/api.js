/**
 * Configuración de la API.
 * En desarrollo usa el proxy de Vite (/api -> localhost:3000).
 */
export const API_URL = '/api';

/** GET que devuelve el usuario actual con la cookie de sesión (ajusta si tu backend usa otra ruta). */
export const AUTH_ME_URL =
  import.meta.env.VITE_AUTH_ME_URL?.trim() || `${API_URL}/auth/me`;

/** Perfil de usuario en sessionStorage (no guardar el JWT aquí). */
export const SESSION_USER_KEY = 'civiltrack_usuario';

/**
 * GET del PDF del proyecto (backend: GET /api/proyectos/:id_proyecto/pdf).
 * Override opcional: `VITE_BITACORA_PDF_URL=/api/ruta/:id`
 */
export function getBitacoraPdfUrl(projectId) {
  const template = import.meta.env.VITE_BITACORA_PDF_URL?.trim();
  if (template) {
    return template
      .replaceAll(':id', String(projectId))
      .replaceAll('{id}', String(projectId));
  }
  return `${API_URL}/proyectos/${projectId}/pdf`;
}
