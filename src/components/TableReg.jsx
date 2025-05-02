import React, { useMemo } from "react";
import { useTable } from "react-table";
import { useQuery } from "@tanstack/react-query";
import { COLUMNS } from "./columns";

const fetchRegistros = async () => {
  const res = await fetch("http://localhost:3000/registro");
  if (!res.ok) throw new Error("Error al cargar registros");
  return res.json();
};

export const TableReg = () => {
  const columns = useMemo(() => COLUMNS, []);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['registros'],
    queryFn: fetchRegistros,
    staleTime: 5 * 60 * 1000, // 🕒 cachea durante 5 minutos
    refetchOnWindowFocus: false, // ❌ no recarga al cambiar de pestaña
  });

  const tableInstance = useTable({
    columns,
    data: data || []
  });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = tableInstance;

  if (isLoading) {
    return (
      <div className="text-center mt-4">
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Cargando registros...
      </div>
    );
  }
  if (isError) return <div>❌ Error al cargar la tabla</div>;

  return (
    <div className="table-responsive">
      <table {...getTableProps()} className="table table-striped table-bordered">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} key={column.id}>
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} key={cell.column.id}>
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
