import './App.css';

function App() {
  const backendUrl = import.meta.env.DEV
    ? 'http://localhost:3000'
    : 'https://api.5stack.online';

  return (
    <div>
      <h1>Steam Login Demo</h1>
      <a href={`${backendUrl}/auth/steam`}>
        <button>Login with Steam</button>
      </a>
    </div>
  );
}

export default App;
