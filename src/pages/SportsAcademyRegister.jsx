import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registrationAPI, promocodeAPI } from '../services/api';
import QRCode from 'qrcode';
import './Register.css';

const SportsAcademyRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [error, setError] = useState('');
  const [promocodeLoading, setPromocodeLoading] = useState(false);
  const [promocodeData, setPromocodeData] = useState(null);
  const [promocodeInput, setPromocodeInput] = useState('');
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
  
  const [formData, setFormData] = useState({
    type: 'Individual',
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    gender: 'Male',
    paymentMode: 'Online',
    promocode: '',
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

  const validatePromocode = async () => {
    if (!promocodeInput.trim()) {
      setError('Please enter a promocode');
      return;
    }

    setPromocodeLoading(true);
    setError('');

    try {
      const result = await promocodeAPI.validate(promocodeInput.trim());

      if (result.success) {
        setPromocodeData(result.data);
        setFormData(prev => ({ ...prev, promocode: result.data.code }));
        setError('');
      } else {
        setPromocodeData(null);
        setFormData(prev => ({ ...prev, promocode: '' }));
        setError(result.message || 'Invalid promocode');
      }
    } catch (err) {
      console.error('Error validating promocode:', err);
      setPromocodeData(null);
      setFormData(prev => ({ ...prev, promocode: '' }));
      setError(err.message || 'Failed to validate promocode');
    } finally {
      setPromocodeLoading(false);
    }
  };

  const removePromocode = () => {
    setPromocodeData(null);
    setPromocodeInput('');
    setFormData(prev => ({ ...prev, promocode: '' }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) return 'First name is required';
    if (!formData.lastName.trim()) return 'Last name is required';
    if (!formData.mobile.trim()) return 'Mobile number is required';
    if (!/^[0-9]{10}$/.test(formData.mobile)) return 'Invalid mobile number (10 digits required)';
    if (!formData.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email address';
    
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
        // Show success message and reset form
        alert(`✅ Registration successful!\n\nTicket ID: ${response.data.ticketId}\n\nUser will receive confirmation via email and WhatsApp.`);
        
        // Reset form for next registration
        setFormData({
          type: 'Individual',
          firstName: '',
          lastName: '',
          mobile: '',
          email: '',
          gender: 'Male',
          paymentMode: 'Online',
          promocode: '',
          additionalMembers: []
        });
        setPromocodeData(null);
        setPromocodeInput('');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate amount based on promocode or default prices
  const getAmount = () => {
    if (promocodeData) {
      return formData.type === 'Individual' ? promocodeData.individualPrice : promocodeData.couplePrice;
    }
    return formData.type === 'Individual' ? 1149 : 1999;
  };

  const amount = getAmount();
  const originalAmount = formData.type === 'Individual' ? 1149 : 1999;
  const discount = originalAmount - amount;

  // Generate UPI QR Code whenever amount changes
  useEffect(() => {
    const generateUPIQRCode = async () => {
      if (amount > 0) {
        try {
          const upiID = '8866793934@ybl';
          const payeeName = 'BEAT BLAZE 2025';
          const upiURL = `upi://pay?pa=${upiID}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent('Event Registration')}`;
          
          setPaymentUPIURL(upiURL);
          
          const qrCodeDataURL = await QRCode.toDataURL(upiURL, {
            width: 300,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          
          setPaymentQRCode(qrCodeDataURL);
        } catch (err) {
          console.error('❌ Error generating UPI QR code:', err);
        }
      } else {
        setPaymentUPIURL('');
        setPaymentQRCode('');
      }
    };

    generateUPIQRCode();
  }, [amount]);

  return (
    <div className="register-container">
      <div className="register-header">
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
            <Link to="/" className="back-home-btn">
              Back to Home
            </Link>
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
                <p className="type-price">
                  {promocodeData ? (
                    <>
                      {promocodeData.individualPrice === 0 ? (
                        <span className="free-price">FREE</span>
                      ) : (
                        <>
                          <span className="original-price-small">₹1,149</span>
                          <span className="discounted-price">₹{promocodeData.individualPrice}</span>
                        </>
                      )}
                    </>
                  ) : (
                    '₹1,149'
                  )}
                </p>
              </div>
              <div
                className={`type-option ${formData.type === 'Couple' ? 'active' : ''}`}
                onClick={() => handleTypeChange('Couple')}
              >
                <div className="type-info">
                  <h4>Couple</h4>
                  <p className="type-desc">For 2 persons</p>
                </div>
                <p className="type-price">
                  {promocodeData ? (
                    <>
                      {promocodeData.couplePrice === 0 ? (
                        <span className="free-price">FREE</span>
                      ) : (
                        <>
                          <span className="original-price-small">₹1,999</span>
                          <span className="discounted-price">₹{promocodeData.couplePrice}</span>
                        </>
                      )}
                    </>
                  ) : (
                    '₹1,999'
                  )}
                </p>
              </div>
            </div>
            <div className="info-banner" style={{ background: 'rgba(255, 215, 0, 0.1)', borderLeft: '4px solid #ffd700', marginTop: '15px' }}>
              <span className="info-icon">👶</span>
              <span><strong>Child Policy:</strong> Below 5 years - Free entry | Above 5 years - Individual ticket required</span>
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
                </select>
              </div>
              <div className="form-group">
                <label>Payment Mode *</label>
                <select
                  name="paymentMode"
                  value={formData.paymentMode}
                  onChange={handleChange}
                  required
                  disabled={amount === 0}
                >
                  <option value="Online">Online</option>
                </select>
                {amount === 0 && (
                  <p className="payment-free-note">
                    💚 No payment required - Free registration
                  </p>
                )}
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
              <div className="info-banner" style={{ background: 'rgba(255, 215, 0, 0.1)', borderLeft: '4px solid #ffd700', marginTop: '10px' }}>
                <span><strong>Child Policy:</strong> Below 5 years - Free entry | Above 5 years - Individual ticket required</span>
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
          {amount > 0 && (
            <div className="form-section payment-section">
              <h3>💳 Online Payment</h3>
              <div className="payment-qr-container">
                <div className="payment-instructions">
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
          )}

          {/* Promocode Section */}
          <div className="form-section">
            <h3>🎁 Promocode (Optional)</h3>
            {!promocodeData ? (
              <div className="promocode-input-section">
                <div className="form-group">
                  <label>Have a promocode?</label>
                  <div className="promocode-input-wrapper">
                    <input
                      type="text"
                      value={promocodeInput}
                      onChange={(e) => setPromocodeInput(e.target.value.toUpperCase())}
                      placeholder="Enter promocode for discount or free registration"
                      className="promocode-input"
                      disabled={promocodeLoading}
                    />
                    <button
                      type="button"
                      onClick={validatePromocode}
                      className="validate-promocode-btn"
                      disabled={promocodeLoading || !promocodeInput.trim()}
                    >
                      {promocodeLoading ? 'Checking...' : 'Apply'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="promocode-applied">
                <div className="promocode-success">
                  <span className="success-icon">✅</span>
                  <div className="success-details">
                    <strong>Promocode Applied: {promocodeData.code}</strong>
                    <p>Remaining uses: {promocodeData.remaining}</p>
                  </div>
                  <button
                    type="button"
                    onClick={removePromocode}
                    className="remove-promocode-btn"
                  >
                    Remove
                  </button>
                </div>
                
                {amount === 0 ? (
                  /* Free Registration Display */
                  <div className="free-registration-banner">
                    <h3>FREE REGISTRATION</h3>
                    {/* <p>This promocode grants you complimentary access!</p> */}
                    <div className="free-details">
                      <p>For: Special Guests</p>
                      <p>Registration Fee: <strong className="free-amount">FREE (₹0)</strong></p>
                    </div>
                  </div>
                ) : (
                  /* Discounted Price Display */
                  <div className="price-breakdown">
                    <div className="price-row">
                      <span>Original Price:</span>
                      <span className="original-price">₹{originalAmount.toLocaleString()}</span>
                    </div>
                    <div className="price-row discount">
                      <span>Discount:</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                    <div className="price-row final">
                      <span>Final Price:</span>
                      <strong>₹{amount.toLocaleString()}</strong>
                    </div>
                  </div>
                )}
              </div>
            )}
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
              {promocodeData && (
                <div className="summary-item">
                  <span>Promocode:</span>
                  <strong className="promo-code-highlight">{promocodeData.code}</strong>
                </div>
              )}
              <div className="summary-item total">
                <span>Total Amount:</span>
                <strong className={amount === 0 ? 'free-amount' : ''}>
                  {amount === 0 ? 'FREE (₹0)' : `₹${amount.toLocaleString()}`}
                </strong>
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
            * User will receive confirmation email and WhatsApp message with QR code for entry.
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

export default SportsAcademyRegister;
