import React from 'react';
import { Login } from './components/Login.jsx';
import { Dashboard } from './components/Dashboard.jsx';
import {
  fetchCurrentUser,
  readStoredUserProfile,
  persistUserProfile,
  clearStoredUserProfile,
} from './api/auth.api.js';

function App() {
  const [user, setUser] = React.useState(null);
  const [sessionChecked, setSessionChecked] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const fromApi = await fetchCurrentUser();
        if (!cancelled && fromApi) {
          persistUserProfile(fromApi);
          setUser(fromApi);
        } else if (!cancelled) {
          const stored = readStoredUserProfile();
          if (stored) {
            setUser(stored);
          }
        }
      } finally {
        if (!cancelled) {
          setSessionChecked(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogin = (usuario) => {
    persistUserProfile(usuario);
    setUser(usuario);
  };

  const handleLogout = () => {
    clearStoredUserProfile();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center">
      <div className="w-full flex-1 flex items-center justify-center">
        {!sessionChecked ? (
          <p className="text-blue-600">Cargando sesión...</p>
        ) : !user ? (
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
