import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { validarFormulario, formatearDatos, formatearTitulo, buscarCoincidenciasLevenshtein } from '../utils/validaciones';
import { enviarRegistro, agregarSede, agregarProyecto, fetchOpciones } from '../services/apiService';
import AutoInput from './AutoInput';
import SubmitButton from './SubmitButton';
import PuertoEtiquetaGroup from './PuertoEtiquetaGroup'


const Formulario = () => {
  const [errores, setErrores] = useState({ sede: '', proyecto: '' });
  const [formData, setFormData] = useState({ sede: '', proyecto: '', puerto: '', etiqueta: '' });
  const [sedesCache, setSedesCache] = useState([]);
  const [proyectosCache, setProyectosCache] = useState([]);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pares, setPares] = useState([{ puerto: '', etiqueta: '' }]);



  // 🟢 Cargar Sedes y Proyectos solo una vez al montar el componente:
  useEffect(() => {
    const cargarOpciones = async () => {
      const sedes = await fetchOpciones('sedes');
      const proyectos = await fetchOpciones('proyectos');
      setSedesCache(sedes);
      setProyectosCache(proyectos);
    };
    cargarOpciones();
  }, []);

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

  const handlePairChange = (index, field, value) => {
    const nuevosPares = [...pares];
    nuevosPares[index][field] = value;
    setPares(nuevosPares);
  };

  const handleAddPair = () => {
    setPares([...pares, { puerto: '', etiqueta: '' }]);
  };

  const handleRemovePair = (index) => {
    const nuevosPares = pares.filter((_, i) => i !== index);
    setPares(nuevosPares);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true); // ⬅️ Activa el "pending"

    const resultadoValidacion = validarFormulario(formData);
    if (!resultadoValidacion.valido) {
      Swal.fire('Error', resultadoValidacion.mensaje, 'warning');
      setIsSubmitting(false); // ⬅️ Desactiva si hubo error
      return;
    }

    // 🟢 Formateo para el resumen:
    const sedeFormateada = formatearTitulo(formData.sede);
    const proyectoFormateado = formatearTitulo(formData.proyecto);
    const datosFormateados = {
      ...formatearDatos(formData),
      sede: sedeFormateada,
      proyecto: proyectoFormateado,
      pares: pares // ⬅️ Ahora mandas el array de pares
    };

    // 🚀 1️⃣ Mostrar el resumen ANTES de validar duplicados:
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

    if (!confirmacion.isConfirmed) {
      setIsSubmitting(false); // ⬅️ Desactiva si se cancela
      return;
    }


    // 🚀 2️⃣ Validación de existencia (después del resumen):
    const sedeExiste = sedesCache.some((s) => normalizarTexto(s) === normalizarTexto(sedeFormateada));
    const proyectoExiste = proyectosCache.some((p) => normalizarTexto(p) === normalizarTexto(proyectoFormateado));

    // 🟡 Si la sede no existe:
    if (!sedeExiste) {
      const coincidencias = buscarCoincidenciasLevenshtein(sedesCache, sedeFormateada);
      let force = false

      if (coincidencias.length > 0) {
        const confirmSimilar = await Swal.fire({
          title: '⚠️ Coincidencia detectada',
          html: `
            <div style="text-align: center; font-size: 16px;">
              <p style="margin-bottom: 8px;">
                <strong>⚠️ Ya existe una sede similar:</strong>
              </p>
              <div style="background-color: #f8f9fa; padding: 10px 15px; border-radius: 8px; border: 1px solid #dee2e6; margin-bottom: 15px;">
                ${coincidencias.map(c => `<div style="margin: 5px 0; padding-left: 10px;">• ${c}</div>`).join('')}
              </div>
              <p>¿Deseas registrar <strong>"${sedeFormateada}"</strong> de todos modos?</p>
            </div>
          `,

          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, registrar igual',
          cancelButtonText: 'Cancelar',
        });
        if (!confirmSimilar.isConfirmed) {
          setIsSubmitting(false);
        return;
        }
        force = true; 
      }
      await agregarSede(sedeFormateada, force);
      // Actualiza la cache:
      const nuevasSedes = await fetchOpciones('sedes');
      setSedesCache(nuevasSedes);
    }

    // 🟡 Si el proyecto no existe:
    if (!proyectoExiste) {
      const coincidenciasProyecto = buscarCoincidenciasLevenshtein(proyectosCache, proyectoFormateado);
      let force = false;

      if (coincidenciasProyecto.length > 0) {
        const confirmProyecto = await Swal.fire({
          title: '⚠️ Proyecto similar detectado',
          html: `
                <div style="text-align: center; font-size: 16px;">
                  <p style="margin-bottom: 8px;">
                    <strong>⚠️ Ya existe un proyecto similar:</strong>
                  </p>
                  <div style="background-color: #f8f9fa; padding: 10px 15px; border-radius: 8px; border: 1px solid #dee2e6; margin-bottom: 15px;">
                    ${coincidenciasProyecto.map(p => `<div style="margin: 5px 0; padding-left: 10px;">• ${p}</div>`).join('')}
                  </div>
                  <p>¿Deseas registrar <strong>"${proyectoFormateado}"</strong> de todos modos?</p>
                </div>
              `,

          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, registrar igual',
          cancelButtonText: 'Cancelar',
        });

        if (!confirmProyecto.isConfirmed) {
          setIsSubmitting(false);
          return;
        }

        force = true; // ⚡ Aquí activas el force si el usuario dijo "sí"
      }

      await agregarProyecto(proyectoFormateado, force);
      const nuevosProyectos = await fetchOpciones('proyectos');
      setProyectosCache(nuevosProyectos);
    }


    // ✅ 🚀 Si todo OK, recién registra:
    try {
      await enviarRegistro(datosFormateados);
      Swal.fire('¡Éxito!', 'Información enviada correctamente.', 'success');
      setFormData({ sede: '', proyecto: '', puerto: '', etiqueta: '' });
    } catch (error) {
      Swal.fire('Error', 'No se pudo registrar la información.', 'error');
    } finally {
      setIsSubmitting(false); // ⬅️ Siempre desactiva al final
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

      {/* <h5 className="mt-4">Puertos y Etiquetas</h5> */}
      <div className='row'>
        <div className="col-md-6 mb-3">
          <label className="form-label">Puerto del Switch</label>
          <input
            type="text"
            name="puerto"
            className="form-control"
            placeholder="ej. 101"
            value={formData.puerto}
            onChange={handleChange}
            refresh={refreshCounter}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Etiqueta del Faceplate</label>
          <input
            type="text"
            name="etiqueta"
            className="form-control"
            placeholder="ej. ppa18"
            value={formData.etiqueta}
            onChange={handleChange}
            refresh={refreshCounter}
          />
        </div>
      </div>
      {/*       
      {pares.map((pair, index) => (
        <PuertoEtiquetaGroup
          key={index}
          index={index}
          pair={pair}
          handlePairChange={handlePairChange}
          handleRemove={handleRemovePair}
        />
      ))} */}
      {/* <div className="col-md-6 mb-3">
        <button type="button" className="btn btn-secondary" onClick={handleAddPair}>
          ➕ Agregar otro par de Puerto y Etiqueta
        </button>
      </div> */}
      <SubmitButton isSubmitting={isSubmitting} />
    </form>
  );
};

export default Formulario;
