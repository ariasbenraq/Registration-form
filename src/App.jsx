import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Formulario from './components/Formulario';
import { Sortingtable } from './components/SortingTable';
import { AnimatePresence, motion } from 'framer-motion';
import { FilteringTable } from './components/FilteringTable';
import { PaginationTable } from './components/PaginationTable';

const MotionLink = motion(Link);


function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div
            className="formulario-card w-80"
            style={{ maxWidth: '900px' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            <h4 className="text-center mb-4">Registro de Puertos de Red</h4>
            <Formulario />
          </motion.div>
        } />
        <Route path="/tabla" element={
          <motion.div className="tabla-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}>

            <h4 className="text-center mb-4">Tabla de Registro</h4>
            <PaginationTable />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="app-fondo">
        <div className="d-flex justify-content-center align-items-center min-vh-100 flex-column">

          {/* 🔵 Barra de navegación */}
          <nav className="mb-4 mt-4">
            <Link to="/" className="btn btn-primary me-2">Formulario</Link>
            <Link to="/tabla" className="btn btn-primary me-2">Tabla</Link>
          </nav>

          {/* 🧭 Transición entre vistas */}
          <AnimatedRoutes />
        </div>
      </div>
    </Router>
  );
}

export default App;
