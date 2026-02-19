import { StatusChecker } from './components/StatusChecker.jsx';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold underline mb-8">
        CivilTrack
      </h1>
      <StatusChecker />
    </div>
  );
}

export default App;
