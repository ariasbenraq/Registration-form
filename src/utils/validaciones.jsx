export const validarFormulario = ({ sede, proyecto, puerto, etiqueta }) => {
    if (!sede.trim()) return { valido: false, mensaje: 'Por favor, ingresa una sede.' };
    if (!proyecto.trim()) return { valido: false, mensaje: 'Por favor, ingresa un proyecto.' };
    if (!puerto.trim()) return { valido: false, mensaje: 'Por favor, ingresa el puerto.' };
    if (!etiqueta.trim()) return { valido: false, mensaje: 'Por favor, ingresa la etiqueta.' };
  
    const puertoRegex = /^([1-9])0([1-9]|[1-4][0-8])$/;
    if (!puertoRegex.test(puerto.trim())) {
      return {
        valido: false,
        mensaje: 'Puerto inválido. Debe ser como 101 o 3048 (convertido a 1/0/1 o 3/0/48).'
      };
    }
  
    const etiquetaValida = /^[A-Z0-9.]+$/;
    const etiquetaFormateada = etiqueta.replace(/\s+/g, '').toUpperCase();
    if (!etiquetaValida.test(etiquetaFormateada)) {
      return {
        valido: false,
        mensaje: 'La etiqueta solo debe contener letras, números o puntos.'
      };
    }
  
    return { valido: true };
  };
  
  export const formatearDatos = ({ sede, proyecto, puerto, etiqueta }) => {
    const stack = puerto[0];
    const interfaz = puerto.slice(2);
    return {
      sede: sede.trim(),
      proyecto: proyecto.trim(),
      puerto: `${stack}/0/${interfaz}`,
      etiqueta: etiqueta.replace(/\s+/g, '').toUpperCase(),
    };
  };
  