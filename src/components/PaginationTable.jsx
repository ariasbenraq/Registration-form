import React, { useMemo, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { COLUMNS } from "./columns";
import { GlobalFilter } from "./GlobalFilter";

const fetchRegistros = async () => {
    const res = await fetch("http://localhost:3000/registro");
    if (!res.ok) throw new Error("Error al cargar registros");
    return res.json();
};

export const PaginationTable = () => {
    const columns = useMemo(() => COLUMNS, []);
    const [globalFilter, setGlobalFilter] = useState('');

    const { data, isLoading, isError } = useQuery({
        queryKey: ['registros'],
        queryFn: fetchRegistros,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const table = useReactTable({
        data: data || [],
        columns,
        state: {
            globalFilter
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel()
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
            <div className="mb-4 mt-4">
                <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            </div>

            <table className="table table-striped table-bordered">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    onClick={header.column.getToggleSortingHandler()}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                    {header.column.getIsSorted() === "asc" ? " ▲" :
                                        header.column.getIsSorted() === "desc" ? " ▼" : ""}
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

            {/* 📘 Paginación Bootstrap */}
            <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                <div>
                    <span>
                        Página <strong>{table.getState().pagination.pageIndex + 1}</strong> de{" "}
                        <strong>{table.getPageCount()}</strong>
                    </span>
                </div>

                <div className="btn-group">
                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Anterior
                    </button>
                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Siguiente
                    </button>
                </div>

                <div className="d-flex align-items-center">
                    <label className="me-2">Filas por página:</label>
                    <select
                        className="form-select form-select-sm"
                        style={{ width: "auto" }}
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => table.setPageSize(Number(e.target.value))}
                    >
                        {[5, 10, 20, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};
