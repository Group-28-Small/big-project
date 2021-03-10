import logo from './logo.svg';
import './App.css';
import { frontend_address, backend_address } from 'big-project-common';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href={frontend_address("")}
          target="_blank"
          rel="noopener noreferrer"
        >
          frontend link
        </a>
        <a
          className="App-link"
          href={backend_address("")}
          target="_blank"
          rel="noopener noreferrer"
        >
          backend link
        </a>
      </header>
    </div>
  );
}

export default App;
