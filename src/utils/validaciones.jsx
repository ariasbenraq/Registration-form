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

// Quita acentos, espacios y convierte a minúsculas
export const normalizarTexto = (texto) =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();

// Distancia de Levenshtein (fuzzy matching)
export function calcularDistanciaLevenshtein(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // sustitución
          matrix[i][j - 1] + 1,     // inserción
          matrix[i - 1][j] + 1      // eliminación
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Buscar coincidencias usando Levenshtein con tolerancia (puedes ajustar el 3)
export function buscarCoincidenciasLevenshtein(lista, valor, tolerancia = 2) {
  const valorNormalizado = normalizarTexto(valor);
  return lista.filter(item => {
    const itemNormalizado = normalizarTexto(item);
    const distancia = calcularDistanciaLevenshtein(valorNormalizado, itemNormalizado);
    return distancia <= tolerancia;
  });
}

// Formatear título (Title Case)
export function formatearTitulo(texto) {
  return texto
    .toLowerCase()
    .split(' ')
    .filter(palabra => palabra.trim() !== '')
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ');
}

// ✅ Agrega esto en utils/validaciones.js:

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

