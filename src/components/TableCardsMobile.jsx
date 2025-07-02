import React, {useState} from 'react';
import Card from 'react-bootstrap/Card';
import { Collapse } from 'react-bootstrap';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'; // Feather icons

const TableCardsMobile = ({ table }) => {
  const [expandedCardId, setExpandedCardId] = useState(null);

  const toggleCard = (id) => {
    setExpandedCardId(prev => (prev === id ? null : id));
  };

  return (
    <div className="d-block d-md-none px-3 ">
      {table.getRowModel().rows.map((row, index) => {
        console.log('row.original', row.original);

        const id = row.id;
        const isOpen = expandedCardId === id;

        // Obtener los valores
        const sede = row.original['Sede'];
        const proyecto = row.original['Proyecto'];
        const fecha = new Date(row.original['Fecha']).toLocaleDateString('es-PE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        const puerto = row.original['Puerto del Switch']; // o interfaz
        const etiqueta = row.original['Etiqueta Faceplate'];

        return (
          <Card
            key={id}
            className="mb-3 shadow-sm"
            style={{ cursor: 'pointer' }}
            onClick={() => toggleCard(id)}
          >
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                {sede}
                {isOpen ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
              </Card.Title>
              <Collapse in={isOpen}>
                <div>
                  <Card.Text>
                    {/* <strong>Sede:</strong> {sede} <br /> */}
                    <strong>Fecha:</strong> {fecha} <br />
                    <strong>Motivo:</strong> {proyecto} <br />
                    <strong>Puerto:</strong> {puerto} <br />
                    <strong>Etiqueta:</strong> {etiqueta}
                  </Card.Text>
                </div>
              </Collapse>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};

export default TableCardsMobile;
// Este componente se usa para mostrar los registros en tarjetas en dispositivos móviles