// src/components/NavBarOffCanvas.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Navbar,
  Container,
  Offcanvas,
  Nav,
} from 'react-bootstrap';

const NavBarOffCanvas = () => {
  const expand = 'md';
  const [show, setShow] = useState(false);

  const handleCloseWithDelay = () => {
    setTimeout(() => {
      setShow(false);
    }, 300); // Espera 300ms antes de cerrar
  };

  return (
    <Navbar key={expand} expand={expand} className="bg-body-tertiary fixed-top shadow-sm" data-bs-theme="dark">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">Red Manager</Navbar.Brand>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`}
          onClick={() => setShow(true)} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${expand}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
          placement="end"
          show={show}
          onHide={() => setShow(false)}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
              Menú de Navegación
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link as={Link} to="/" onClick={handleCloseWithDelay}>Formulario</Nav.Link>
              <Nav.Link as={Link} to="/tabla" onClick={handleCloseWithDelay}>Registros</Nav.Link>
              <Nav.Link as={Link} to="/home" onClick={handleCloseWithDelay}>Home</Nav.Link>

            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default NavBarOffCanvas;
