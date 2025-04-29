import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Formulario from './components/Formulario';
import TaskTable from './components/Table';


function App() {
  return (
    <Router>
      <div className="app-fondo">
        <div className="d-flex justify-content-center align-items-center min-vh-100 flex-column">

          {/* 🔵 Barra de navegación arriba */}
          <nav className="mb-4">
            <Link to="/" className="btn btn-primary me-2">Formulario</Link>
            <Link to="/tabla" className="btn btn-secondary">Tabla</Link>
          </nav>

          {/* 🔵 Contenedor que cambia según la ruta */}
          <div className="formulario-card w-90" style={{ maxWidth: '600px' }}>
            <Routes>
              <Route path="/" element={<>
                <h4 className="text-center mb-4">Registro de Puertos de Red</h4>
                <Formulario />
              </>} />
              <Route path="/tabla" element={<TaskTable />} />
            </Routes>
          </div>

        </div>
      </div>
    </Router>
  );
}

export default App;
