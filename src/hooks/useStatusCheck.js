import { useState, useCallback } from 'react';
import { getStatus } from '../api/estado.api.js';

/**
 * Hook para verificar el estado de conexión con el backend.
 */
export function useStatusCheck() {
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const checkStatus = useCallback(async () => {
    setCargando(true);
    setError('');
    setMensaje('');
    try {
      const data = await getStatus();
      setMensaje(data.mensaje || 'Sin mensaje');
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el backend');
    } finally {
      setCargando(false);
    }
  }, []);

  return { mensaje, cargando, error, checkStatus };
}
