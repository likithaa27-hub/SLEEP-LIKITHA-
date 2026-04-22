import React, { useState, useContext, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserProfile = () => {
  const { session, users, updateProfile } = useContext(AppContext);
  const currentUser = users.find(u => u.id === session?.id);

  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    address: '',
    age: '',
    gender: '',
    skills: '',
    experience: '',
    jobDescriptionInfo: ''
  });

  if (!session || session.role !== 'user') {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    if (!currentUser) return;
    setProfileData({
      name: currentUser.name || '',
      phone: currentUser.phone || '',
      address: currentUser.address || '',
      age: currentUser.age ?? '',
      gender: currentUser.gender || '',
      skills: currentUser.skills || '',
      experience: currentUser.experience || '',
      jobDescriptionInfo: currentUser.job_description_info || ''
    });
  }, [currentUser]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...profileData,
      age: profileData.age === '' ? undefined : Number(profileData.age)
    };
    const result = await updateProfile(session.id, payload);
    if (result && result.success) {
      toast.success('Profile updated successfully! Employers can now see your updated info.');
    } else {
      toast.error(result?.message || 'Failed to update profile. Please try again.');
    }
  };

  return (
    <Container>
      <h2 className="mb-4">My Personal Profile</h2>
      <Card className="shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control type="text" name="name" value={profileData.name} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control type="tel" name="phone" value={profileData.phone} onChange={handleChange} />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control type="text" name="address" value={profileData.address} onChange={handleChange} />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Age</Form.Label>
                  <Form.Control type="number" name="age" value={profileData.age} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select name="gender" value={profileData.gender} onChange={handleChange}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Skills (comma separated)</Form.Label>
                  <Form.Control type="text" name="skills" value={profileData.skills} onChange={handleChange} />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Experience</Form.Label>
                  <Form.Control as="textarea" rows={3} name="experience" value={profileData.experience} onChange={handleChange} placeholder="Briefly describe your work experience" />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Preferred Job Description</Form.Label>
                  <Form.Control as="textarea" rows={2} name="jobDescriptionInfo" value={profileData.jobDescriptionInfo} onChange={handleChange} placeholder="What kind of job are you looking for?" />
                </Form.Group>
              </Col>
            </Row>

            <Button variant="primary" type="submit">
              Save Profile Info
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserProfile;
