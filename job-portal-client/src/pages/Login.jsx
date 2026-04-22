import React, { useState, useContext } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AppContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Read intent from URL: ?intent=jobseeker | ?intent=employer
  const intent = searchParams.get('intent');
  const isJobseeker = intent === 'jobseeker';
  const isEmployer  = intent === 'employer';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    
    if (result.success) {
      toast.success('Login successful!');
      if (result.user.role === 'admin')    navigate('/admin');
      else if (result.user.role === 'employer') navigate('/employer');
      else navigate('/user');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Container>
      <div className="mt-3 mb-2">
        <Link to="/" className="text-decoration-none">
          <h3 className="fw-bold" style={{ color: 'white' }}>
            <i className="bi bi-briefcase-fill me-2" style={{ color: 'var(--primary)' }}></i>JobConnect
          </h3>
        </Link>
      </div>
      <Row className="justify-content-md-center mt-3">
        <Col xs={12} md={6}>

          {/* Intent context banner */}
          {(isJobseeker || isEmployer) && (
            <Alert
              className="border-0 mb-3 text-center"
              style={{
                background: isJobseeker
                  ? 'linear-gradient(135deg,rgba(59,130,246,.2),rgba(99,102,241,.15))'
                  : 'linear-gradient(135deg,rgba(16,185,129,.2),rgba(5,150,105,.15))',
                border: `1px solid ${isJobseeker ? 'rgba(99,102,241,.4)' : 'rgba(16,185,129,.4)'}`,
                borderRadius: '12px',
                color: '#e2e8f0'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '4px' }}>
                {isJobseeker ? '🔍' : '🏢'}
              </div>
              <div className="fw-semibold" style={{ fontSize: '1rem' }}>
                {isJobseeker ? 'Looking for your next job?' : 'Looking to hire talent?'}
              </div>
              <div className="small mt-1" style={{ color: '#94a3b8' }}>
                {isJobseeker
                  ? 'Log in to browse jobs, apply, and track your applications.'
                  : 'Log in to post jobs, review applicants, and grow your team.'}
              </div>
              <div className="mt-2 small">
                New here?{' '}
                <Link
                  to={`/register?role=${isJobseeker ? 'user' : 'employer'}`}
                  className="fw-bold text-decoration-none"
                  style={{ color: isJobseeker ? '#818cf8' : '#34d399' }}
                >
                  Register as {isJobseeker ? 'Job Seeker →' : 'Employer →'}
                </Link>
              </div>
            </Alert>
          )}

          <Card className="shadow-sm border-0 interactive-card">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4 text-primary fw-bold">
                {isJobseeker ? '👋 Welcome, Job Seeker' : isEmployer ? '👋 Welcome, Employer' : 'Welcome Back'}
              </h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Enter email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                
                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit" size="lg">
                    Log In
                  </Button>
                </div>
              </Form>
              <div className="text-center mt-4">
                Don't have an account?{' '}
                <Link
                  to={intent ? `/register?role=${isJobseeker ? 'user' : 'employer'}` : '/register'}
                  className="text-decoration-none fw-bold"
                >
                  Register here
                </Link>
              </div>
              
              <hr className="my-4" />
              <div className="text-muted small text-center">
                <strong>Demo Account:</strong><br />
                Admin: admin@test.com / admin
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
