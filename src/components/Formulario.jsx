import { useState } from 'react';
import Swal from 'sweetalert2';
import { validarFormulario, formatearDatos } from '../utils/validaciones';
import { enviarRegistro } from '../services/registroService';

const Formulario = () => {
  const [formData, setFormData] = useState({
    sede: '',
    proyecto: '',
    puerto: '',
    etiqueta: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resultadoValidacion = validarFormulario(formData);
    if (!resultadoValidacion.valido) {
      Swal.fire('Error', resultadoValidacion.mensaje, 'warning');
      return;
    }

    const datosFormateados = formatearDatos(formData);

    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      html: `
        <p><strong>Sede:</strong> ${datosFormateados.sede}</p>
        <p><strong>Proyecto:</strong> ${datosFormateados.proyecto}</p>
        <p><strong>Puerto:</strong> ${datosFormateados.puerto}</p>
        <p><strong>Etiqueta:</strong> ${datosFormateados.etiqueta}</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar',
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await enviarRegistro(datosFormateados);
      Swal.fire('¡Éxito!', 'Información enviada correctamente.', 'success');
      setFormData({ sede: '', proyecto: '', puerto: '', etiqueta: '' });
    } catch (error) {
      Swal.fire('Error', 'No se pudo registrar la información.', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Sede</label>
        <input
          type="text"
          name="sede"
          className="form-control"
          value={formData.sede}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Proyecto</label>
        <input
          type="text"
          name="proyecto"
          className="form-control"
          value={formData.proyecto}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Puerto del Switch</label>
        <input
          type="text"
          name="puerto"
          className="form-control"
          value={formData.puerto}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Etiqueta del Faceplate</label>
        <input
          type="text"
          name="etiqueta"
          className="form-control"
          value={formData.etiqueta}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="btn btn-primary w-100">Enviar</button>
    </form>
  );
  
};

export default Formulario;
