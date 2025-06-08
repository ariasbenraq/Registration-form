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
import Paginacion from "./Paginacion";



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
        <>
            {/* 📱 Versión escritorio */}
            <div className="d-none d-md-block ">

                {/* 🔎 Filtro global */}
                <div className="mb-4">
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                </div>

                {/* 🧾 Contenedor de tabla responsiva */}
                <div className="table-responsive ">
                    <table className="table table-bordered  table-hover table-striped align-middle text-center ">
                        <thead className="table-light">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            onClick={header.column.getToggleSortingHandler()}
                                            className="border border-gray-300 dark:border-gray-600"
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getIsSorted() === "asc" ? " ▲" :
                                                header.column.getIsSorted() === "desc" ? " ▼" : ""}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="hover:bg-gray-100 even:bg-gray-50">
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="p-3 text-sm text-gray-700 whitespace-nowrap">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Paginacion
                    pageCount={table.getPageCount()}
                    pageIndex={table.getState().pagination.pageIndex}
                    canPreviousPage={table.getCanPreviousPage()}
                    canNextPage={table.getCanNextPage()}
                    previousPage={() => table.previousPage()}
                    nextPage={() => table.nextPage()}
                    gotoPage={(page) => table.setPageIndex(page)}
                    pageSize={table.getState().pagination.pageSize}
                    setPageSize={table.setPageSize}
                    rowCount={table.getFilteredRowModel().rows.length}
                ></Paginacion>

            </div>

            {/* 📱 Versión móvil como tarjetas */}
            <div className="d-block d-md-none px-3">
                {/* 🔎 Filtro global */}
                <div className="mb-4 d-flex">
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                </div>
                <Paginacion
                    pageCount={table.getPageCount()}
                    pageIndex={table.getState().pagination.pageIndex}
                    canPreviousPage={table.getCanPreviousPage()}
                    canNextPage={table.getCanNextPage()}
                    previousPage={() => table.previousPage()}
                    nextPage={() => table.nextPage()}
                    gotoPage={(page) => table.setPageIndex(page)}
                    pageSize={table.getState().pagination.pageSize}
                    setPageSize={table.setPageSize}
                    rowCount={table.getFilteredRowModel().rows.length}
                ></Paginacion>
                {table.getRowModel().rows.map((row) => (
                    <div key={row.id} className="card mb-3 shadow p-3">
                        <div className="card-body p-">
                            <h6 className="card-title mb-2"></h6>
                            <ul className="list-unstyled mb-0 small">
                                {row.getVisibleCells().map(cell => (
                                    <li key={cell.id}>
                                        <strong>{cell.column.columnDef.header}:</strong>{" "}
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
                <Paginacion
                    pageCount={table.getPageCount()}
                    pageIndex={table.getState().pagination.pageIndex}
                    canPreviousPage={table.getCanPreviousPage()}
                    canNextPage={table.getCanNextPage()}
                    previousPage={() => table.previousPage()}
                    nextPage={() => table.nextPage()}
                    gotoPage={(page) => table.setPageIndex(page)}
                    pageSize={table.getState().pagination.pageSize}
                    setPageSize={table.setPageSize}
                    rowCount={table.getFilteredRowModel().rows.length}
                ></Paginacion>
            </div>
        </>
    );
};
