import './App.css';
import Formulario from './components/Formulario';

function App() {
  return (
    <div className="app-fondo">
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="formulario-card">
          <h4 className="text-center mb-4">Registro de Puertos de Red</h4>
          <Formulario />
        </div>
      </div>
    </div>
  );
}

export default App;
