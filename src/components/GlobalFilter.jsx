import React from 'react'

export const GlobalFilter = ({ filter, setFilter }) => {
    return (
      <span>
        {/* Buscar:{" "} */}
        <input
          value={filter || ""}
          onChange={(e) => setFilter(e.target.value)}
          className="form-control d-inline-block w-auto"
          placeholder="Buscar..."
          style={{ width: "200px" }}
          aria-label="Buscar registros"
        />
      </span>
    );
  };
  
