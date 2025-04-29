import { Box } from "@chakra-ui/react";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import DATA from "../data";
import { useState } from "react";


const columns  = [
    {
        accessorKey: 'fecha',
        header: "Fecha",
        cell: (props) => <p>{props.getValue()}</p>
    },
    {
        accessorKey: 'sede',
        header: "Sede",
        cell: (props) => <p>{props.getValue()}</p>
    },
    {
        accessorKey: 'proyecto',
        header: "Proyecto",
        cell: (props) => <p>{props.getValue()}</p>
    },
    {
        accessorKey: 'puerto del switch',
        header: "Puerto del Switch",
        cell: (props) => <p>{props.getValue()}</p>
    },
    {
        accessorKey: 'etiqueta faceplate',
        header: "Etiqueta Faceplate",
        cell: (props) => <p>{props.getValue()}</p>
    },

]
const TaskTable = () => {
    const [data, setData] = useState(DATA)
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    });
    console.log(table.getHeaderGroups);
    return <Box>
        <Box className="table">

        </Box>
    </Box>;
};

export default TaskTable;