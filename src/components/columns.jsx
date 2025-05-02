export const COLUMNS = [
    { Header: 'ID', accessor: 'ID' },
    {
        Header: 'Fecha',
        accessor: 'Fecha',
        Cell: ({ value }) => {
            const date = new Date(value);
            return date.toLocaleDateString('es-PE', {
                timeZone: 'UTC',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
    },
    { Header: 'Sede', accessor: 'Sede' },
    { Header: 'Proyecto', accessor: 'Proyecto' },
    { Header: 'Puerto del Switch', accessor: 'Puerto del Switch' },
    { Header: 'Etiqueta Faceplate', accessor: 'Etiqueta Faceplate' },
];
