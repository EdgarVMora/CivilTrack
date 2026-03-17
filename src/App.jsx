import React from 'react';
import { Login } from './components/Login.jsx';
import { Dashboard } from './components/Dashboard.jsx';

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
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center">
      <div className="w-full flex-1 flex items-center justify-center">
        {!user ? (
          <div className="w-full flex flex-col items-center">
            <Login onLogin={handleLogin} />
          </div>
        ) : (
          <Dashboard user={user} onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
}

export default App;
