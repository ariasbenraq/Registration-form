import { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
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
      <CreatableSelect
        options={opciones}
        value={value ? { value, label: value } : null}
        onChange={(selected) =>
          onChange({ target: { name, value: selected ? selected.value : '' } })
        }
        onInputChange={(input) => {
          setInputValue(input);
          handleSearch(input);
        }}
        placeholder={placeholder || `Selecciona o crea ${label}`}
        isClearable
        noOptionsMessage={() => 'Escribe al menos 2 letras o crea uno nuevo...'}
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
        formatCreateLabel={(inputValue) => `Registrar nuevo: "${inputValue}"`}
        isValidNewOption={(inputValue, _, options) =>
          inputValue && !options.some(option => option.value.toLowerCase() === inputValue.toLowerCase())
        }
      />
    </div>
  );
};

export default AutoInput;
