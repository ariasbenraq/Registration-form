export const validarFormulario = ({ sede, proyecto, puerto, etiqueta }) => {
  if (!sede.trim()) return { valido: false, mensaje: 'Por favor, ingresa una sede.' };
  if (!proyecto.trim()) return { valido: false, mensaje: 'Por favor, ingresa un proyecto.' };
  if (!puerto.trim()) return { valido: false, mensaje: 'Por favor, ingresa el puerto.' };
  if (!etiqueta.trim()) return { valido: false, mensaje: 'Por favor, ingresa la etiqueta.' };

  const puertoValido = /^([1-9])([1-9]|[1-3][0-9]|4[0-8])$/;
  const puertoGrandeValido = /^(10)([1-9]|[1-3][0-9]|4[0-8])$/;
  const puertoFormateadoValido = /^(10|[1-9])\/([1-9]|[1-3][0-9]|4[0-8])$/;

  if (
    !puertoValido.test(puerto.trim()) &&
    !puertoGrandeValido.test(puerto.trim()) &&
    !puertoFormateadoValido.test(puerto.trim())
  ) {
    return {
      valido: false,
      mensaje: 'Puerto inválido. Usa 12 (→ 1/2), 1048 (→ 10/48) o directamente 1/1, 10/48.'
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

  if (!puerto.includes('/')) {
    if (/^([1-9])([0-9]{1,2})$/.test(puerto)) {
      const sw = puerto[0];
      const pto = puerto.slice(1);
      puertoFormateado = `${sw}/${pto}`;
    }
    if (/^10([0-9]{1,2})$/.test(puerto)) {
      const pto = puerto.slice(2);
      puertoFormateado = `10/${pto}`;
    }
  }

  return {
    sede: sede.trim(),
    proyecto: proyecto.trim(),
    puerto: puertoFormateado,
    etiqueta: etiqueta.replace(/\s+/g, '').toUpperCase(),
  };
};
