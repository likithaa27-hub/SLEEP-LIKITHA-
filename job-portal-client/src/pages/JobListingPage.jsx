import React, { useState, useContext, useRef, useEffect } from 'react';
import { Container, Card, Form, ListGroup, Row, Col, Alert } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import JobCard from '../components/JobCard';
import ApplyModal from '../components/ApplyModal';

const JobListingPage = () => {
  const { session, jobs, setJobs, applications, applyForJob, userLocation } = useContext(AppContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isJobSeeker = session?.role === 'user';
  const myApplications = isJobSeeker
    ? applications.filter(a => a.userId === session.id)
    : [];

  const filteredJobs = jobs.filter(job => {
    const query = searchQuery.toLowerCase().trim();
    const fullLocation = `${job.locality || ''} ${job.city || ''} ${job.state || ''}`.toLowerCase();
    return !query || (job.title && job.title.toLowerCase().includes(query)) || fullLocation.includes(query);
  });

  const handleApplyClick = (job) => {
    if (!isJobSeeker) {
      toast.info('Please log in as a job seeker to apply.');
      navigate('/login?intent=jobseeker');
      return;
    }
    if (!session.skills || !session.experience || !session.phone) {
      toast.warning('Please complete your profile first (Phone, Skills, Experience) before applying.');
      return;
    }
    if (myApplications.some(a => a.jobId === job.id)) {
      toast.info('You have already applied for this job!');
      return;
    }
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const handleApplySubmit = async (coverMessage) => {
    if (!isJobSeeker || !selectedJob) {
      return;
    }
    const result = await applyForJob(selectedJob.id, coverMessage);
    if (result.success) {
      toast.success(result.message);
      setShowApplyModal(false);
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to remove this job?')) {
      setJobs(jobs.filter(j => j.id !== jobId));
      toast.info('Job successfully removed from the board.');
    }
  };


  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Find Your Dream Job</h2>
      </div>

      {/* Global Search Bar */}
      <Card className="shadow-sm border-0 mb-4 bg-dark text-white shadow" style={{ position: 'relative', zIndex: 1000 }} ref={searchContainerRef}>
        <Card.Body>
          <Form.Group>
            <div className="d-flex align-items-center bg-dark" style={{ border: '1px solid #444', borderRadius: '8px', padding: '0.5rem 1rem' }}>
              <i className="bi bi-search me-3 text-muted"></i>
              <Form.Control
                type="text"
                placeholder="Search jobs by Title or Location (e.g. Software, Mumbai)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="border-0 bg-transparent text-white shadow-none p-0"
                style={{ outline: 'none', boxShadow: 'none' }}
              />
              {searchQuery && (
                <i className="bi bi-x-circle text-muted ms-2" style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('')}></i>
              )}
            </div>

            {/* Autocomplete Suggestions */}
            {showSuggestions && searchQuery && filteredJobs.length > 0 && (
              <ListGroup className="position-absolute w-100 shadow" style={{ top: '100%', left: 0, zIndex: 1050, maxHeight: '250px', overflowY: 'auto' }}>
                {filteredJobs.slice(0, 8).map(job => (
                  <ListGroup.Item action key={job.id} className="bg-dark text-white border-secondary" onClick={() => { setSearchQuery(job.title); setShowSuggestions(false); }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <strong>{job.title}</strong>
                      <small className="text-muted">{job.locality && `${job.locality},`} {job.city}</small>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Form.Group>
        </Card.Body>
      </Card>

      <Row>
        {filteredJobs.length === 0 ? (
          <Col xs={12}>
            <Alert variant="secondary" className="border-0">
              {searchQuery ? 'No jobs match your search criteria.' : 'No jobs posted yet. Check back later!'}
            </Alert>
          </Col>
        ) : (
          filteredJobs.map(job => (
            <Col xs={12} md={6} lg={4} className="mb-4" key={job.id}>
              <JobCard
                job={job}
                userLocation={userLocation}
                onApply={handleApplyClick}
                onDelete={handleDeleteJob}
                alreadyApplied={myApplications.some(a => a.jobId === job.id)}
              />

            </Col>
          ))
        )}
      </Row>

      <ApplyModal
        show={showApplyModal}
        onHide={() => setShowApplyModal(false)}
        job={selectedJob}
        userLocation={userLocation}
        onSubmit={handleApplySubmit}
      />
    </Container>
  );
};

export default JobListingPage;
