import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Formulario from './components/Formulario';
import { TableReg } from './components/TableReg';


function App() {
  return (
    <Router>
      <div className="app-fondo">
        <div className="d-flex justify-content-center align-items-center min-vh-100 flex-column">

          {/* 🔵 Barra de navegación arriba */}
          <nav className="mb-4">
            <Link to="/" className="btn btn-primary me-2">Formulario</Link>
            <Link to="/tabla" className="btn btn-primary me-2">Tabla</Link>
          </nav>

          {/* 🟢 Mostrar Formulario con formato de tarjeta centrada */}
          <Routes>
            <Route path="/" element={
              <div className="formulario-card w-90" style={{ maxWidth: '600px' }}>
                <h4 className="text-center mb-4">Registro de Puertos de Red</h4>
                <Formulario />
              </div>
            } />
            <Route path="/tabla" element={
              <div className="tabla-card w-100 px-4" style={{ maxWidth: '1000px' }}>
                <h4 className="text-center mb-4">Tabla de Registro</h4>
                <TableReg />
              </div>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
