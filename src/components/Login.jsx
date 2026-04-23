import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/imagen-20260122-160504-585003df.png';
import { StatusChecker } from './StatusChecker.jsx';
import { API_URL } from '../config/api.js';

export function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const getEmailError = (email) => {
    const hasAt = email.includes('@');
    const hasDot = email.includes('.');
    if (!hasAt && !hasDot) return "El correo debe contener '@' y un dominio válido (ejemplo: .com).";
    if (!hasAt) return "El correo debe contener el símbolo '@'.";
    if (!hasDot) return "El correo debe tener un dominio válido (ejemplo: .com).";
    return "Ingresa un correo electrónico válido.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Por favor ingresa tu correo electrónico.'); return; }
    if (!validateEmail(email)) { setError(getEmailError(email)); return; }
    if (!password) { setError('Por favor ingresa tu contraseña.'); return; }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ correo: email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.message === 'Usuario no encontrado' && validateEmail(email)) {
          setError('El correo electrónico no está registrado.');
        } else if (data.message === 'Contraseña incorrecta') {
          setError('La contraseña es incorrecta.');
        } else {
          setError(data.message || 'Error de autenticación.');
        }
      } else {
        onLogin(data.usuario);
        navigate('/dashboard');
      }
    } catch {
      setError('No se pudo conectar al servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setError('La recuperación de contraseña aún no está disponible.');
  };

  const handleEmailChange = (e) => { setEmail(e.target.value); if (error) setError(''); };
  const handlePasswordChange = (e) => { setPassword(e.target.value); if (error) setError(''); };

  return (
    <div className="relative w-full flex flex-col items-center justify-center bg-blue-50 dark:bg-gray-900 px-4 min-h-[100dvh]"
         style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 p-6 w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
      >
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 text-center">CivilTrack</h1>
        <img src={logo} alt="Logo CivilTrack" className="w-16 h-16 md:w-20 md:h-20" />
        <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">Iniciar sesión</h2>

        <input
          type="text"
          placeholder="Correo electrónico"
          value={email}
          onChange={handleEmailChange}
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 py-3 px-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={handlePasswordChange}
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 py-3 px-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500"
        />

        {error && <p className="text-red-600 dark:text-red-400 text-sm w-full">{error}</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white py-3 rounded-xl w-full font-semibold min-h-[44px] hover:bg-blue-600 active:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Accediendo...' : 'Acceder'}
        </button>

        <a
          href="#"
          onClick={handleForgotPassword}
          className="text-blue-500 dark:text-blue-400 text-sm hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </a>

        <div className="mt-2 w-full flex justify-center">
          <StatusChecker small />
        </div>
      </form>
    </div>
  );
}
