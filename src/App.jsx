import { Login } from './components/Login.jsx';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <h1 className="text-3xl font-bold underline mb-8 text-blue-600">
        CivilTrack
      </h1>
      <Login onLogin={() => {}} />
    </div>
  );
}

export default App;
