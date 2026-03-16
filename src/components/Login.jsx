import { useState } from 'react';
import logo from '../assets/imagen-20260122-160504-585003df.png';
import { StatusChecker } from './StatusChecker.jsx';

export function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    // Validación básica de email
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getEmailError = (email) => {
    const hasAt = email.includes('@');
    const hasDot = email.includes('.');
    if (!hasAt && !hasDot) {
      return "El correo debe contener '@' y un dominio válido (ejemplo: .com).";
    }
    if (!hasAt) {
      return "El correo debe contener el símbolo '@'.";
    }
    if (!hasDot) {
      return "El correo debe tener un dominio válido (ejemplo: .com).";
    }
    return "Ingresa un correo electrónico válido.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Por favor ingresa tu correo electrónico.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Correo electrónico inválido.');
      return;
    }
    if (!password) {
      setError('Por favor ingresa tu contraseña.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        // Guardar token en localStorage
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        onLogin(data.usuario);
      }
    } catch (err) {
      setError('No se pudo conectar al servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setError('La recuperación de contraseña aún no está disponible.');
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 p-6 w-96 bg-white rounded shadow z-10">
        <img src={logo} alt="Logo CivilTrack" className="w-24 h-24 mb-2" />
        <h2 className="text-xl font-bold mb-2 text-blue-600">Iniciar sesión</h2>
        <input
          type="text"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-2 rounded w-full"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="bg-blue-500 text-white py-2 rounded w-full hover:bg-blue-600 transition" disabled={loading}>
          {loading ? 'Accediendo...' : 'Acceder'}
        </button>
        <a href="#" onClick={handleForgotPassword} className="text-blue-500 text-sm mt-2 hover:underline">¿Olvidaste tu contraseña?</a>
      </form>
      <div className="fixed bottom-4 right-4 z-0">
        <StatusChecker />
      </div>
    </div>
  );
}
