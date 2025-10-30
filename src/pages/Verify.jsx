import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyRegistration } from '../services/api';
import './Verify.css';

const Verify = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    registrationId: '',
    mobile: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (!formData.registrationId || !formData.mobile) {
        setError('Please provide both Registration ID and Mobile Number');
        setLoading(false);
        return;
      }

      // Verify registration
      const response = await verifyRegistration(formData.registrationId, formData.mobile);

      if (response.success) {
        // Navigate to pass page with the encoded registration ID
        navigate(`/pass/${response.data.encodedId}`);
      } else {
        setError(response.message || 'Verification failed. Please check your details.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Home
        </button>
        <h1>🔍 Verify Registration</h1>
        <p>Retrieve your event pass</p>
      </div>

      <div className="verify-content">
        <div className="verify-card">
          <div className="verify-icon">📧</div>
          <h2>Didn't Receive Your Email?</h2>
          <p className="verify-description">
            Enter your Registration ID and Mobile Number to retrieve your event pass.
          </p>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="verify-form">
            <div className="form-group">
              <label htmlFor="registrationId">Registration ID</label>
              <input
                type="text"
                id="registrationId"
                name="registrationId"
                value={formData.registrationId}
                onChange={handleChange}
                placeholder="e.g., REG-2025-001"
                required
              />
              <span className="input-hint">Found in your registration confirmation</span>
            </div>

            <div className="form-group">
              <label htmlFor="mobile">Mobile Number</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter your 10-digit mobile number"
                pattern="[0-9]{10}"
                maxLength="10"
                required
              />
              <span className="input-hint">10 digits without country code</span>
            </div>

            <button type="submit" className="verify-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Verifying...
                </>
              ) : (
                <>
                  <span className="btn-icon">🔓</span>
                  Retrieve My Pass
                </>
              )}
            </button>
          </form>

          <div className="help-section">
            <h3>📌 Need Help?</h3>
            <ul>
              <li>Check your email inbox and spam folder for the registration confirmation</li>
              <li>Ensure you enter the exact Registration ID and Mobile Number used during registration</li>
              <li>Registration ID format: REG-2025-XXX</li>
              <li>Contact support if you continue to face issues</li>
            </ul>
          </div>

          <div className="contact-section">
            <p>Still having trouble? Contact us at:</p>
            <a href="mailto:event@ieeebvm.in" className="contact-link">
              📧 event@ieeebvm.in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
