import React, { useContext } from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import { Navigate, Link } from 'react-router-dom';

const UserDashboard = () => {
  const { session, applications } = useContext(AppContext);

  if (!session || session.role !== 'user') {
    return <Navigate to="/login" replace />;
  }

  const myApplications = applications.filter(a => a.userId === session.id);
  const acceptedApplications = myApplications.filter(a => a.status === 'accepted');

  return (
    <Container>
      <div className="mb-5 text-center py-4 rounded shadow-sm bg-dark text-white" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
        <h1 className="fw-bold mb-2">Welcome back, {session.name}! 👋</h1>
        <p className="text-muted">Explore new opportunities or track your current applications.</p>
      </div>

      <h4 className="mb-4">Quick Navigation</h4>
      <Row className="g-4 mb-5">
        <Col md={4}>
          <Link to="/jobs" className="text-decoration-none">
            <Card className="h-100 border-0 shadow-sm interactive-card">
              <Card.Body className="d-flex align-items-center p-4">
                <div className="me-3 fs-2 text-primary">
                  <i className="bi bi-briefcase"></i>
                </div>
                <div className="flex-grow-1">
                  <h5 className="fw-bold mb-0">Find Jobs</h5>
                  <small className="text-muted">Browse all listings</small>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>

        <Col md={4}>
          <Link to="/nearby" className="text-decoration-none">
            <Card className="h-100 border-0 shadow-sm interactive-card">
              <Card.Body className="d-flex align-items-center p-4">
                <div className="me-3 fs-2 text-success">
                  <i className="bi bi-geo-alt"></i>
                </div>
                <div className="flex-grow-1">
                  <h5 className="fw-bold mb-0">Nearby Map</h5>
                  <small className="text-muted">Visual job search</small>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>

        <Col md={4}>
          <Link to="/my-applications" className="text-decoration-none">
            <Card className="h-100 border-0 shadow-sm interactive-card">
              <Card.Body className="d-flex align-items-center p-4">
                <div className="me-3 fs-2 text-info">
                  <i className="bi bi-file-earmark-text"></i>
                </div>
                <div className="flex-grow-1">
                  <h5 className="fw-bold mb-0">My Applications</h5>
                  <small className="text-muted">Track your status</small>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>

      </Row>

      <Row>
        <Col md={12}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold mb-1">Your Stats</h5>
                <span className="text-muted me-3">Applied: <strong>{myApplications.length}</strong></span>
                <span className="text-muted">Accepted: <strong>{acceptedApplications.length}</strong></span>
              </div>
              <Button variant="outline-primary" as={Link} to="/profile">
                Profile Details <i className="bi bi-arrow-right ms-2"></i>
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboard;
