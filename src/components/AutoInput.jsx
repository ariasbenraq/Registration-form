import { useEffect, useState } from 'react';
import Select from 'react-select';
import { fetchOpcionesFiltrado } from '../services/apiService';

const AutoInput = ({ label, name, value, onChange, endpoint, placeholder = '' }) => {
  const [opciones, setOpciones] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // 🟢 Manejar la búsqueda dinámica (lazy loading)
  const handleSearch = async (input) => {
    if (input.length >= 2) {
      const resultados = await fetchOpcionesFiltrado(endpoint, input);
      setOpciones(resultados.map(op => ({ value: op, label: op })));
    } else {
      setOpciones([]); // Limpiar opciones si no hay búsqueda
    }
  };

  useEffect(() => {
    handleSearch(value); // Si hay valor cargado, busca las opciones iniciales
  }, [value]);

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <Select
        options={opciones}
        value={value ? { value, label: value } : null}
        onChange={(selected) =>
          onChange({ target: { name, value: selected ? selected.value : '' } })
        }
        onInputChange={(input) => {
          setInputValue(input);
          handleSearch(input);
        }}
        placeholder={placeholder || `Selecciona ${label}`}
        isClearable
        noOptionsMessage={() => 'Escribe al menos 2 letras...'}
        styles={{
          control: (provided) => ({
            ...provided,
            borderRadius: '8px',
            padding: '2px',
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#0d6efd' : state.isFocused ? '#e7f1ff' : undefined,
            color: state.isSelected ? 'white' : 'black',
          }),
        }}
      />
    </div>
  );
};

export default AutoInput;
