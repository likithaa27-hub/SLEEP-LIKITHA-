import React, { useState, useContext } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert, Nav, InputGroup } from 'react-bootstrap';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { apiUrl } from '../config/api';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const { login, loginWithOtp } = useContext(AppContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Read intent from URL: ?intent=jobseeker | ?intent=employer
  const intent = searchParams.get('intent');
  const isJobseeker = intent === 'jobseeker';
  const isEmployer  = intent === 'employer';

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    handleLoginResult(result);
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!otpSent) {
      toast.error('Please request an OTP first.');
      return;
    }
    const result = await loginWithOtp(phone.replace(/[^0-9]/g, ''), otp);
    handleLoginResult(result);
  };

  const handleLoginResult = (result) => {
    if (result.success) {
      toast.success('Login successful!');
      if (result.user.role === 'admin')    navigate('/admin');
      else if (result.user.role === 'employer') navigate('/employer');
      else navigate('/user');
    } else {
      toast.error(result.message);
    }
  };

  const sendOtp = async () => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!/^[6-9][0-9]{9}$/.test(cleanPhone)) {
      toast.error('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    try {
      const resp = await fetch(apiUrl('/otp/send'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone })
      });
      const data = await resp.json();
      if (data.success) {
        setOtpSent(true);
        toast.success(data.message || 'OTP Sent!');
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      toast.error('Server error sending OTP');
    }
  };

  const resendOtp = async () => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    try {
      const resp = await fetch(apiUrl('/otp/resend'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone })
      });
      const data = await resp.json();
      if (data.success) {
        toast.success('New OTP sent successfully!');
      } else {
        toast.error(data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      toast.error('Server error resending OTP');
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
              <Nav variant="pills" className="justify-content-center mb-4">
                <Nav.Item>
                  <Nav.Link 
                    active={loginMethod === 'email'} 
                    onClick={() => setLoginMethod('email')}
                    style={{ cursor: 'pointer' }}
                  >
                    Email
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={loginMethod === 'phone'} 
                    onClick={() => setLoginMethod('phone')}
                    style={{ cursor: 'pointer' }}
                  >
                    Phone (OTP)
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              {loginMethod === 'email' ? (
                <Form onSubmit={handleEmailSubmit}>
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
              ) : (
                <Form onSubmit={handlePhoneSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mobile Number</Form.Label>
                    <InputGroup>
                      <InputGroup.Text style={{ background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', fontWeight: 600 }}>
                        +91
                      </InputGroup.Text>
                      <Form.Control
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        maxLength={10}
                        required
                        disabled={otpSent}
                      />
                      {!otpSent && (
                        <Button variant="outline-primary" onClick={sendOtp}>
                          Send OTP
                        </Button>
                      )}
                    </InputGroup>
                  </Form.Group>

                  {otpSent && (
                    <Form.Group className="mb-4">
                      <Form.Label>Enter OTP</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          placeholder="6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                        <Button variant="outline-secondary" onClick={resendOtp}>Resend</Button>
                      </InputGroup>
                    </Form.Group>
                  )}
                  
                  <div className="d-grid gap-2">
                    <Button variant="primary" type="submit" size="lg" disabled={!otpSent}>
                      Log In
                    </Button>
                  </div>
                </Form>
              )}
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
