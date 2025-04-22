import { useEffect, useState } from 'react';
import { fetchOpcionesFiltrado } from '../services/apiService';

const AutoInput = ({ label, name, value, onChange, endpoint, placeholder = '' }) => {
    const [opciones, setOpciones] = useState([]);

    const handleSearch = async (texto) => {
        if (texto.length >= 2) { // 🔥 Cambia la cantidad mínima de letras si deseas
            const resultados = await fetchOpcionesFiltrado(endpoint, texto);
            setOpciones(resultados);
        } else {
            setOpciones([]); // Si no hay mínimo, no mostrar opciones
        }
    };

    useEffect(() => {
        handleSearch(value);
    }, [value]); // Cada vez que escribe, se dispara

    return (
        <div className="mb-3">
            <label className="form-label" htmlFor={`input-${name}`}>{label}</label>
            <input
                list={`lista-${name}`}
                id={`input-${name}`}
                type="text"
                name={name}
                className="form-control"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                onInput={(e) => handleSearch(e.target.value)} // 🔥 Busca mientras escribe
            />
            <datalist id={`lista-${name}`}>
                {(Array.isArray(opciones) ? opciones : []).map((op, i) => (
                    <option key={i} value={op} />
                ))}

            </datalist>
        </div>
    );
};

export default AutoInput;
