import React, { useContext } from 'react';
import { Container, Card, Row, Col, Badge, Alert } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import { Navigate } from 'react-router-dom';

const MyApplicationsPage = () => {
  const { session, jobs, applications } = useContext(AppContext);

  if (!session || session.role !== 'user') {
    return <Navigate to="/login" replace />;
  }

  const myApps = applications.filter(a => a.userId === session.id);
  
  const acceptedApps = myApps.filter(a => a.status === 'accepted');
  const rejectedApps = myApps.filter(a => a.status === 'rejected');
  const pendingApps = myApps.filter(a => a.status === 'pending');

  const renderAppList = (apps, status) => {
    if (apps.length === 0) return <p className="text-muted small">No {status} applications.</p>;

    return apps.map(app => {
      const job = jobs.find(j => j.id === app.jobId);
      if (!job) return null;

      return (
        <Card key={app.id} className="mb-3 border-0 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className="fw-bold mb-1">{job.title}</h5>
                <p className="text-muted mb-2">🏢 {job.employerName} · 📌 {job.city}</p>
              </div>
              <Badge bg={status === 'accepted' ? 'success' : status === 'rejected' ? 'danger' : 'warning'}>
                {status.toUpperCase()}
              </Badge>
            </div>
            {app.coverMessage && (
              <div className="bg-light p-2 rounded small text-secondary mt-2">
                <strong>Your Note:</strong> "{app.coverMessage}"
              </div>
            )}
            {status === 'accepted' && (
              <Alert variant="success" className="mt-3 mb-0 py-2 border-0">
                <small>The employer has accepted your application! They will contact you shortly.</small>
              </Alert>
            )}
          </Card.Body>
        </Card>
      );
    });
  };

  return (
    <Container>
      <h2 className="mb-4">My Applications</h2>
      
      <Row>
        <Col lg={4} className="mb-4">
          <h4 className="mb-3 text-success">Accepted</h4>
          {renderAppList(acceptedApps, 'accepted')}
        </Col>
        
        <Col lg={4} className="mb-4">
          <h4 className="mb-3 text-warning">Pending</h4>
          {renderAppList(pendingApps, 'pending')}
        </Col>

        <Col lg={4} className="mb-4">
          <h4 className="mb-3 text-danger">Rejected</h4>
          {renderAppList(rejectedApps, 'rejected')}
        </Col>
      </Row>
    </Container>
  );
};

export default MyApplicationsPage;
