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
import { BASE_URL } from "../services/apiService";
import { motion } from 'framer-motion';

const fetchRegistros = async () => {
    const res = await fetch(`${BASE_URL}/registro`);
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
            <div className="d-flex flex-column justify-content-center align-items-center mt-5">
                <motion.div
                    className="spinner-border text-primary"
                    role="status"
                    initial={{ scale: 0 }}
                    animate={{ rotate: 360, scale: 1 }}
                    transition={{ duration: 0.8, ease: 'easeInOut', repeat: Infinity }}
                    style={{ width: '3rem', height: '3rem' }}
                />
                <motion.p
                    className="mt-3 text-primary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Cargando registros...
                </motion.p>
            </div>
        );
    }
    if (isError) {
        return (
            <motion.div
                className="text-center mt-5 text-danger"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <motion.div
                    initial={{ rotate: -10 }}
                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                    transition={{ duration: 0.6 }}
                    style={{ fontSize: '2rem' }}
                >
                    ❌
                </motion.div>
                <p className="mt-2">Error al cargar la tabla</p>
            </motion.div>
        );
    }


    return (

        <div className="container-fluid px-2">
            {/* 🔎 Filtro global */}
            <div className="mb-3">
                <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            </div>

            {/* 🧾 Contenedor de tabla responsiva */}
            <div className="row justify-content-center">
                <div className="col-12">
                    <div
                        className="table-responsive"
                        style={{
                            overflowX: 'auto',
                            WebkitOverflowScrolling: 'touch',
                        }}
                    >
                        <table
                            className="table table-striped table-bordered align-middle text-nowrap"
                            style={{ minWidth: '800px' }} // Ajusta según tus columnas
                        >
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
                    </div>
                </div>
            </div>

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
