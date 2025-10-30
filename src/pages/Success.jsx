import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { registrationAPI } from '../services/api';
import QRCode from 'qrcode';
import './Success.css';

const Success = () => {
  const { registrationId } = useParams(); // This is actually ticketId now
  const navigate = useNavigate();
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    fetchRegistration();
  }, [registrationId]);

  const fetchRegistration = async () => {
    try {
      const response = await registrationAPI.getById(registrationId);
      if (response.success) {
        setRegistration(response.data);
        
        // Use the QR code from database (already generated during ticket creation)
        if (response.data.qrCodeDataURL) {
          setQrCodeUrl(response.data.qrCodeDataURL);
        } else if (response.data.status === 'Accepted' && response.data.assignedTicketId) {
          // Fallback: generate if not present
          generateBlueQRCode(response.data.assignedTicketId);
        }
      } else {
        setError('Registration not found');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch registration details');
    } finally {
      setLoading(false);
    }
  };

  const generateBlueQRCode = async (ticketId) => {
    try {
      const qrUrl = await QRCode.toDataURL(ticketId, {
        width: 400,
        margin: 2,
        color: {
          dark: '#2563eb',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      });
      setQrCodeUrl(qrUrl);
    } catch (err) {
      console.error('Failed to generate QR code:', err);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `QR-${registration.assignedTicketId || registration.ticketId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="success-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading registration details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="success-container">
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="home-btn">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (!registration) {
    return null;
  }

  const isVerified = registration.status === 'Accepted';
  const isPending = registration.status === 'Pending';
  const isRejected = registration.status === 'Rejected';

  return (
    <div className="success-container">
      <div className="success-header">
        <div className="success-icon">✓</div>
        <h1>Registration Successful!</h1>
        <p>Thank you for registering for the event</p>
      </div>

      <div className="ticket-card">
        <div className="ticket-header">
          <div className="ticket-logo">
            <div className="logo-circle">🎉</div>
            <div className="event-info">
              <h2>31st December DJ Night 2025</h2>
              <p>XYZ Club, City</p>
            </div>
          </div>
          <div className="ticket-type-badge">
            {registration.type}
          </div>
        </div>

        <div className="ticket-body">
          <div className="ticket-content">
            <div className="guest-section">
              <h3 className="section-title">Guest Information</h3>
              
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Ticket ID</span>
                  <span className="info-value id-value">{registration.assignedTicketId || registration.ticketId}</span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">Name</span>
                  <span className="info-value">
                    {registration.firstName} {registration.lastName}
                  </span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{registration.email}</span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">Mobile</span>
                  <span className="info-value">{registration.mobile}</span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">Gender</span>
                  <span className="info-value">{registration.gender}</span>
                </div>
              </div>

              <div className="event-details">
                <h3 className="section-title">Event Details</h3>
                <div className="detail-row">
                  <span className="detail-icon">📅</span>
                  <span className="detail-text">31st December 2025</span>
                </div>
                <div className="detail-row">
                  <span className="detail-icon">🕖</span>
                  <span className="detail-text">7:00 PM onwards</span>
                </div>
                <div className="detail-row">
                  <span className="detail-icon">📍</span>
                  <span className="detail-text">XYZ Club, City</span>
                </div>
              </div>

              <div className="payment-info">
                <h3 className="section-title">Payment Information</h3>
                <div className="payment-grid">
                  <div className="payment-item">
                    <span className="payment-label">Amount</span>
                    <span className="payment-value">₹{registration.amount?.toLocaleString()}</span>
                  </div>
                  <div className="payment-item">
                    <span className="payment-label">Payment Mode</span>
                    <span className="payment-value">{registration.paymentMode}</span>
                  </div>
                  <div className="payment-item">
                    <span className="payment-label">Status</span>
                    <span className={`status-badge status-${registration.status?.toLowerCase()}`}>
                      {registration.status}
                    </span>
                  </div>
                </div>
              </div>

              {registration.additionalMembers && registration.additionalMembers.length > 0 && (
                <div className="members-section">
                  <h3 className="section-title">
                    {registration.type === 'Couple' ? 'Partner Details' : 'Additional Members'}
                  </h3>
                  {registration.additionalMembers.map((member, index) => (
                    <div key={index} className="member-card">
                      <div className="member-avatar">{member.firstName.charAt(0)}</div>
                      <div className="member-details">
                        <div className="member-name">
                          {member.firstName} {member.lastName}
                        </div>
                        <div className="member-gender">{member.gender}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="ticket-footer">
          <div className="footer-note">
            <span className="icon">📧</span>
            <span>
              {isVerified 
                ? 'A confirmation email with QR code has been sent to your email address'
                : 'You will receive a confirmation email once your registration is verified'
              }
            </span>
          </div>
        </div>
      </div>

      {isVerified && (
        <div className="notification-card success-notification">
          <div className="notification-icon">✉️</div>
          <div className="notification-content">
            <h4>Email Sent Successfully</h4>
            <p>Check your inbox at <strong>{registration.email}</strong> for registration confirmation and QR code.</p>
          </div>
        </div>
      )}

      <div className="info-cards">
        <div className="info-card">
          <div className="info-card-icon">⚠️</div>
          <h4>Important</h4>
          <ul>
            <li>Keep your QR code secure and do not share with others</li>
            <li>Entry will be allowed only with a valid QR code</li>
            <li>QR code is valid for registered members only</li>
            <li>Carry a valid ID proof for verification</li>
          </ul>
        </div>

        <div className="info-card">
          <div className="info-card-icon">📋</div>
          <h4>Event Guidelines</h4>
          <ul>
            <li>Entry starts at 6:30 PM</li>
            <li>Age restriction: 21+ only</li>
            <li>Dress code: Smart casuals</li>
            <li>Outside food and beverages not allowed</li>
          </ul>
        </div>
      </div>

      <div className="action-buttons no-print">
        {isVerified && (
          <button onClick={handlePrint} className="print-btn">
            <span className="btn-icon">🖨️</span>
            Print Ticket
          </button>
        )}
        <button onClick={() => navigate('/')} className="home-btn">
          <span className="btn-icon">🏠</span>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Success;
