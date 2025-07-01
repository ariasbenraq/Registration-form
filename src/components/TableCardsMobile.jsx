import React from 'react';
import Card from 'react-bootstrap/Card';

const TableCardsMobile = ({ table }) => {
  return (
    <div className="d-block d-md-none px-3 ">
      {table.getRowModel().rows.map((row, index) => {
        console.log('row.original', row.original);
        // Obtener los valores
        const sede = row.original['Sede'];
        const fecha = new Date(row.original['Fecha']).toLocaleDateString('es-PE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        const puerto = row.original['Puerto del Switch']; // o interfaz
        const etiqueta = row.original['Etiqueta Faceplate'];

        return (
          <Card key={row.id} className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title className="mb-2">{sede}</Card.Title>
              <Card.Text>
                {/* <strong>Sede:</strong> {sede} <br /> */}
                <strong>Fecha:</strong> {fecha} <br />
                <strong>Puerto:</strong> {puerto} <br />
                <strong>Etiqueta:</strong> {etiqueta}
              </Card.Text>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};

export default TableCardsMobile;
// Este componente se usa para mostrar los registros en tarjetas en dispositivos móviles