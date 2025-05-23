// columns.jsx
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper();

export const COLUMNS = [
  columnHelper.accessor('Fecha', {
    header: 'Fecha',
    footer: 'Fecha',
    cell: info => {
      const value = info.getValue();
      const date = new Date(value);
      return date.toLocaleDateString('es-PE', {
        timeZone: 'UTC',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }
  }),
  columnHelper.accessor('Sede', {
    header: 'Sede',
    footer: 'Sede',
  }),
  columnHelper.accessor('Proyecto', {
    header: 'Proyecto',
    footer: 'Proyecto',
  }),
  columnHelper.accessor('Puerto del Switch', {
    header: 'Puerto del Switch',
    footer: 'Puerto del Switch',
  }),
  columnHelper.accessor('Etiqueta Faceplate', {
    header: 'Etiqueta Faceplate',
    footer: 'Etiqueta Faceplate',
  }),
];
