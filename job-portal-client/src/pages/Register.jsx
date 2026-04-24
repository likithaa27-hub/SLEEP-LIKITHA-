import React, { useState, useContext } from 'react';
import { Form, Button, Card, Container, Row, Col, InputGroup } from 'react-bootstrap';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { apiUrl } from '../config/api';

const Register = () => {
  const [searchParams] = useSearchParams();
  const presetRole = searchParams.get('role') || 'user';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: presetRole,
    company_name: '',
    address: '',
    city: '',
    state: '',
    aadhar_number: ''
  });

  const [files, setFiles] = useState({ aadhar_doc: null, photo_doc: null });
  const [otpStep, setOtpStep] = useState(false); // true if waiting for OTP
  const [otp, setOtp] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);

  const { register } = useContext(AppContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const sendOtp = async () => {
    const phone = formData.phone.replace(/[^0-9]/g, '');
    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      toast.error('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    try {
      const resp = await fetch(apiUrl('/otp/send'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await resp.json();
      if (data.success) {
        setOtpStep(true);
        toast.success(data.message || 'OTP Sent!');
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      toast.error('Server error sending OTP');
    }
  };

  const resendOtp = async () => {
    const phone = formData.phone.replace(/[^0-9]/g, '');
    try {
      const resp = await fetch(apiUrl('/otp/resend'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
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

  const verifyOtp = async () => {
    const phone = formData.phone.replace(/[^0-9]/g, '');
    try {
      const resp = await fetch(apiUrl('/otp/verify'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      });
      const data = await resp.json();
      if (data.success) {
        setPhoneVerified(true);
        setOtpStep(false);
        toast.success('Phone verified successfully!');
      } else {
        toast.error(data.message || 'Invalid OTP');
      }
    } catch (err) {
      toast.error('Server error verifying OTP');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.role !== 'admin' && !phoneVerified) {
      toast.error('Please verify your phone number via OTP to continue.');
      return;
    }

    if (formData.role === 'employer' && (!files.aadhar_doc || !files.photo_doc)) {
      toast.error('Both Aadhar Document and Photo are required for KYC.');
      return;
    }

    const phone = formData.phone.replace(/[^0-9]/g, '');

    let submitData;

    if (formData.role === 'employer') {
      const company_location = JSON.stringify({
        address: formData.address,
        city: formData.city,
        state: formData.state,
      });

      submitData = new FormData();
      Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
      submitData.set('phone', phone);
      submitData.append('company_location', company_location);
      submitData.append('phone_verified', phoneVerified);
      submitData.append('aadhar_doc', files.aadhar_doc);
      submitData.append('photo_doc', files.photo_doc);
    } else {
      submitData = { ...formData, phone };
    }

    const result = await register(submitData);

    if (result.success) {
      toast.success(result.message);
      navigate('/login');
    } else {
      toast.error(result.message);
    }
  };

  const isEmp = formData.role === 'employer';

  return (
    <Container>
      <div className="mt-3 mb-2">
        <Link to="/" className="text-decoration-none">
          <h3 className="fw-bold" style={{ color: 'white' }}>
            <i className="bi bi-briefcase-fill me-2" style={{ color: 'var(--primary)' }}></i>JobConnect
          </h3>
        </Link>
      </div>
      <Row className="justify-content-md-center mt-3 mb-5">
        <Col xs={12} md={isEmp ? 10 : 6}>
          <Card className="shadow-sm border-0 interactive-card">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4 text-primary fw-bold">Create an Account</h2>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={isEmp ? 6 : 12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name / Contact Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Mobile Number</Form.Label>
                      <InputGroup>
                        <InputGroup.Text style={{ background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', fontWeight: 600 }}>
                          +91
                        </InputGroup.Text>
                        <Form.Control
                          type="tel"
                          name="phone"
                          placeholder="10-digit mobile number"
                          value={formData.phone}
                          onChange={handleChange}
                          maxLength={10}
                          readOnly={phoneVerified}
                        />
                        {formData.role !== 'admin' && !phoneVerified && !otpStep && (
                          <Button variant="outline-primary" onClick={sendOtp}>
                            Verify
                          </Button>
                        )}
                      </InputGroup>
                    </Form.Group>

                    {otpStep && !phoneVerified && (
                      <Form.Group className="mb-3">
                        <Form.Label>Enter OTP</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="text"
                            placeholder="6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                          />
                          <Button variant="outline-secondary" onClick={resendOtp}>Resend</Button>
                          <Button variant="success" onClick={verifyOtp}>Confirm</Button>
                        </InputGroup>
                      </Form.Group>
                    )}

                    {phoneVerified && (
                      <div className="mb-3 text-success">
                        <i className="bi bi-check-circle-fill me-2"></i>Phone number verified successfully
                      </div>
                    )}

                    <Form.Group className="mb-3">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Minimum 6 characters"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>I am a...</Form.Label>
                      <Form.Select name="role" value={formData.role} onChange={handleChange}>
                        <option value="user">🔍 Job Seeker</option>
                        <option value="employer">🏢 Employer</option>
                        <option value="admin">⚙️ Admin</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {isEmp && (
                    <Col md={6}>
                      <h5 className="mb-3 text-warning border-bottom pb-2">Employer Details (KYC)</h5>
                      <Form.Group className="mb-3">
                        <Form.Label>Company Name</Form.Label>
                        <Form.Control type="text" name="company_name" value={formData.company_name} onChange={handleChange} required />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Company Address (HQ)</Form.Label>
                        <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} required />
                      </Form.Group>

                      <Row>
                        <Col>
                          <Form.Group className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control type="text" name="city" value={formData.city} onChange={handleChange} required />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group className="mb-3">
                            <Form.Label>State</Form.Label>
                            <Form.Control type="text" name="state" value={formData.state} onChange={handleChange} required />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Aadhar Number (12 Digits)</Form.Label>
                        <Form.Control type="text" name="aadhar_number" value={formData.aadhar_number} onChange={handleChange} minLength={12} maxLength={12} required />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Upload Aadhar Document</Form.Label>
                        <Form.Control type="file" name="aadhar_doc" accept="image/*,.pdf" onChange={handleFileChange} required />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Upload Clear Photo</Form.Label>
                        <Form.Control type="file" name="photo_doc" accept="image/*" onChange={handleFileChange} required />
                      </Form.Group>
                    </Col>
                  )}
                </Row>

                <div className="d-grid gap-2 mt-4">
                  <Button variant="primary" type="submit" size="lg">
                    Register
                  </Button>
                </div>
              </Form>
              <div className="text-center mt-4">
                Already have an account? <Link to="/login" className="text-decoration-none fw-bold">Login here</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
