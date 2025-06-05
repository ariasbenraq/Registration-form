export const validarFormulario = ({ sede, proyecto, puerto, etiqueta }) => {
  if (!sede.trim()) return { valido: false, mensaje: 'Por favor, ingresa una sede.' };
  if (!proyecto.trim()) return { valido: false, mensaje: 'Por favor, ingresa un proyecto.' };
  if (!puerto.trim()) return { valido: false, mensaje: 'Por favor, ingresa el puerto.' };
  if (!etiqueta.trim()) return { valido: false, mensaje: 'Por favor, ingresa la etiqueta.' };

  const puertoValidoNumerico = /^(10|[1-9])0([1-9]|[1-3][0-9]|4[0-8])$/;
  const puertoFormateadoValido = /^([1-9]|10)\/0\/([1-9]|[1-3][0-9]|4[0-8])$/;

  if (
    !puertoValidoNumerico.test(puerto.trim()) &&
    !puertoFormateadoValido.test(puerto.trim())
  ) {
    return {
      valido: false,
      mensaje: 'Puerto inválido. Usa por ejemplo: 101 (→ 1/0/1) hasta 10048 (→ 10/0/48), o directamente 1/0/1, 10/0/48.'
    };
  }

  const etiquetaValida = /^[A-Z0-9.-]+$/;
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
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export function buscarCoincidenciasLevenshtein(lista, valor, tolerancia = 2) {
  const valorNormalizado = normalizarTexto(valor);
  return lista.filter(item => {
    const itemNormalizado = normalizarTexto(item);
    const distancia = calcularDistanciaLevenshtein(valorNormalizado, itemNormalizado);
    return distancia <= tolerancia;
  });
}

export function formatearTitulo(texto) {
  return texto
    .toLowerCase()
    .split(' ')
    .filter(palabra => palabra.trim() !== '')
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ');
}

export const formatearDatos = ({ sede, proyecto, puerto, etiqueta }) => {
  let puertoFormateado = puerto.trim();

  // Si es numérico entre 101 y 10048
  if (/^(10|[1-9])0([1-9]|[1-3][0-9]|4[0-8])$/.test(puertoFormateado)) {
    const match = puertoFormateado.match(/^(\d{1,2})0(\d{1,2})$/); // Ej: 105 → ['105', '1', '5']
    if (match) {
      const bloque = match[1];       // '1', '2', ..., '10'
      const subpuerto = match[2];    // '1' a '48'
      puertoFormateado = `${bloque}/0/${subpuerto}`;
    }
  }

  return {
    sede: sede.trim(),
    proyecto: proyecto.trim(),
    puerto: puertoFormateado,
    etiqueta: etiqueta.replace(/\s+/g, '').toUpperCase(),
  };
};
