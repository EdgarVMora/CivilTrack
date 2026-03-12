import React from 'react';
import { Login } from './components/Login.jsx';
import { StatusChecker } from './components/StatusChecker.jsx';

function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    // Revisar si hay token y usuario guardado
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');
    if (token && usuario) {
      setUser(JSON.parse(usuario));
    }
  }, []);

  const handleLogin = (usuario) => {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    setUser(usuario);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <h1 className="text-3xl font-bold underline mb-8 text-blue-600">
        CivilTrack
      </h1>
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-green-600 font-semibold mb-4">Welcome, {user.nombre}!</p>
          <StatusChecker />
          <button onClick={handleLogout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
            Cerrar Sesion 
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
