import { useEffect, useState } from 'react';
import { fetchOpciones } from '../services/apiService';

const AutoInput = ({ label, name, value, onChange, endpoint, placeholder = '' }) => {
    const [opciones, setOpciones] = useState([]);

    useEffect(() => {
        fetchOpciones(endpoint)
            .then((res) => {
                console.log(`Opciones cargadas desde /${endpoint}:`, res);
                setOpciones(res);
            })
            .catch(err => console.error(`Error cargando ${endpoint}:`, err));
    }, [endpoint]);

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
