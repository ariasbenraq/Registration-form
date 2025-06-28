import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Formulario from './components/Formulario';
import { TableReg } from './components/TableReg';
import { AnimatePresence, motion } from 'framer-motion';
import NavBarOffCanvas from './components/NavBarOffCanvas'; // 👈 Nuevo navbar

function AnimatedRoutes() {
  const location = useLocation();

  return (

    <div className="contenedor-principal d-flex justify-content-center align-items-center min-vh-100 flex-column">
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
            <motion.div
              className="tabla-card w-100 px-4 mb-5"
              style={{ maxWidth: '1000px' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
            >
              <h4 className="text-center mb-4">Tabla de Registro</h4>
              <TableReg />
            </motion.div>
          } />
          <Route path="/home" element={
            <motion.div
              className="text-center mt-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h4>Bienvenido a la pantalla Home (en construcción)</h4>
            </motion.div>
          } />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-fondo">
        <NavBarOffCanvas /> {/* 🔵 Navbar con hamburguesa */}
        <div className="d-flex justify-content-center align-items-center min-vh-100 flex-column">
          <AnimatedRoutes />
        </div>
      </div>
    </Router>
  );
}

export default App;
