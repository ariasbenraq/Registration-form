const Paginacion = ({
  pageCount,
  pageIndex,
  canPreviousPage,
  canNextPage,
  previousPage,
  nextPage,
  gotoPage,
  pageSize,
  setPageSize,
  rowCount
}) => {
  const inicio = pageIndex * pageSize + 1;
  const fin = Math.min((pageIndex + 1) * pageSize, rowCount);

  // Mostrar un máximo de 5 botones de página alrededor de la actual
  const getPageNumbers = () => {
    const total = pageCount;
    const current = pageIndex;
    const delta = 2; // páginas a la izquierda y derecha

    const pages = [];
    const start = Math.max(0, current - delta);
    const end = Math.min(total, current + delta + 1);

    for (let i = start; i < end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
      {/* Contador de filas */}
      <div>
        <span className="text-muted">
          Mostrando {inicio}–{fin} de {rowCount} registros
        </span>
      </div>

      {/* Navegación estilo Bootstrap */}
      <nav aria-label="Paginación">
        <ul className="pagination mb-0">

          <li className={`page-item ${!canPreviousPage ? 'disabled' : ''}`}>
            <button className="page-link" onClick={previousPage} disabled={!canPreviousPage}>
              Anterior
            </button>
          </li>

          {getPageNumbers().map((num) => (
            <li
              key={num}
              className={`page-item ${num === pageIndex ? 'active' : ''}`}
              aria-current={num === pageIndex ? 'page' : undefined}
            >
              <button className="page-link" onClick={() => gotoPage(num)}>
                {num + 1}
              </button>
            </li>
          ))}

          <li className={`page-item ${!canNextPage ? 'disabled' : ''}`}>
            <button className="page-link" onClick={nextPage} disabled={!canNextPage}>
              Siguiente
            </button>
          </li>
        </ul>
      </nav>

      {/* Selector de filas por página */}
      <div className="d-flex align-items-center mb-4">
        <label className="me-2">Filas por página:</label>
        <select
          className="form-select form-select-sm"
          style={{ width: "auto" }}
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {[5, 10, 20, 50].map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Paginacion;
