import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registrationAPI } from '../services/api';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ticketCheckLoading, setTicketCheckLoading] = useState(false);
  const [ticketStatus, setTicketStatus] = useState(null);
  
  // Initialize with Couple type and 1 partner member by default
  const [formData, setFormData] = useState({
    ticketId: '',
    type: 'Couple',
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    gender: 'Male',
    paymentMode: 'Cash',
    additionalMembers: [{ firstName: '', lastName: '', gender: 'Male' }]
  });

  // Check ticket availability when ticketId changes
  useEffect(() => {
    const checkTicket = async () => {
      if (formData.ticketId && formData.ticketId.length >= 7) {
        setTicketCheckLoading(true);
        try {
          const response = await fetch(`http://localhost:5000/api/register/tickets/check/${formData.ticketId}`);
          const result = await response.json();
          setTicketStatus(result);
        } catch (err) {
          console.error('Error checking ticket:', err);
          setTicketStatus(null);
        } finally {
          setTicketCheckLoading(false);
        }
      } else {
        setTicketStatus(null);
      }
    };

    const debounceTimer = setTimeout(checkTicket, 500);
    return () => clearTimeout(debounceTimer);
  }, [formData.ticketId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-format ticket ID: add BB_ prefix and keep only numbers
    if (name === 'ticketId') {
      // Remove any non-digit characters
      const digitsOnly = value.replace(/\D/g, '');
      // Limit to 4 digits
      const limitedDigits = digitsOnly.slice(0, 4);
      // Auto-add BB_ prefix
      const formattedValue = limitedDigits ? `BB_${limitedDigits}` : '';
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setError('');
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type,
      // For Individual: no additional members (total 1 person)
      // For Couple: automatically add 1 member (total 2 persons)
      // For Family: keep existing members or empty array
      additionalMembers: type === 'Individual' 
        ? []
        : type === 'Couple' 
        ? [{ firstName: '', lastName: '', gender: 'Male' }]
        : prev.additionalMembers
    }));
  };

  const addMember = () => {
    setFormData(prev => ({
      ...prev,
      additionalMembers: [
        ...prev.additionalMembers,
        { firstName: '', lastName: '', gender: 'Male' }
      ]
    }));
  };

  const removeMember = (index) => {
    setFormData(prev => ({
      ...prev,
      additionalMembers: prev.additionalMembers.filter((_, i) => i !== index)
    }));
  };

  const handleMemberChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      additionalMembers: prev.additionalMembers.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const validateForm = () => {
    // Validate ticket ID
    if (!formData.ticketId.trim()) return 'Ticket ID is required';
    if (!/^BB_\d{4}$/.test(formData.ticketId)) return 'Invalid ticket ID format. Must be BB_XXXX (e.g., BB_0001)';
    if (ticketStatus && !ticketStatus.available) return 'This ticket is not available';
    
    if (!formData.firstName.trim()) return 'First name is required';
    if (!formData.lastName.trim()) return 'Last name is required';
    if (!formData.mobile.trim()) return 'Mobile number is required';
    if (!/^[0-9]{10}$/.test(formData.mobile)) return 'Invalid mobile number (10 digits required)';
    if (!formData.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email address';
    
    // For Couple: must have exactly 1 additional member (total 2)
    if (formData.type === 'Couple' && formData.additionalMembers.length !== 1) {
      return 'Couple registration requires 2 members total';
    }
    
    // For Family: must have at least 1 additional member
    if (formData.type === 'Family' && formData.additionalMembers.length === 0) {
      return 'Please add at least one additional family member';
    }

    for (let i = 0; i < formData.additionalMembers.length; i++) {
      const member = formData.additionalMembers[i];
      if (!member.firstName.trim() || !member.lastName.trim()) {
        return `Please fill all details for member ${i + 1}`;
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await registrationAPI.create(formData);
      
      if (response.success) {
        navigate(`/success/${response.data.assignedTicketId || response.data.ticketId}`);
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const amount = formData.type === 'Individual' ? 1100 : (formData.type === 'Couple' ? 2000 : 4000);

  return (
    <div className="register-container">
      <div className="register-header">
        <Link to="/" className="back-button">← Back to Home</Link>
        <h1>Event Registration</h1>
        <p>31st December DJ Night 2025</p>
      </div>

      <div className="register-content">
        <form onSubmit={handleSubmit} className="register-form">
          {/* Ticket ID Section */}
          <div className="form-section">
            <h3>🎫 Ticket Information</h3>
            <div className="form-group">
              <label>Ticket Number * (Just enter the 4 digits)</label>
              <div className="ticket-input-wrapper">
                <span className="ticket-prefix">BB_</span>
                <input
                  type="text"
                  name="ticketId"
                  value={formData.ticketId.replace('BB_', '')}
                  onChange={handleChange}
                  // placeholder="0001"
                  maxLength={4}
                  required
                  className={`ticket-input ${ticketStatus ? (ticketStatus.available ? 'input-success' : 'input-error') : ''}`}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </div>
              
              {formData.ticketId && (
                <div className="ticket-preview">
                  Full Ticket ID: <strong>{formData.ticketId}</strong>
                </div>
              )}
              
              {ticketCheckLoading && (
                <span className="ticket-status checking">
                  🔄 Checking availability...
                </span>
              )}
              
              {ticketStatus && !ticketCheckLoading && (
                <span className={`ticket-status ${ticketStatus.available ? 'available' : 'unavailable'}`}>
                  {ticketStatus.available ? '✅ Available' : `❌ ${ticketStatus.message}`}
                </span>
              )}
              
              <small className="form-hint">
                Enter only the 4-digit number (e.g., 0001, 0100, 1000)
              </small>
            </div>
          </div>

          {/* Registration Type */}
          <div className="form-section">
            <h3>Select Registration Type</h3>
            <div className="type-selector">
              <div
                className={`type-option ${formData.type === 'Individual' ? 'active' : ''}`}
                onClick={() => handleTypeChange('Individual')}
              >
                <div className="type-info">
                  <h4>Individual</h4>
                  <p className="type-desc">For 1 person</p>
                </div>
                <p className="type-price">₹1,100</p>
              </div>
              <div
                className={`type-option ${formData.type === 'Couple' ? 'active' : ''}`}
                onClick={() => handleTypeChange('Couple')}
              >
                <div className="type-info">
                  <h4>Couple</h4>
                  <p className="type-desc">For 2 persons</p>
                </div>
                <p className="type-price">₹2,000</p>
              </div>
              <div
                className={`type-option ${formData.type === 'Family' ? 'active' : ''}`}
                onClick={() => handleTypeChange('Family')}
              >
                <div className="type-info">
                  <h4>Family</h4>
                  <p className="type-desc">For 3+ persons</p>
                </div>
                <p className="type-price">₹4,000</p>
              </div>
            </div>
          </div>

          {/* Main Member Details */}
          <div className="form-section">
            <h3>Main Member Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Mobile Number *</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="10 digit mobile number"
                  maxLength="10"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email ID *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Payment Mode *</label>
                <select
                  name="paymentMode"
                  value={formData.paymentMode}
                  onChange={handleChange}
                  required
                >
                  <option value="Cash">Cash</option>
                  <option value="Online">Online</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Members - Couple */}
          {formData.type === 'Couple' && (
            <div className="form-section">
              <h3>💑 Partner Details</h3>
              <div className="info-banner">
                <span className="info-icon">ℹ️</span>
                <span>Couple registration includes 2 persons (You + Partner)</span>
              </div>

              {formData.additionalMembers.map((member, index) => (
                <div key={index}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>First Name *</label>
                      <input
                        type="text"
                        value={member.firstName}
                        onChange={(e) => handleMemberChange(index, 'firstName', e.target.value)}
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name *</label>
                      <input
                        type="text"
                        value={member.lastName}
                        onChange={(e) => handleMemberChange(index, 'lastName', e.target.value)}
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Gender *</label>
                      <select
                        value={member.gender}
                        onChange={(e) => handleMemberChange(index, 'gender', e.target.value)}
                        required
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Additional Members - Family */}
          {formData.type === 'Family' && (
            <div className="form-section">
              <div className="section-header">
                <h3>👨‍👩‍👧‍👦 Additional Family Members</h3>
                <button type="button" className="add-member-btn" onClick={addMember}>
                  ➕ Add Member
                </button>
              </div>

              {formData.additionalMembers.map((member, index) => (
                <div key={index} className="member-row">
                  <div className="member-row-header">
                    <span className="member-label">Member {index + 1}</span>
                    <button
                      type="button"
                      className="remove-member-btn"
                      onClick={() => removeMember(index)}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>First Name *</label>
                      <input
                        type="text"
                        value={member.firstName}
                        onChange={(e) => handleMemberChange(index, 'firstName', e.target.value)}
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name *</label>
                      <input
                        type="text"
                        value={member.lastName}
                        onChange={(e) => handleMemberChange(index, 'lastName', e.target.value)}
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Gender *</label>
                      <select
                        value={member.gender}
                        onChange={(e) => handleMemberChange(index, 'gender', e.target.value)}
                        required
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  {index < formData.additionalMembers.length - 1 && (
                    <div className="member-divider"></div>
                  )}
                </div>
              ))}

              {formData.additionalMembers.length === 0 && (
                <div className="empty-members">
                  <p>No additional members added yet. Click "Add Member" to add family members.</p>
                </div>
              )}
            </div>
          )}

          {/* Summary */}
          <div className="form-section summary-section">
            <h3>Registration Summary</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span>Registration Type:</span>
                <strong>{formData.type}</strong>
              </div>
              <div className="summary-item">
                <span>Total Members:</span>
                <strong>{1 + formData.additionalMembers.length}</strong>
              </div>
              <div className="summary-item">
                <span>Payment Mode:</span>
                <strong>{formData.paymentMode}</strong>
              </div>
              <div className="summary-item total">
                <span>Total Amount:</span>
                <strong>₹{amount.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              <>
                🎫 Complete Registration
              </>
            )}
          </button>

          <p className="form-note">
            * After registration, you will receive a confirmation email with your QR code for entry.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
