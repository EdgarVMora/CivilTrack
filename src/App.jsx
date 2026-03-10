import React from 'react';
import { Login } from './components/Login.jsx';
import { StatusChecker } from './components/StatusChecker.jsx';

function App() {
  const [user, setUser] = React.useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <h1 className="text-3xl font-bold underline mb-8 text-blue-600">
        CivilTrack
      </h1>
      {!user ? (
        <Login onLogin={setUser} />
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-green-600 font-semibold mb-4">Welcome, {user.nombre}!</p>
          <StatusChecker />
        </div>
      )}
    </div>
  );
}

export default App;
