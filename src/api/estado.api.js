import { API_URL } from '../config/api.js';

/**
 * Verifica el estado de conexión con el backend.
 * @returns {Promise<{ mensaje: string }>}
 * @throws {Error} Si la petición falla
 */
export async function getStatus() {
  const res = await fetch(`${API_URL}/status`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Error en la petición');
  }

  return data;
}
