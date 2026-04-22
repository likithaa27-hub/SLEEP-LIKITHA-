import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navigation = () => {
  const { session, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm" collapseOnSelect>

      <Container>
        <Navbar.Brand as={Link} to="/">
          <i className="bi bi-briefcase-fill me-2"></i>
          JobConnect
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {!session && (
              <>
                <Nav.Link as={Link} to="/login">Get Started</Nav.Link>

                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
            
            {session && session.role === 'admin' && (
              <Nav.Link as={Link} to="/admin">Admin Dashboard</Nav.Link>
            )}
            
            {session && session.role === 'employer' && (
              <Nav.Link as={Link} to="/employer">Employer Dashboard</Nav.Link>
            )}
            
            {session && session.role === 'user' && (
              <>
                <Nav.Link as={Link} to="/user">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/jobs">Find Jobs</Nav.Link>
                <Nav.Link as={Link} to="/nearby">Nearby Map</Nav.Link>
                <Nav.Link as={Link} to="/my-applications">My Applications</Nav.Link>
                <Nav.Link as={Link} to="/profile">My Profile</Nav.Link>
              </>
            )}
            
            {/* Common Public/Info Links */}

          </Nav>

          
          {session && (
            <Nav className="ms-auto align-items-center">
              <Navbar.Text className="me-3 text-light">
                Signed in as: <strong>{session.name}</strong> ({session.role})
              </Navbar.Text>
              <Button variant="outline-light" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
