import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { haversineDistance, estimateTravelTime } from '../utils/geoUtils';

const JobCard = ({ job, userLocation, onApply, onDelete, alreadyApplied, isCompact = false }) => {
  const dist = (userLocation && job.lat && job.lng) ? haversineDistance(userLocation, [job.lat, job.lng]) : null;
  const distStr = dist ? dist.toFixed(1) : null;
  const travelTime = dist ? estimateTravelTime(dist) : null;

  if (isCompact) {
    return (
      <div className="job-card-compact">
        <h6 className="mb-1 fw-bold">{job.title}</h6>
        <p className="text-muted small m-0 mb-1">📌 {job.locality && `${job.locality}, `}{job.city}</p>
        <p className="text-muted small m-0 mb-1">🏢 {job.employerName}</p>
        {job.salary && <p className="small m-0 mb-1 text-success fw-semibold">₹ {job.salary}</p>}
        {job.workingHours && <p className="small m-0 mb-1 text-info">🕐 {job.workingHours}</p>}

        {distStr && (
          <div className="mt-1 mb-2 px-2 py-1 rounded border border-secondary" style={{ background: 'rgba(59,130,246,0.1)', fontSize: '0.78rem', color: '#60a5fa' }}>
            📏 <strong>{distStr} km</strong> away · ⏱ {travelTime} by road
          </div>
        )}
        <Button variant="primary" size="sm" className="w-100" onClick={() => onApply(job)}>
          Quick Apply
        </Button>
      </div>
    );
  }

  return (
    <Card className="h-100 shadow-sm border-0 interactive-card">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <Card.Title className="fw-bold mb-0">{job.title}</Card.Title>
          {distStr && (
            <Badge bg="primary" className="ms-2 flex-shrink-0" style={{ fontSize: '0.7rem' }}>
              📏 {distStr} km
            </Badge>
          )}
        </div>
        <Card.Subtitle className="mb-2 border-bottom pb-2">
          <small className="text-muted">Posted by: </small>
          <Link to={`/company/${job.employerId}`} className="text-decoration-none fw-bold" style={{ color: '#6366f1' }}>
            {job.employerName}
          </Link>
        </Card.Subtitle>


        {/* Salary & Working Hours */}
        <div className="d-flex flex-wrap gap-2 mb-2">
          {job.salary && (
            <span className="badge rounded-pill text-success border border-success" style={{ fontSize: '0.75rem', fontWeight: 500 }}>
              ₹ {job.salary}
            </span>
          )}

          {job.workingHours && (
            <span className="badge rounded-pill text-info border border-info" style={{ fontSize: '0.75rem', fontWeight: 500 }}>
              🕐 {job.workingHours}
            </span>
          )}
          {travelTime && (
            <span className="badge rounded-pill text-warning border border-warning" style={{ fontSize: '0.75rem', fontWeight: 500 }}>
              ⏱ {travelTime}
            </span>
          )}
        </div>

        {/* Location */}
        {(job.locality || job.city) && (
          <div className="small text-muted mb-2">
            📌 {[job.locality, job.city, job.state].filter(Boolean).join(', ')}
          </div>
        )}

        <Card.Text
          className="flex-grow-1 mt-1 text-secondary"
          style={{ maxHeight: '80px', overflowY: 'auto', fontSize: '0.85rem' }}
        >
          {job.description}
        </Card.Text>

        <div className="d-flex mt-auto gap-2">
          <Button
            variant="outline-primary"
            className="flex-grow-1"
            onClick={() => onApply(job)}
            disabled={alreadyApplied}
          >
            {alreadyApplied ? '✅ Applied' : 'Apply Now'}
          </Button>
          {onDelete && (
            <Button
              variant="outline-danger"
              size="sm"
              className="d-flex align-items-center gap-1"
              title="Remove this job"
              onClick={() => onDelete(job.id)}
            >
              <i className="bi bi-trash"></i>
              <span>Remove</span>
            </Button>
          )}

        </div>
      </Card.Body>
    </Card>
  );
};

export default JobCard;
