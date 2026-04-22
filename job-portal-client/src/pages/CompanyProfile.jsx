import React, { useContext } from 'react';
import { Container, Card, Row, Col, ListGroup } from 'react-bootstrap';
import { useParams, Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const CompanyProfile = () => {
  const { id } = useParams();
  const { users } = useContext(AppContext);

  const company = users.find(u => u.id === id && u.role === 'employer');

  if (!company) {
    return (
      <Container className="mt-5 text-center">
        <h3>Company Not Found</h3>
        <p className="text-muted">The company details you are looking for might have been removed or do not exist.</p>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mb-5 py-5 px-4 rounded shadow-sm text-white" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
        <h1 className="fw-bold mb-2">{company.companyName || company.name}</h1>
        {company.establishedYear && <p className="mb-0 text-info">Established in {company.establishedYear}</p>}
      </div>

      <Row className="g-4">
        <Col md={8}>
          <Card className="shadow-sm border-0 mb-4 h-100">
            <Card.Body className="p-4">
              <h4 className="fw-bold mb-3">About the Company</h4>
              <p className="text-secondary" style={{ whiteSpace: 'pre-wrap' }}>
                {company.aboutCompany || 'No description provided by the employer.'}
              </p>
              
              <h4 className="fw-bold mt-5 mb-3">Terms & Conditions</h4>
              <p className="text-secondary" style={{ whiteSpace: 'pre-wrap' }}>
                {company.termsAndConditions || 'Standard company terms apply for all job applications.'}
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-3">Company Details</h5>
              <ListGroup variant="flush">
                <ListGroup.Item className="px-0 py-3 bg-transparent border-bottom">
                  <div className="text-muted small text-uppercase fw-semibold mb-1">Location</div>
                  <div className="fw-bold text-dark">{company.companyLocation || 'Not specified'}</div>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-3 bg-transparent border-bottom">
                  <div className="text-muted small text-uppercase fw-semibold mb-1">Established</div>
                  <div className="fw-bold text-dark">{company.establishedYear || 'N/A'}</div>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-3 bg-transparent border-bottom">
                  <div className="text-muted small text-uppercase fw-semibold mb-1">Official Name</div>
                  <div className="fw-bold text-dark">{company.name}</div>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-3 bg-transparent border-0">
                  <div className="text-muted small text-uppercase fw-semibold mb-1">Contact Email</div>
                  <div className="fw-bold text-primary">{company.email}</div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CompanyProfile;
