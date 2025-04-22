import { useState } from 'react';
import Swal from 'sweetalert2';
import {
  validarFormulario,
  formatearDatos,
  formatearTitulo,
  buscarCoincidenciasLevenshtein,
  normalizarTexto
} from '../utils/validaciones';

import { enviarRegistro, agregarSede, agregarProyecto, fetchOpciones } from '../services/apiService';
import AutoInput from './AutoInput';

const Formulario = () => {
  const [errores, setErrores] = useState({
    sede: '',
    proyecto: '',
  });

  const [formData, setFormData] = useState({
    sede: '',
    proyecto: '',
    puerto: '',
    etiqueta: '',
  });

  const [refreshCounter, setRefreshCounter] = useState(0);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const normalizarTexto = (texto) =>
    texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase();

  const buscarCoincidencias = (lista, valor) => {
    const valorPalabras = normalizarTexto(valor).split(' ').filter(p => p);
    return lista.filter(item => {
      const itemPalabras = normalizarTexto(item).split(' ').filter(p => p);
      // Chequea si al menos una palabra coincide exactamente
      return valorPalabras.some(palabra => itemPalabras.includes(palabra));
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const resultadoValidacion = validarFormulario(formData);
    if (!resultadoValidacion.valido) {
      Swal.fire('Error', resultadoValidacion.mensaje, 'warning');
      return;
    }

    // 🟢 FORMATEAMOS SEDE Y PROYECTO
    const sedeFormateada = formatearTitulo(formData.sede);
    const proyectoFormateado = formatearTitulo(formData.proyecto);

    const datosFormateados = {
      ...formatearDatos(formData),
      sede: sedeFormateada,
      proyecto: proyectoFormateado
    };

    const sedes = await fetchOpciones('sedes');
    const proyectos = await fetchOpciones('proyectos');

    const sedeExiste = sedes.some((s) => normalizarTexto(s) === normalizarTexto(sedeFormateada));
    const proyectoExiste = proyectos.some((p) => normalizarTexto(p) === normalizarTexto(proyectoFormateado));

    const buscarCoincidencias = (lista, valor) => {
      const valorPalabras = normalizarTexto(valor).split(' ').filter(p => p);
      return lista.filter(item => {
        const itemPalabras = normalizarTexto(item).split(' ').filter(p => p);
        return valorPalabras.some(palabra => itemPalabras.includes(palabra));
      });
    };

    // 🟢 VALIDACIÓN DE SEDE
    try {
      if (!sedeExiste) {
        const coincidencias = buscarCoincidenciasLevenshtein(sedes, sedeFormateada);

        if (coincidencias.length > 0) {
          const advertencia = await Swal.fire({
            title: '⚠️ Coincidencia detectada',
            html: `
              <p>La sede <strong>"${sedeFormateada}"</strong> es muy similar a una o varias registradas:</p>
              <ul style="text-align: left;">
                ${coincidencias.map(c => `<li>${c}</li>`).join('')}
              </ul>
              <p>¿Estás seguro de que deseas registrarla de todas maneras?</p>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, registrar igual',
            cancelButtonText: 'Cancelar'
          });

          if (!advertencia.isConfirmed) {
            return; // 🚫 Detiene si el usuario no confirma
          }
        }

        await agregarSede(sedeFormateada); // ✅ Solo registra si acepta
      }
    } catch (error) {
      const mensajeError = error.message || 'Ocurrió un error al intentar registrar la sede.';
      await Swal.fire({
        title: '⚠️ Sede duplicada',
        text: mensajeError,
        icon: 'warning',
        confirmButtonText: 'Entendido',
      });
      return; // 🚫 Detiene el flujo
    }

    // 🟠 VALIDACIÓN DE PROYECTO
    try {
      if (!proyectoExiste) {
        const coincidenciasProyecto = buscarCoincidenciasLevenshtein(proyectos, proyectoFormateado, 3);

        if (coincidenciasProyecto.length > 0) {
          const advertenciaProyecto = await Swal.fire({
            title: '⚠️ Coincidencia de proyecto detectada',
            html: `
              <p>El proyecto <strong>"${proyectoFormateado}"</strong> es muy similar a uno o varios registrados:</p>
              <ul style="text-align: left;">
                ${coincidenciasProyecto.map(p => `<li>${p}</li>`).join('')}
              </ul>
              <p>¿Deseas registrarlo de todas maneras?</p>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, registrar igual',
            cancelButtonText: 'Cancelar'
          });

          if (!advertenciaProyecto.isConfirmed) {
            return; // 🚫 Detiene si el usuario no confirma
          }
        }

        await agregarProyecto(proyectoFormateado); // ✅ Solo registra si acepta
      }
    } catch (error) {
      const mensajeError = error.message || 'Ocurrió un error al intentar registrar el proyecto.';
      await Swal.fire({
        title: '⚠️ Proyecto duplicado',
        text: mensajeError,
        icon: 'warning',
        confirmButtonText: 'Entendido',
      });
      return; // 🚫 Detiene si hay error del backend
    }


    // ✅ CONFIRMACIÓN FINAL PARA EL ENVÍO DE TODO EL REGISTRO:
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      html: `
        <p><strong>Sede:</strong> ${sedeFormateada}</p>
        <p><strong>Proyecto:</strong> ${proyectoFormateado}</p>
        <p><strong>Puerto:</strong> ${datosFormateados.puerto}</p>
        <p><strong>Etiqueta:</strong> ${datosFormateados.etiqueta}</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar',
    });

    if (!confirmacion.isConfirmed) return;

    // 🚀 ENVÍO FINAL
    try {
      await enviarRegistro(datosFormateados);
      Swal.fire('¡Éxito!', 'Información enviada correctamente.', 'success');
      setFormData({ sede: '', proyecto: '', puerto: '', etiqueta: '' });
      setRefreshCounter((prev) => prev + 1); // 🔥 Esto refresca las opciones del formulario
    } catch (error) {
      Swal.fire('Error', 'No se pudo registrar la información.', 'error');
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <AutoInput
        label="Sede"
        name="sede"
        value={formData.sede}
        onChange={handleChange}
        endpoint="sedes"
        refresh={refreshCounter}
      />
      {errores.sede && <div style={{ color: 'red' }}>{errores.sede}</div>}

      <AutoInput
        label="Proyecto"
        name="proyecto"
        value={formData.proyecto}
        onChange={handleChange}
        endpoint="proyectos"
        refresh={refreshCounter}
      />
      {errores.proyecto && <div style={{ color: 'red' }}>{errores.proyecto}</div>}

      <div className="mb-3">
        <label className="form-label">Puerto del Switch</label>
        <input
          type="text"
          name="puerto"
          className="form-control"
          value={formData.puerto}
          onChange={handleChange}
          refresh={refreshCounter}
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
          refresh={refreshCounter}
        />
      </div>
      <button type="submit" className="btn btn-primary w-100">Enviar</button>
    </form>
  );
};

export default Formulario;
