import { AUTH_ME_URL, SESSION_USER_KEY } from '../config/api.js';

/**
 * Obtiene el usuario actual usando la cookie httpOnly (sesión).
 * Si tu backend no tiene este endpoint, el arranque usa el perfil en sessionStorage.
 */
export async function fetchCurrentUser() {
  try {
    const res = await fetch(AUTH_ME_URL, {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) return null;
    const data = await res.json();
    const usuario = data?.usuario ?? data?.user ?? data;
    if (!usuario || typeof usuario !== 'object') return null;
    return usuario;
  } catch {
    return null;
  }
}

export function readStoredUserProfile() {
  try {
    const raw = sessionStorage.getItem(SESSION_USER_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw);
    return u && typeof u === 'object' ? u : null;
  } catch {
    sessionStorage.removeItem(SESSION_USER_KEY);
    return null;
  }
}

export function persistUserProfile(usuario) {
  if (!usuario || typeof usuario !== 'object') return;
  try {
    sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(usuario));
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearStoredUserProfile() {
  sessionStorage.removeItem(SESSION_USER_KEY);
}
