// SubmitButton.jsx
import React from 'react';

const SubmitButton = ({ isSubmitting, text = "Enviar", pendingText = "Enviando..." }) => {
  return (
    <button
      type="submit"
      className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
      disabled={isSubmitting}
      style={{ height: '45px' }}
    >
      {isSubmitting ? (
        <>
          <span 
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          {pendingText}
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default SubmitButton;
