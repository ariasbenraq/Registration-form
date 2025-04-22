const BASE_URL = 'http://localhost:3000';

export async function fetchOpciones(endpoint) {
    const res = await fetch(`${BASE_URL}/${endpoint}`);
    const data = await res.json();
    return Array.isArray(data) ? data : data[endpoint];
}

export async function agregarSede(sede) {
    const response = await fetch(`${BASE_URL}/sedes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sede }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error agregando sede');
    }
}


export async function agregarProyecto(proyecto) {
    await fetch(`${BASE_URL}/proyectos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proyecto }),
    });
}

export async function enviarRegistro(data) {
    await fetch(`${BASE_URL}/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}

export async function fetchOpcionesFiltrado(endpoint, query) {
    const res = await fetch(`${BASE_URL}/${endpoint}?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data[endpoint];
}


