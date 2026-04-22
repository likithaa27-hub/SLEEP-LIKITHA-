import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { haversineDistance, estimateTravelTime } from '../utils/geoUtils';


const ApplyModal = ({ show, onHide, job, userLocation, onSubmit }) => {
  const [coverMessage, setCoverMessage] = useState('');
  const [travelInfo, setTravelInfo] = useState(null);

  useEffect(() => {
    if (show && job && userLocation && job.lat && job.lng) {
      const distKm = haversineDistance(userLocation, [job.lat, job.lng]);
      setTravelInfo({
        distKm: distKm.toFixed(1),
        time: estimateTravelTime(distKm),
      });
    } else {
      setTravelInfo(null);
    }
    if (!show) {
      setCoverMessage('');
    }
  }, [show, job, userLocation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(coverMessage);
  };

  if (!job) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold">Apply for {job.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Job Details Summary */}
        <div className="mb-3 p-3 rounded border border-secondary" style={{ background: '#0f172a' }}>
          <div className="d-flex justify-content-between align-items-center mb-2 border-bottom border-secondary pb-2">
            <h6 className="text-muted mb-0">📋 Job Details</h6>
            <Link to={`/company/${job.employerId}`} className="btn btn-outline-info btn-sm">View Company Info</Link>
          </div>
          <Row className="g-2 mb-2">

            {job.salary && (
              <Col xs={6}>
                <div className="d-flex align-items-center gap-2">
                  <span style={{ fontSize: '1.1rem' }}>💰</span>
                  <div>
                    <div className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Salary</div>
                    <div className="text-success fw-semibold" style={{ fontSize: '0.9rem' }}>₹ {job.salary}</div>

                  </div>
                </div>
              </Col>
            )}
            {job.workingHours && (
              <Col xs={6}>
                <div className="d-flex align-items-center gap-2">
                  <span style={{ fontSize: '1.1rem' }}>🕐</span>
                  <div>
                    <div className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Working Hours</div>
                    <div className="text-info fw-semibold" style={{ fontSize: '0.9rem' }}>{job.workingHours}</div>
                  </div>
                </div>
              </Col>
            )}
            {(job.locality || job.city) && (
              <Col xs={12}>
                <div className="d-flex align-items-center gap-2">
                  <span style={{ fontSize: '1.1rem' }}>📌</span>
                  <div>
                    <div className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</div>
                    <div className="text-white" style={{ fontSize: '0.9rem' }}>
                      {[job.locality, job.city, job.state].filter(Boolean).join(', ')}
                    </div>
                  </div>
                </div>
              </Col>
            )}
          </Row>
          <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
            <div className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Description</div>
            <p className="small mb-0 text-white" style={{ whiteSpace: 'pre-wrap' }}>{job.description}</p>
          </div>
        </div>

        {/* Travel Time Card */}
        {travelInfo ? (
          <div className="mb-3 p-3 rounded d-flex align-items-center gap-3"
            style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1))', border: '1px solid rgba(59,130,246,0.3)' }}>
            <div style={{ fontSize: '2rem' }}>🗺️</div>
            <div>
              <div className="fw-semibold text-white">Travel Estimate</div>
              <div className="small" style={{ color: '#94a3b8' }}>
                📏 <strong className="text-white">{travelInfo.distKm} km</strong> from your location &nbsp;·&nbsp;
                ⏱ <strong className="text-white">{travelInfo.time}</strong> by road (estimated)
              </div>
            </div>
          </div>
        ) : (
          !userLocation && (
            <Alert variant="secondary" className="small border-0 mb-3" style={{ background: 'rgba(100,116,139,0.15)', color: '#94a3b8' }}>
              💡 <strong>Tip:</strong> Share your location on the dashboard to see travel time estimates before applying.
            </Alert>
          )
        )}

        <Alert variant="info" className="border-0 small text-white" style={{ backgroundColor: 'rgba(99,102,241,0.15)' }}>
          Applying will securely share your Profile summary (Phone, Address, Skills) to the employer.
        </Alert>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Cover Note (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={coverMessage}
              onChange={(e) => setCoverMessage(e.target.value)}
              placeholder="Give the employer a brief reason why you're a good fit..."
              className="bg-light text-dark"
            />
          </Form.Group>
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Confirm Application
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ApplyModal;
