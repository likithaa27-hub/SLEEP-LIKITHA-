import React, { useState, useContext, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import { Navigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { toast } from 'react-toastify';
import { haversineDistance, estimateTravelTime } from '../utils/geoUtils';
import JobCard from '../components/JobCard';
import ApplyModal from '../components/ApplyModal';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const userLocationIcon = L.divIcon({
  className: '',
  html: `
    <div style="position:relative; width:28px; height:28px;">
      <div style="position:absolute; inset:0; background:rgba(59,130,246,0.25); border-radius:50%; animation: pulse-ring 1.5s ease-out infinite;"></div>
      <div style="position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); width:14px; height:14px; background:#3b82f6; border:3px solid white; border-radius:50%; box-shadow:0 0 6px rgba(59,130,246,0.8);"></div>
    </div>
    <style>@keyframes pulse-ring { 0% { transform: scale(0.5); opacity:1; } 100% { transform: scale(2.2); opacity:0; } }</style>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const FlyToLocation = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 12, { animate: true, duration: 1.4 });
  }, [coords, map]);
  return null;
};

const NearbyJobsPage = () => {
  const { session, jobs, applications, userLocation, locationStatus, locationError, requestLocation, clearLocation, applyForJob } = useContext(AppContext);
  const [searchRadius, setSearchRadius] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  if (!session || session.role !== 'user') {
    return <Navigate to="/login" replace />;
  }

  const myApplications = applications.filter(a => a.userId === session.id);

  const filteredJobs = jobs.filter(job => {
    if (userLocation && searchRadius > 0) {
      if (job.lat && job.lng) {
        const dist = haversineDistance(userLocation, [job.lat, job.lng]);
        return dist <= searchRadius;
      }
      return false;
    }
    return true;
  });

  const handleApplyClick = (job) => {
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
    if (!selectedJob) return;
    const result = await applyForJob(selectedJob.id, coverMessage);
    if (result.success) {
      toast.success(result.message);
      setShowApplyModal(false);
    } else {
      toast.error(result.message);
    }
  };

  const indiaCenter = [20.5937, 78.9629];
  const indiaBounds = [[6.5546079, 68.1113787], [35.6745457, 97.395561]];
  const mapCenter = userLocation || indiaCenter;
  const mapZoom = userLocation ? 12 : 5;

  return (
    <Container>
      <h2 className="mb-4">Nearby Jobs Map</h2>

      {/* Location Control Card */}
      <Card className="shadow-sm border-0 mb-4 bg-dark text-white" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div className="d-flex align-items-center gap-3">
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                {locationStatus === 'loading' ? <Spinner animation="border" size="sm" variant="primary" /> : '📍'}
              </div>
              <div>
                <div className="fw-semibold">
                  {locationStatus === 'success' ? 'Your location is active' : locationStatus === 'error' ? 'Location unavailable' : 'Detect your location'}
                </div>
                <div className="small text-muted">
                  {locationStatus === 'success' ? `Coordinates: ${userLocation[0].toFixed(4)}, ${userLocation[1].toFixed(4)}` : locationError || 'Share your location to filter jobs by distance.'}
                </div>
              </div>
            </div>
            <div className="d-flex gap-2">
              <Button variant="primary" size="sm" onClick={requestLocation} disabled={locationStatus === 'loading'}>
                {locationStatus === 'loading' ? 'Detecting...' : '📍 Share My Location'}
              </Button>
              {locationStatus === 'success' && (
                <Button variant="outline-danger" size="sm" onClick={() => { clearLocation(); setSearchRadius(0); }}>
                  Clear
                </Button>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Radius Slider */}
      {userLocation && (
        <Card className="shadow-sm border-0 mb-4 bg-dark text-white" style={{ border: '1px solid #334155' }}>
          <Card.Body>
            <Row className="align-items-center">
              <Col md={3}>
                <div className="fw-bold small">DISTANCE FILTER</div>
                <div className="text-muted small">Only show jobs within radius</div>
              </Col>
              <Col md={7}>
                <Form.Range min="0" max="100" step="5" value={searchRadius} onChange={(e) => setSearchRadius(parseInt(e.target.value))} />
                <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.7rem' }}>
                  <span>0 km</span><span>25 km</span><span>50 km</span><span>75 km</span><span>100 km</span>
                </div>
              </Col>
              <Col md={2} className="text-end">
                <Badge bg={searchRadius > 0 ? 'primary' : 'secondary'} className="p-2 fs-6">
                  {searchRadius === 0 ? 'All' : `${searchRadius} km`}
                </Badge>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Map Card */}
      <Card className="shadow-sm border-0 mb-5" style={{ overflow: 'hidden', height: '600px' }}>
        <MapContainer center={mapCenter} zoom={mapZoom} minZoom={5} maxBounds={indiaBounds} maxBoundsViscosity={1.0} style={{ height: '100%', width: '100%' }}>
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {userLocation && <FlyToLocation coords={userLocation} />}
          {userLocation && (
            <>
              <Marker position={userLocation} icon={userLocationIcon}><Popup><strong>📍 You are here</strong></Popup></Marker>
              <Circle center={userLocation} radius={searchRadius > 0 ? searchRadius * 1000 : 30000} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.06, weight: 1.5, dashArray: searchRadius > 0 ? '0' : '6 4' }} />
            </>
          )}
          {filteredJobs.map(job => {
            if (!job.lat || !job.lng) return null;
            return (
              <Marker key={job.id} position={[job.lat, job.lng]}>
                <Popup minWidth={220}>
                  <JobCard job={job} userLocation={userLocation} onApply={handleApplyClick} isCompact={true} />
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </Card>

      <ApplyModal show={showApplyModal} onHide={() => setShowApplyModal(false)} job={selectedJob} userLocation={userLocation} onSubmit={handleApplySubmit} />
    </Container>
  );
};

export default NearbyJobsPage;
