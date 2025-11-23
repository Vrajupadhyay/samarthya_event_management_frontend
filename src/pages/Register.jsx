import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registrationAPI } from '../services/api';
import QRCode from 'qrcode';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [error, setError] = useState('');
  const [paymentQRCode, setPaymentQRCode] = useState('');
  const [paymentUPIURL, setPaymentUPIURL] = useState('');
  
  // Check registration status on mount
  // COMMENTED OUT - Registration status check disabled
  // useEffect(() => {
  //   checkRegistrationStatus();
  // }, []);
  
  // const checkRegistrationStatus = async () => {
  //   try {
  //     const response = await registrationAPI.checkStatus();
  //     setRegistrationOpen(response.data.isOpen);
  //   } catch (err) {
  //     console.error('Failed to check registration status:', err);
  //     // If check fails, assume it's open (fallback)
  //     setRegistrationOpen(true);
  //   } finally {
  //     setCheckingStatus(false);
  //   }
  // };
  
  // Set registration as always open (status check disabled)
  useEffect(() => {
    setRegistrationOpen(true);
    setCheckingStatus(false);
  }, []);
  
  // Initialize with Individual type by default
  const [formData, setFormData] = useState({
    type: 'Individual',
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    gender: 'Male',
    paymentMode: 'Online',
    additionalMembers: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type,
      // For Individual: no additional members (total 1 person)
      // For Couple: automatically add 1 member (total 2 persons)
      additionalMembers: type === 'Individual' 
        ? []
        : type === 'Couple' 
        ? [{ firstName: '', lastName: '', gender: 'Male' }]
        : prev.additionalMembers
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
        navigate(`/success/${response.data.ticketId}`);
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate amount based on registration type
  const getAmount = () => {
    return formData.type === 'Individual' ? 1149 : 1999;
  };

  const amount = getAmount();

  // Generate UPI QR Code whenever amount changes
  useEffect(() => {
    const generateUPIQRCode = async () => {
      try {
        // UPI Payment URL format
        const upiID = '8866793934@ybl';
        const payeeName = 'BEAT BLAZE 2025';
        const upiURL = `upi://pay?pa=${upiID}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent('Event Registration')}`;
        
        console.log('✅ Generated UPI URL:', upiURL);
        console.log('💰 Payment Amount:', amount);
        
        // Store UPI URL for direct payment link
        setPaymentUPIURL(upiURL);
        
        // Generate QR code as data URL
        const qrCodeDataURL = await QRCode.toDataURL(upiURL, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        
        setPaymentQRCode(qrCodeDataURL);
        console.log('✅ QR Code generated successfully');
      } catch (err) {
        console.error('❌ Error generating UPI QR code:', err);
      }
    };

    generateUPIQRCode();
  }, [amount]);

  return (
    <div className="register-container">
      <div className="register-header">
        <Link to="/" className="back-button">← Back to Home</Link>
        <h1>Event Registration</h1>
        <p>31st December BEAT BLAZE 2025</p>
      </div>

      <div className="register-content">
        {checkingStatus ? (
          <div className="checking-status">
            <div className="spinner"></div>
            <p>Checking registration status...</p>
          </div>
        ) : !registrationOpen ? (
          <div className="registration-closed">
            <div className="closed-icon">🚫</div>
            <h2>Registration Closed</h2>
            <p className="closed-message">
              Registration for BEAT BLAZE 2025 is currently closed.
            </p>
            <div className="contact-info">
              <h3>For queries, contact:</h3>
              <div className="contact-details">
                <div className="contact-item">
                  <span className="contact-label">📧 Email:</span>
                  <a href="mailto:samarthyaevents07@gmail.com">samarthyaevents07@gmail.com</a>
                </div>
                <div className="contact-item">
                  <span className="contact-label">📞 Phone:</span>
                  <a href="tel:+919173864156">+91 9173864156</a>
                </div>
                <div className="contact-item">
                  {/* <span className="contact-label">🎪 Organizer:</span> */}
                  <span>Samarthya Events <br /> Devang Rathod</span>
                </div>
              </div>
            </div>
            <Link to="/" className="back-home-btn">← Back to Home</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="register-form">
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
                <p className="type-price">₹1,149</p>
              </div>
              <div
                className={`type-option ${formData.type === 'Couple' ? 'active' : ''}`}
                onClick={() => handleTypeChange('Couple')}
              >
                <div className="type-info">
                  <h4>Couple</h4>
                  <p className="type-desc">For 2 persons</p>
                </div>
                <p className="type-price">₹1,999</p>
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
                <label>Whatsapp Mobile Number *</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="10 digit whatsapp number"
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
                  <option value="Online">Online</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Members - Couple */}
          {formData.type === 'Couple' && (
            <div className="form-section">
              <h3>Partner Details</h3>
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

          {/* PhonePe Payment QR Code Section */}
          <div className="form-section payment-section">
              <h3>💳 Online Payment</h3>
              <div className="payment-qr-container">
                <div className="payment-instructions">
                  {/* <div className="info-banner">
                    <span className="info-icon">ℹ️</span>
                    <span>Pay ₹{amount.toLocaleString()} via UPI</span>
                  </div> */}
                  
                  {/* Copy UPI ID Button */}
                  <div className="payment-action">
                    <div className="upi-copy-section">
                      <p className="upi-label">UPI ID:</p>
                      <div className="upi-copy-wrapper">
                        <input 
                          type="text" 
                          value="8866793934@ybl" 
                          readOnly 
                          className="upi-id-input"
                          id="upiIdInput"
                        />
                        <button
                          type="button"
                          className="copy-upi-btn"
                          onClick={() => {
                            const upiId = '8866793934@ybl';
                            navigator.clipboard.writeText(upiId).then(() => {
                              // Show success feedback
                              const btn = document.querySelector('.copy-upi-btn');
                              const originalText = btn.innerHTML;
                              btn.innerHTML = '✅ Copied!';
                              btn.style.background = '#4caf50';
                              setTimeout(() => {
                                btn.innerHTML = originalText;
                                btn.style.background = '';
                              }, 2000);
                            }).catch(err => {
                              console.error('Failed to copy:', err);
                              alert('UPI ID: 8866793934@ybl');
                            });
                          }}
                        >
                          📋 Copy UPI ID
                        </button>
                      </div>
                      <p className="upi-amount-info">Pay exactly <strong>₹{amount.toLocaleString()}</strong> to this UPI ID</p>
                    </div>
                  </div>

                  <div className="payment-divider">
                    <span>OR</span>
                  </div>

                  <div className="payment-steps">
                    <h4>Scan QR Code to Pay ₹{amount.toLocaleString()}</h4>
                    <p>Open any UPI app, scan the code below, and complete the payment</p>
                  </div>
                </div>
                <div className="qr-code-display">
                  <div className="qr-code-wrapper">
                    {paymentQRCode ? (
                      <img 
                        src={paymentQRCode} 
                        alt="UPI Payment QR Code" 
                        className="payment-qr-image"
                      />
                    ) : (
                      <div className="qr-placeholder">
                        <div className="placeholder-icon">⏳</div>
                        <p>Generating QR Code...</p>
                        <small>Please wait</small>
                      </div>
                    )}
                  </div>
                  {/* <div className="payment-amount-highlight">
                    <span>Pay Amount:</span>
                    <strong>₹{amount.toLocaleString()}</strong>
                  </div> */}
                  {/* <div className="upi-details">
                    <p className="upi-id">UPI ID: <strong>8866793934@ybl</strong></p>
                    <p className="upi-hint">Click "Pay Now" or scan QR to pay ₹{amount.toLocaleString()}</p>
                  </div> */}
                </div>
              </div>
              
              {/* Critical Payment Warning */}
              <div className="payment-warning-box">
                <div className="warning-header">
                  <span className="warning-icon">⚠️</span>
                  <strong>IMPORTANT</strong>
                </div>
                <p className="warning-message">
                  If payment is not completed, your registration will <strong>NOT</strong> be considered valid and will be <strong>REJECTED</strong>.
                </p>
              </div>
            </div>

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
                Complete Registration
              </>
            )}
          </button>

          <p className="form-note">
            * After registration, you will receive a confirmation email and WhatsApp message with your QR code for entry.
          </p>
        </form>
        )}
      </div>

      {/* Developer Footer */}
      <div className="developer-footer">
        <div className="developer-content">
          <p className="developer-text">Developed by <strong>Vraj Upadhyay</strong></p>
          <div className="developer-links">
            <a 
              href="https://www.linkedin.com/in/vrajupadhyay/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link linkedin"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              LinkedIn
            </a>
            <a 
              href="https://www.instagram.com/vraj_upadhyay12/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link instagram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram
            </a>
            <a 
              href="https://vrajupadhyay.netlify.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link portfolio"
            >
              🌐 
              Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
