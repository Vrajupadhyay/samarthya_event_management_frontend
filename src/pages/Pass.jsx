import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Pass.css';

const Pass = () => {
  const { registrationId } = useParams();
  const navigate = useNavigate();
  const [pass, setPass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPass();
  }, [registrationId]);

  const fetchPass = async () => {
    try {
      setLoading(true);
      setError('');

      // Use the correct API endpoint - /api/register/:registrationId
      const response = await fetch(`http://localhost:5001/api/register/${registrationId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch pass');
      }

      setPass(data.data);
    } catch (err) {
      console.error('Error fetching pass:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a canvas to draw the pass
    const link = document.createElement('a');
    link.download = `DJ-Night-2025-Pass-${registrationId}.png`;
    
    // For now, just print
    window.print();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="pass-loading">
        <div className="loading-spinner"></div>
        <p>Loading your pass...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pass-error">
        <div className="error-icon">⚠️</div>
        <h2>Unable to Load Pass</h2>
        <p>{error}</p>
        <button onClick={handleGoHome} className="btn-home">
          Go to Home
        </button>
      </div>
    );
  }

  if (!pass) {
    return (
      <div className="pass-error">
        <div className="error-icon">❌</div>
        <h2>Pass Not Found</h2>
        <p>The pass you're looking for doesn't exist or has been removed.</p>
        <button onClick={handleGoHome} className="btn-home">
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="pass-page">
      <div className="pass-container">
        
        {/* Header Section */}
        <div className="pass-header">
          <div className="pass-badge">
            <span className="badge-approved">✓ APPROVED</span>
          </div>
          <h1 className="pass-title">
            <span className="title-gradient">BEAT BLAZE 2025</span>
          </h1>
          <p className="pass-subtitle">New Year's Eve Celebration</p>
          <div className="pass-date">
            <span className="date-icon">📅</span>
            <span>31st December 2025 | 6:45 PM Onwards</span>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="pass-qr-section">
          <div className="qr-wrapper">
            <div className="qr-border-animation"></div>
            {pass.qrCode && (
              <img 
                src={pass.qrCode} 
                alt="QR Code" 
                className="qr-image"
              />
            )}
          </div>
          <p className="qr-instruction">
            <span className="instruction-icon">👆</span>
            Show this QR code at entry
          </p>
        </div>

        {/* Registration Details */}
        <div className="pass-details">
          <div className="detail-section">
            <h3 className="section-title">
              <span className="section-icon">🎫</span>
              Registration Details
            </h3>
            
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Ticket ID</span>
                <span className="detail-value id-value">{pass.assignedTicketId || pass.ticketId}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Pass Type</span>
                <span className="detail-value type-badge">
                  {pass.type === 'Couple' ? '💑' : '👨‍👩‍👧‍👦'} {pass.type} Pass
                </span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Guest Name</span>
                <span className="detail-value name-value">
                  {pass.firstName} {pass.lastName}
                </span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Total Members</span>
                <span className="detail-value members-value">
                  👥 {pass.totalMembers} {pass.totalMembers === 1 ? 'Person' : 'People'}
                </span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Contact</span>
                <span className="detail-value contact-value">
                  📱 {pass.mobile}
                </span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value email-value">
                  📧 {pass.email}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Members */}
          {pass.additionalMembers && pass.additionalMembers.length > 0 && (
            <div className="detail-section">
              <h3 className="section-title">
                <span className="section-icon">👥</span>
                Additional Members
              </h3>
              <div className="members-list">
                {pass.additionalMembers.map((member, index) => (
                  <div key={index} className="member-card">
                    <span className="member-number">{index + 2}</span>
                    <div className="member-info">
                      <span className="member-name">
                        {member.firstName} {member.lastName}
                      </span>
                      <span className="member-gender">
                        {member.gender === 'Male' ? '👨' : member.gender === 'Female' ? '👩' : '🧑'} {member.gender}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Event Details */}
          <div className="detail-section">
            <h3 className="section-title">
              <span className="section-icon">🎉</span>
              Event Information
            </h3>
            
            <div className="event-info-grid">
              <div className="event-info-card">
                <span className="info-icon">📍</span>
                <div className="info-content">
                  <span className="info-label">Venue</span>
                  <span className="info-value">Vadodara, Gujarat</span>
                </div>
              </div>
              
              <div className="event-info-card">
                <span className="info-icon">🕒</span>
                <div className="info-content">
                  <span className="info-label">Time</span>
                  <span className="info-value">8:00 PM Onwards</span>
                </div>
              </div>
              
              <div className="event-info-card">
                <span className="info-icon">👔</span>
                <div className="info-content">
                  <span className="info-label">Dress Code</span>
                  <span className="info-value">Party Attire</span>
                </div>
              </div>
              
              <div className="event-info-card">
                <span className="info-icon">🎵</span>
                <div className="info-content">
                  <span className="info-label">Entertainment</span>
                  <span className="info-value">Live DJ & More</span>
                </div>
              </div>
            </div>
          </div>

          {/* What's Included */}
          <div className="detail-section">
            <h3 className="section-title">
              <span className="section-icon">✨</span>
              What's Included
            </h3>
            
            <div className="included-grid">
              <div className="included-item">
                <span className="check-icon">✓</span>
                <span>Unlimited Buffet Dinner</span>
              </div>
              <div className="included-item">
                <span className="check-icon">✓</span>
                <span>Welcome Drinks</span>
              </div>
              <div className="included-item">
                <span className="check-icon">✓</span>
                <span>DJ & Live Music</span>
              </div>
              <div className="included-item">
                <span className="check-icon">✓</span>
                <span>Photo Booth Access</span>
              </div>
              <div className="included-item">
                <span className="check-icon">✓</span>
                <span>Games & Prizes</span>
              </div>
              <div className="included-item">
                <span className="check-icon">✓</span>
                <span>Fireworks at Midnight</span>
              </div>
            </div>
          </div>

          {/* Entry Instructions */}
          <div className="detail-section instructions-section">
            <h3 className="section-title">
              <span className="section-icon">⚠️</span>
              Entry Instructions
            </h3>
            
            <div className="instructions-list">
              <div className="instruction-item">
                <span className="instruction-number">1</span>
                <span className="instruction-text">
                  Carry this pass (printed or on your phone)
                </span>
              </div>
              <div className="instruction-item">
                <span className="instruction-number">2</span>
                <span className="instruction-text">
                  Valid ID proof required for all attendees
                </span>
              </div>
              <div className="instruction-item">
                <span className="instruction-number">3</span>
                <span className="instruction-text">
                  Arrive 30 minutes before event time
                </span>
              </div>
              <div className="instruction-item">
                <span className="instruction-number">4</span>
                <span className="instruction-text">
                  Security check mandatory at entry
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pass-actions no-print">
          <button onClick={handlePrint} className="btn-action btn-print">
            <span className="btn-icon">🖨️</span>
            Print Pass
          </button>
          <button onClick={handleDownload} className="btn-action btn-download">
            <span className="btn-icon">📥</span>
            Download
          </button>
          <button onClick={handleGoHome} className="btn-action btn-home-alt">
            <span className="btn-icon">🏠</span>
            Home
          </button>
        </div>

        {/* Footer */}
        <div className="pass-footer">
          <div className="footer-organizers">
            <p className="footer-label">Organized By</p>
            <div className="footer-logos">
              <span>7 Sports Academy</span>
              <span className="separator">•</span>
              <span>Samarthya Events</span>
            </div>
          </div>
          <div className="footer-contact">
            <p>For any queries: <a href="mailto:event@ieeebvm.in">event@ieeebvm.in</a></p>
          </div>
          <div className="footer-disclaimer">
            <p>⚠️ This pass is non-transferable. Management reserves all rights.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Pass;
