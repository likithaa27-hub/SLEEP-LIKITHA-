import React, { useContext, useState } from 'react';
import { Container, Table, Button, Badge, Card, Modal, Image, Row, Col, Nav } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { session, users, updateUserStatus } = useContext(AppContext);
  const [showKycModal, setShowKycModal] = useState(false);
  const [selectedKycUser, setSelectedKycUser] = useState(null);
  const [filterTab, setFilterTab] = useState('all');

  if (!session || session.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const handleStatusChange = async (userId, newStatus) => {
    const result = await updateUserStatus(userId, newStatus);
    if (result && result.success) {
      toast.success(`User ${newStatus} successfully!`);
      // Update selectedKycUser state so modal buttons refresh
      if (selectedKycUser && selectedKycUser.id === userId) {
        setSelectedKycUser(prev => ({ ...prev, status: newStatus }));
      }
    } else {
      toast.error('Failed to update user status.');
    }
  };

  const handleViewKyc = (user) => {
    setSelectedKycUser(user);
    setShowKycModal(true);
  };

  const nonAdminUsers = users.filter(u => u.id !== session.id && u.role !== 'admin');

  const filteredUsers = nonAdminUsers.filter(u => {
    if (filterTab === 'all') return true;
    return u.status === filterTab;
  });

  const counts = {
    all: nonAdminUsers.length,
    pending: nonAdminUsers.filter(u => u.status === 'pending').length,
    accepted: nonAdminUsers.filter(u => u.status === 'accepted').length,
    rejected: nonAdminUsers.filter(u => u.status === 'rejected').length,
  };

  return (
    <Container>
      <h2 className="mb-2">Admin Dashboard: User Verification</h2>
      <p className="text-muted mb-4">Manually approve or reject job seeker and employer registrations.</p>

      {/* Filter Tabs */}
      <Nav variant="tabs" className="mb-3" activeKey={filterTab} onSelect={setFilterTab}>
        <Nav.Item>
          <Nav.Link eventKey="all">All <Badge bg="secondary">{counts.all}</Badge></Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="pending">Pending <Badge bg="warning" text="dark">{counts.pending}</Badge></Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="accepted">Accepted <Badge bg="success">{counts.accepted}</Badge></Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="rejected">Rejected <Badge bg="danger">{counts.rejected}</Badge></Nav.Link>
        </Nav.Item>
      </Nav>

      <Card className="shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>KYC</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge bg={user.role === 'employer' ? 'info' : 'secondary'}>
                      {user.role === 'user' ? 'Job Seeker' : user.role}
                    </Badge>
                  </td>
                  <td>
                    <Badge 
                      bg={
                        user.status === 'accepted' ? 'success' : 
                        user.status === 'rejected' ? 'danger' : 'warning'
                      }
                      text={user.status === 'pending' ? 'dark' : undefined}
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td>
                    {user.role === 'employer' ? (
                       <Button variant="outline-primary" size="sm" onClick={() => handleViewKyc(user)}>View KYC</Button>
                    ) : (
                       <span className="text-muted small">N/A</span>
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-2 flex-wrap">
                      {user.status !== 'accepted' && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleStatusChange(user.id, 'accepted')}
                        >
                          ✔ Approve
                        </Button>
                      )}
                      {user.status !== 'rejected' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleStatusChange(user.id, 'rejected')}
                        >
                          ✖ Reject
                        </Button>
                      )}
                      {user.status !== 'pending' && (
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleStatusChange(user.id, 'pending')}
                        >
                          ↩ Reset
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No users found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* KYC Modal */}
      <Modal show={showKycModal} onHide={() => setShowKycModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>KYC Details — {selectedKycUser?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <strong>Current Status: </strong>
            <Badge
              bg={
                selectedKycUser?.status === 'accepted' ? 'success' :
                selectedKycUser?.status === 'rejected' ? 'danger' : 'warning'
              }
              text={selectedKycUser?.status === 'pending' ? 'dark' : undefined}
            >
              {selectedKycUser?.status}
            </Badge>
          </div>
          {selectedKycUser && selectedKycUser.kyc ? (
             <div>
                <Row className="mb-3">
                    <Col><strong>Company:</strong> {selectedKycUser.company_name || 'N/A'}</Col>
                    <Col><strong>Phone Verified:</strong> {selectedKycUser.kyc.phone_verified ? 'Yes ✅' : 'No ❌'}</Col>
                </Row>
                <Row className="mb-3">
                    <Col><strong>Aadhar Number:</strong> {selectedKycUser.kyc.aadhar_number}</Col>
                </Row>
                <Row>
                     <Col md={6}>
                         <h6 className="mb-2">Aadhar Document</h6>
                         <Image src={`http://localhost:5000/api/users/${selectedKycUser.id}/kyc/aadhar`} fluid className="border rounded" alt="Aadhar" />
                     </Col>
                     <Col md={6}>
                         <h6 className="mb-2">Photo Document</h6>
                         <Image src={`http://localhost:5000/api/users/${selectedKycUser.id}/kyc/photo`} fluid className="border rounded" alt="Photo" />
                     </Col>
                </Row>
             </div>
          ) : (
              <p>No KYC Information available for this user.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowKycModal(false)}>
            Close
          </Button>
          {selectedKycUser?.status !== 'rejected' && (
            <Button
              variant="danger"
              onClick={() => {
                handleStatusChange(selectedKycUser.id, 'rejected');
              }}
            >
              ✖ Reject
            </Button>
          )}
          {selectedKycUser?.status !== 'accepted' && (
            <Button
              variant="success"
              onClick={() => {
                handleStatusChange(selectedKycUser.id, 'accepted');
              }}
            >
              ✔ Approve
            </Button>
          )}
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default AdminDashboard;
