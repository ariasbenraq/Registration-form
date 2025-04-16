import { useState } from 'react';
import './App.css';
import Swal from 'sweetalert2';


function App() {
  const [formData, setFormData] = useState({
    sede: '',
    proyecto: '',
    puerto: '',
    etiqueta: '',
  });

  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let { sede, proyecto, puerto, etiqueta } = formData;

    // Limpiar espacios al inicio y fin
    sede = sede.trim();
    proyecto = proyecto.trim();
    puerto = puerto.trim();
    etiqueta = etiqueta.replace(/\s+/g, '').toUpperCase(); // Eliminar TODOS los espacios y convertir a mayúsculas

    // Validación específica por campo
    if (!sede.trim()) {
      return Swal.fire('Campo requerido', 'Por favor, ingresa una sede.', 'warning');
    }

    if (!proyecto.trim()) {
      return Swal.fire('Campo requerido', 'Por favor, ingresa un proyecto.', 'warning');
    }

    if (!puerto.trim()) {
      return Swal.fire('Campo requerido', 'Por favor, ingresa el puerto del switch.', 'warning');
    }

    if (!etiqueta.trim()) {
      return Swal.fire('Campo requerido', 'Por favor, ingresa una etiqueta de faceplate.', 'warning');
    }

    // Validar Puerto del Switch: Ejemplo válido 101 → 1/0/1
    const puertoRegex = /^([1-9])0([1-9]|[1-4][0-8])$/;
    if (!puertoRegex.test(puerto)) {
      return Swal.fire(
        'Formato de Puerto inválido',
        'Debe ser una combinación como 101 o 3048, que se transformará en 1/0/1 o 3/0/48.',
        'error'
      );
    }

    // Validar etiqueta Faceplate (solo letras, números y puntos)
    const etiquetaValida = /^[A-Z0-9.]+$/;
    if (!etiquetaValida.test(etiqueta)) {
      return Swal.fire(
        'Etiqueta inválida',
        'La etiqueta solo debe contener letras, números o puntos.',
        'error'
      );
    }

    // Transformar puerto: 3048 → 3/0/48
    const stack = puerto[0];
    const interfaz = puerto.slice(2);
    const puertoFormateado = `${stack}/0/${interfaz}`;

    const datosFinales = {
      sede,
      proyecto,
      puerto: puertoFormateado,
      etiqueta
    };

    try {
      const confirmacion = await Swal.fire({
        title: '¿Estás seguro?',
        html: `
          <p><strong>Sede:</strong> ${sede}</p>
          <p><strong>Proyecto:</strong> ${proyecto}</p>
          <p><strong>Puerto:</strong> ${puertoFormateado}</p>
          <p><strong>Etiqueta:</strong> ${etiqueta}</p>
          <p class="text-muted">Confirma que los datos son correctos antes de enviarlos.</p>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, enviar',
        cancelButtonText: 'Cancelar',
      });

      if (!confirmacion.isConfirmed) return;

      await fetch('https://script.google.com/macros/s/AKfycbxE9wKVihifygcycSoaCWT02EnRKwWRPiNqQMXyKgiHR7h8qBu7dCwfGSZHEu_TOeFi6A/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosFinales),
      });

      Swal.fire('¡Éxito!', 'La información fue registrada correctamente.', 'success');
      setFormData({ sede: '', proyecto: '', puerto: '', etiqueta: '' });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Ocurrió un error al enviar los datos.', 'error');
    }

  };



  return (
    <div className='app-fondo'>
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="formulario-card">
          <h4 className="text-center mb-4">Registro de Puertos de Red</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Sede</label>
              <input type="text" name="sede" className="form-control" value={formData.sede} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Proyecto</label>
              <input type="text" name="proyecto" className="form-control" value={formData.proyecto} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Puerto del Switch</label>
              <input type="text" name="puerto" className="form-control" value={formData.puerto} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Etiqueta del Faceplate</label>
              <input type="text" name="etiqueta" className="form-control" value={formData.etiqueta} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-primary w-100">Enviar</button>
          </form>
          {mensaje && <p className="mt-3 alert alert-info">{mensaje}</p>}
        </div>
      </div>
    </div>
  );

}

export default App;
