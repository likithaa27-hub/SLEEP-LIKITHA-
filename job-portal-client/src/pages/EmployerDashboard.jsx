import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge, Tabs, Tab, Modal, ListGroup } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EmployerDashboard = () => {
  const { session, jobs, applications, users, updateProfile, createJob, updateApplicationStatus, refreshUsers, refreshApplications } = useContext(AppContext);
  const [key, setKey] = useState('post');
  const [isPosting, setIsPosting] = useState(false);

  // Applicant Modal State
  const [showApplicantModal, setShowApplicantModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    salary: '',
    workingHours: '',
    locality: '',
    city: '',
    state: ''
  });

  const [companyData, setCompanyData] = useState({
    companyName: '',
    establishedYear: session?.establishedYear || '',
    companyLocation: '',
    aboutCompany: session?.aboutCompany || '',
    termsAndConditions: session?.termsAndConditions || ''
  });

  if (!session || session.role !== 'employer') {
    return <Navigate to="/login" replace />;
  }

  const myJobs = jobs.filter(j => j.employerId === session.id);
  const myApplications = applications.filter(a => myJobs.some(mj => mj.id === a.jobId));

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setIsPosting(true);
    const query = `${jobData.locality}, ${jobData.city}, ${jobData.state}, India`;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const result = await createJob({
          ...jobData,
          employer_id: session.id,
          employer_name: companyData.companyName || session.name,
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        });

        if (result.success) {
          toast.success(`Job posted! Mapped to: ${data[0].display_name}`);
          setJobData({ title: '', description: '', salary: '', workingHours: '', locality: '', city: '', state: '' });
          setKey('applications');
        } else {
          toast.error(result.message);
        }
      } else {
        toast.error('Could not find location on map.');
      }
    } catch (err) {
      toast.error('Network error during geocoding.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleCompanyUpdate = (e) => {
    e.preventDefault();
    updateProfile(session.id, companyData);
    toast.success('Company details updated successfully!');
  };

  const handleApplicationAction = async (appId, newStatus) => {
    const result = await updateApplicationStatus(appId, newStatus);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const viewApplicantProfile = (applicantId) => {
    const applicant = users.find(u => u.id === applicantId);
    setSelectedApplicant(applicant);
    setShowApplicantModal(true);
  };

  const getUserDetails = (userId) => {
    return users.find(u => u.id === userId) || {};
  };

  const getJobDetails = (jobId) => {
    return jobs.find(j => j.id === jobId) || {};
  };

  useEffect(() => {
    if (key === 'applications') {
      refreshUsers();
      refreshApplications();
    }
  }, [key, refreshUsers, refreshApplications]);

  return (
    <Container>
      <h2 className="mb-4">Employer Dashboard</h2>

      <Tabs id="employer-tabs" activeKey={key} onSelect={(k) => setKey(k)} className="mb-4">
        <Tab eventKey="post" title="Post a New Job">
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Form onSubmit={handleJobSubmit}>
                <Row>
                  <Col md={12}><Form.Group className="mb-3"><Form.Label>Job Name</Form.Label><Form.Control type="text" required value={jobData.title} onChange={(e) => setJobData({ ...jobData, title: e.target.value })} /></Form.Group></Col>
                  <Col md={12}><Form.Group className="mb-3"><Form.Label>Job Description</Form.Label><Form.Control as="textarea" rows={3} required value={jobData.description} onChange={(e) => setJobData({ ...jobData, description: e.target.value })} /></Form.Group></Col>
                  <Col md={6}><Form.Group className="mb-3"><Form.Label> Salary</Form.Label><Form.Control type="text" value={jobData.salary} onChange={(e) => setJobData({ ...jobData, salary: e.target.value })} /></Form.Group></Col>
                  <Col md={6}><Form.Group className="mb-3"><Form.Label> Working Hours</Form.Label><Form.Control type="text" value={jobData.workingHours} onChange={(e) => setJobData({ ...jobData, workingHours: e.target.value })} /></Form.Group></Col>
                  <Col md={4}><Form.Group className="mb-3"><Form.Label>Locality</Form.Label><Form.Control type="text" required value={jobData.locality} onChange={(e) => setJobData({ ...jobData, locality: e.target.value })} /></Form.Group></Col>
                  <Col md={4}><Form.Group className="mb-3"><Form.Label>City</Form.Label><Form.Control type="text" required value={jobData.city} onChange={(e) => setJobData({ ...jobData, city: e.target.value })} /></Form.Group></Col>
                  <Col md={4}><Form.Group className="mb-3"><Form.Label>State</Form.Label><Form.Control type="text" required value={jobData.state} onChange={(e) => setJobData({ ...jobData, state: e.target.value })} /></Form.Group></Col>
                </Row>
                <Button variant="primary" type="submit" disabled={isPosting}>{isPosting ? 'Posting...' : 'Post Job'}</Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="applications" title="View Applications">
          <Card className="shadow-sm border-0">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="bg-light">
                    <tr className="fw-bold">
                      <th style={{ color: 'black' }}>Job / Salary</th>
                      <th style={{ color: 'black' }}>Applicant</th>
                      <th style={{ color: 'black' }}>Status</th>
                      <th style={{ color: 'black' }}>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {myApplications.map(app => {
                      const applicant = getUserDetails(app.userId);
                      const job = getJobDetails(app.jobId);
                      return (
                        <tr key={app.id}>
                          <td>
                            <div className="fw-bold">{job.title}</div>
                            {job.salary && <div className="text-success small fw-semibold">₹ {job.salary}</div>}
                            {job.workingHours && <div className="text-info small">🕐 {job.workingHours}</div>}
                          </td>

                          <td>
                            <div className="fw-bold">{applicant.name}</div>
                            <Button variant="link" size="sm" className="p-0" onClick={() => viewApplicantProfile(app.userId)}>View Full Profile</Button>
                          </td>
                          <td>
                            <Badge bg={app.status === 'accepted' ? 'success' : app.status === 'rejected' ? 'danger' : 'warning'}>{app.status?.toUpperCase()}</Badge>
                          </td>
                          <td>
                            {app.status === 'pending' && (
                              <div className="d-flex gap-2">
                                <Button variant="success" size="sm" onClick={() => handleApplicationAction(app.id, 'accepted')}>Accept</Button>
                                <Button variant="danger" size="sm" onClick={() => handleApplicationAction(app.id, 'rejected')}>Reject</Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {myApplications.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-muted">No applications received yet.</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Tab>


        <Tab eventKey="company" title="Company">
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Form onSubmit={handleCompanyUpdate}>
                <Row>
                  <Col md={6}><Form.Group className="mb-3"><Form.Label>Company Name</Form.Label><Form.Control type="text" value={companyData.companyName} onChange={e => setCompanyData({ ...companyData, companyName: e.target.value })} required /></Form.Group></Col>
                  <Col md={6}><Form.Group className="mb-3"><Form.Label>Year Established</Form.Label><Form.Control type="number" value={companyData.establishedYear} onChange={e => setCompanyData({ ...companyData, establishedYear: e.target.value })} /></Form.Group></Col>
                  <Col md={12}><Form.Group className="mb-3"><Form.Label>Company Location</Form.Label><Form.Control type="text" value={companyData.companyLocation} onChange={e => setCompanyData({ ...companyData, companyLocation: e.target.value })} /></Form.Group></Col>
                  <Col md={12}><Form.Group className="mb-3"><Form.Label>About Company</Form.Label><Form.Control as="textarea" rows={4} value={companyData.aboutCompany} onChange={e => setCompanyData({ ...companyData, aboutCompany: e.target.value })} /></Form.Group></Col>
                  <Col md={12}><Form.Group className="mb-3"><Form.Label>Terms & Conditions</Form.Label><Form.Control as="textarea" rows={4} value={companyData.termsAndConditions} onChange={e => setCompanyData({ ...companyData, termsAndConditions: e.target.value })} /></Form.Group></Col>
                </Row>
                <Button variant="primary" type="submit">Save Company Details</Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Applicant Profile Modal */}
      <Modal show={showApplicantModal} onHide={() => setShowApplicantModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0"><Modal.Title className="fw-bold">Applicant Full Profile</Modal.Title></Modal.Header>
        <Modal.Body className="p-4">
          {selectedApplicant && (
            <Row>
              <Col md={4} className="text-center mb-4">
                <div className="bg-primary text-white d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                  {selectedApplicant.name.charAt(0)}
                </div>
                <h4 className="fw-bold">{selectedApplicant.name}</h4>
                <div className="text-muted">{selectedApplicant.email}</div>
                <div className="text-muted">{selectedApplicant.phone}</div>
              </Col>
              <Col md={8}>
                <h5 className="fw-bold border-bottom pb-2 mb-3">Personal Details</h5>
                <Row className="mb-4">
                  <Col xs={6}><small className="text-muted text-uppercase fw-bold d-block">Age</small><div>{selectedApplicant.age || 'N/A'}</div></Col>
                  <Col xs={6}><small className="text-muted text-uppercase fw-bold d-block">Gender</small><div>{selectedApplicant.gender || 'N/A'}</div></Col>
                  <Col xs={12} className="mt-2"><small className="text-muted text-uppercase fw-bold d-block">Address</small><div>{selectedApplicant.address || 'N/A'}</div></Col>
                </Row>
                <h5 className="fw-bold border-bottom pb-2 mb-3">Professional Skills</h5>
                <div className="mb-4">{selectedApplicant.skills?.split(',').map(s => <Badge key={s} bg="info" className="me-2 mb-2 p-2">{s.trim()}</Badge>) || 'No skills listed'}</div>
                <h5 className="fw-bold border-bottom pb-2 mb-3">Experience</h5>
                <p style={{ whiteSpace: 'pre-wrap' }}>{selectedApplicant.experience || 'No experience details provided.'}</p>
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default EmployerDashboard;
