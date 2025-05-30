import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { COLUMNS } from "./columns";

const fetchRegistros = async () => {
  const res = await fetch("http://localhost:3000/registro");
  if (!res.ok) throw new Error("Error al cargar registros");
  return res.json();
};

export const TableReg = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['registros'],
    queryFn: fetchRegistros,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const table = useReactTable({
    data: data || [],
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
  });

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
      <table className="table table-striped table-bordered">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
