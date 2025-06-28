import Pagination from 'react-bootstrap/Pagination';

const PaginacionAvanzada = ({ table }) => {
  const currentPage = table.getState().pagination.pageIndex;
  const totalPages = table.getPageCount();

  const visiblePages = 5; // Cuántas páginas mostrar alrededor
  let startPage = Math.max(0, currentPage - Math.floor(visiblePages / 2));
  let endPage = startPage + visiblePages;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(0, endPage - visiblePages);
  }

  const items = [];

  // Primera página
  items.push(
    <Pagination.First
      key="first"
      onClick={() => table.setPageIndex(0)}
      disabled={currentPage === 0}
    />
  );

  // Página anterior
  items.push(
    <Pagination.Prev
      key="prev"
      onClick={() => table.previousPage()}
      disabled={!table.getCanPreviousPage()}
    />
  );

  // Páginas numeradas
  for (let i = startPage; i < endPage; i++) {
    items.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => table.setPageIndex(i)}
      >
        {i + 1}
      </Pagination.Item>
    );
  }

  // Página siguiente
  items.push(
    <Pagination.Next
      key="next"
      onClick={() => table.nextPage()}
      disabled={!table.getCanNextPage()}
    />
  );

  // Última página
  items.push(
    <Pagination.Last
      key="last"
      onClick={() => table.setPageIndex(totalPages - 1)}
      disabled={currentPage === totalPages - 1}
    />
  );

  return (
    <Pagination size="sm" className="mb-0">
      {items}
    </Pagination>
  );
};

export default PaginacionAvanzada;
