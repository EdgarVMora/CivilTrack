import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/imagen-20260122-160504-585003df.png';
import { StatusChecker } from './StatusChecker.jsx';

export function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        if (data.usuario) {
          localStorage.setItem('usuario', JSON.stringify(data.usuario));
        }
        onLogin(data.usuario);
        navigate('/dashboard');
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

  // Limpiar error al cambiar campos
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center bg-blue-50 px-2 py-8 min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 p-4 sm:p-6 w-full max-w-md bg-white rounded shadow z-10 sm:mx-auto mx-2">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-2">CivilTrack</h1>
        <img src={logo} alt="Logo CivilTrack" className="w-20 h-20 mb-2 sm:w-24 sm:h-24" />
        <h2 className="text-xl font-bold mb-2 text-blue-600">Iniciar sesión</h2>
        <input
          type="text"
          placeholder="Correo electrónico"
          value={email}
          onChange={handleEmailChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={handlePasswordChange}
          className="border p-2 rounded w-full"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="bg-blue-500 text-white py-2 rounded w-full hover:bg-blue-600 transition" disabled={loading}>
          {loading ? 'Accediendo...' : 'Acceder'}
        </button>
        <a href="#" onClick={handleForgotPassword} className="text-blue-500 text-sm mt-2 hover:underline">¿Olvidaste tu contraseña?</a>
      </form>
      <div className="fixed bottom-4 right-4 z-0">
        <StatusChecker small />
      </div>
    </div>
  );
}
