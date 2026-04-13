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
