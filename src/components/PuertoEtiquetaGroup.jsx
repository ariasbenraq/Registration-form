// PuertoEtiquetaGroup.jsx
import React from 'react';

const PuertoEtiquetaGroup = ({ index, pair, handlePairChange, handleRemove }) => {
  return (
    <div className="row">
      <div className="col-md-6 mb-3">
        <label className="form-label">Puerto del Switch</label>
        <input
          type="text"
          name="puerto"
          className="form-control"
          placeholder="Ej. 101"
          value={pair.puerto}
          onChange={(e) => handlePairChange(index, 'puerto', e.target.value)}
        />
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">Etiqueta del Faceplate</label>
        <input
          type="text"
          name="etiqueta"
          className="form-control"
          placeholder="Ej. PPA18"
          value={pair.etiqueta}
          onChange={(e) => handlePairChange(index, 'etiqueta', e.target.value)}
        />
      </div>
      <div className="col-md-6 mb-3">
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => handleRemove(index)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default PuertoEtiquetaGroup;
