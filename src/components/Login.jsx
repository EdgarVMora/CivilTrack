import { useState } from 'react';
import logo from '../assets/imagen-20260122-160504-585003df.png';

export function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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
        setError(data.message || 'Error de autenticación');
      } else {
        // Guardar token en localStorage
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        onLogin(data.usuario);
      }
    } catch (err) {
      setError('No se pudo conectar al servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setError('Password recovery is not available yet.');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 p-6 w-96 bg-white rounded shadow">
      <img src={logo} alt="Logo CivilTrack" className="w-24 h-24 mb-2" />
      <h2 className="text-xl font-bold mb-2 text-blue-600">Iniciar sesión</h2>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border p-2 rounded w-full"
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border p-2 rounded w-full"
        required
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button type="submit" className="bg-blue-500 text-white py-2 rounded w-full hover:bg-blue-600 transition" disabled={loading}>
        {loading ? 'Accediendo...' : 'Acceder'}
      </button>
      <a href="#" onClick={handleForgotPassword} className="text-blue-500 text-sm mt-2 hover:underline">¿Olvidaste tu contraseña?</a>
    </form>
  );
}
