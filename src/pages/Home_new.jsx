import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Calculate countdown to December 31, 2025
    const calculateTimeLeft = () => {
      const eventDate = new Date('2025-12-31T19:30:00').getTime();
      const now = new Date().getTime();
      const difference = eventDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const scrollToRegister = () => {
    document.getElementById('register-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">✨ NEW YEAR 2026 SPECIAL ✨</div>
          <h1 className="hero-title">
            31st December DJ Night
            <span className="hero-subtitle">with Dinner 🍽️</span>
          </h1>
          <p className="hero-tagline">
            Celebrate the New Year in Style!
          </p>
          
          {/* Countdown Timer */}
          <div className="countdown-timer">
            <div className="countdown-item">
              <span className="countdown-value">{timeLeft.days}</span>
              <span className="countdown-label">Days</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-value">{timeLeft.hours}</span>
              <span className="countdown-label">Hours</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-value">{timeLeft.minutes}</span>
              <span className="countdown-label">Minutes</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-value">{timeLeft.seconds}</span>
              <span className="countdown-label">Seconds</span>
            </div>
          </div>

          <button className="cta-button" onClick={scrollToRegister}>
            👉 Register Now
          </button>
        </div>
      </section>

      {/* Organized By Section - New Position */}
      <section className="organizers-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Organized By</h2>
            <p className="section-subtitle">Proudly presented by premier organizations</p>
          </div>
          <div className="organizers-grid-modern">
            <div className="organizer-card-modern">
              <div className="organizer-logo-wrapper">
                <img 
                  src="https://7sportsacademy.com/wp-content/uploads/2025/04/7-S-Logo1-1.webp" 
                  alt="7 Sports Academy" 
                  className="organizer-logo-img"
                />
              </div>
              <h3>7 Sports Academy</h3>
              <p>Leading sports and fitness excellence center</p>
              <div className="organizer-badge">Co-Organizer</div>
            </div>
            <div className="organizer-card-modern">
              <div className="organizer-logo-wrapper">
                <img 
                  src="https://samarthyaevents.com/assets/logo-ZtLsZ4rm.jpeg" 
                  alt="Samarthya Events" 
                  className="organizer-logo-img"
                />
              </div>
              <h3>Samarthya Events</h3>
              <p>Premier event management and entertainment</p>
              <div className="organizer-badge">Co-Organizer</div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Details Section - Grid View */}
      <section className="details-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Event Details</h2>
            <p className="section-subtitle">Everything you need to know about the biggest party of the year</p>
          </div>
          <div className="details-grid-modern">
            <div className="detail-card-modern">
              <div className="detail-icon-large">📅</div>
              <h3>Date & Time</h3>
              <p>31st December 2025</p>
              <p className="detail-highlight">7:30 PM onwards</p>
            </div>
            <div className="detail-card-modern">
              <div className="detail-icon-large">📍</div>
              <h3>Venue</h3>
              <p>Premium Event Venue</p>
              <p className="detail-highlight">Vadodara, Gujarat</p>
            </div>
            <div className="detail-card-modern">
              <div className="detail-icon-large">👔</div>
              <h3>Dress Code</h3>
              <p>Smart Casual</p>
              <p className="detail-highlight">Party Ready</p>
            </div>
            <div className="detail-card-modern">
              <div className="detail-icon-large">🎫</div>
              <h3>Entry</h3>
              <p>QR Code Based</p>
              <p className="detail-highlight">E-Ticket Required</p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section - Grid View */}
      <section className="facilities-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What's Included</h2>
            <p className="section-subtitle">Unforgettable experiences waiting for you</p>
          </div>
          <div className="facilities-grid-modern">
            <div className="facility-card-modern">
              <div className="facility-icon-large">🎵</div>
              <h3>DJ Party</h3>
              <p>Live DJ spinning the best tracks all night long</p>
            </div>
            <div className="facility-card-modern">
              <div className="facility-icon-large">🍔</div>
              <h3>Dinner & Food</h3>
              <p>Delicious dinner buffet with multiple cuisines</p>
            </div>
            <div className="facility-card-modern">
              <div className="facility-icon-large">🎯</div>
              <h3>Fun & Games</h3>
              <p>Exciting games and activities throughout the night</p>
            </div>
            <div className="facility-card-modern">
              <div className="facility-icon-large">🎆</div>
              <h3>Fireworks</h3>
              <p>Spectacular fireworks display at midnight</p>
            </div>
            <div className="facility-card-modern">
              <div className="facility-icon-large">📸</div>
              <h3>Photo Booth</h3>
              <p>Capture memories at our themed photo booth</p>
            </div>
            <div className="facility-card-modern">
              <div className="facility-icon-large">🎁</div>
              <h3>Prizes & Giveaways</h3>
              <p>Win exciting prizes throughout the event</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Modern Grid */}
      <section className="pricing-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Ticket Pricing</h2>
            <p className="section-subtitle">Choose the perfect pass for your celebration</p>
          </div>
          <div className="pricing-grid-modern">
            <div className="price-card-modern">
              <div className="price-ribbon">Popular</div>
              <div className="price-icon-wrapper">
                <div className="price-icon">💑</div>
              </div>
              <h3 className="price-title">Couple Pass</h3>
              <p className="price-description">Perfect for couples looking to celebrate together</p>
              
              <div className="price-amount-wrapper">
                <span className="price-currency">₹</span>
                <span className="price-amount">2,000</span>
              </div>
              <p className="price-per-person">₹1,000 per person</p>
              
              <div className="price-divider"></div>
              
              <ul className="price-features-list">
                <li><span className="check-icon">✓</span> Entry for 2 persons</li>
                <li><span className="check-icon">✓</span> Unlimited dinner buffet</li>
                <li><span className="check-icon">✓</span> Welcome drinks included</li>
                <li><span className="check-icon">✓</span> Access to all facilities</li>
                <li><span className="check-icon">✓</span> DJ & live entertainment</li>
                <li><span className="check-icon">✓</span> Photo booth access</li>
              </ul>
            </div>

            <div className="price-card-modern featured">
              <div className="price-ribbon best">Best Value</div>
              <div className="price-icon-wrapper">
                <div className="price-icon">👨‍👩‍👧‍👦</div>
              </div>
              <h3 className="price-title">Family Pass</h3>
              <p className="price-description">Bring your whole family for an unforgettable night</p>
              
              <div className="price-amount-wrapper">
                <span className="price-currency">₹</span>
                <span className="price-amount">4,000</span>
              </div>
              <p className="price-per-person">Flexible members</p>
              
              <div className="price-divider"></div>
              
              <ul className="price-features-list">
                <li><span className="check-icon">✓</span> Entry for multiple persons</li>
                <li><span className="check-icon">✓</span> Unlimited dinner for all</li>
                <li><span className="check-icon">✓</span> Welcome drinks for adults</li>
                <li><span className="check-icon">✓</span> Access to all facilities</li>
                <li><span className="check-icon">✓</span> DJ & live entertainment</li>
                <li><span className="check-icon">✓</span> Photo booth access</li>
                <li><span className="check-icon highlighted">✓</span> Special family zone</li>
                <li><span className="check-icon highlighted">✓</span> Kids activity area</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Terms & Conditions Section */}
      <section className="terms-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Terms & Conditions</h2>
            <p className="section-subtitle">Please read carefully before registering</p>
          </div>
          <div className="terms-content">
            <div className="terms-card">
              <div className="terms-icon">📋</div>
              <h3>Registration</h3>
              <ul>
                <li>All registrations are subject to availability</li>
                <li>Registration confirmation will be sent via email with QR code</li>
                <li>One QR code per registration (Couple/Family)</li>
                <li>QR code is mandatory for entry - digital or printed</li>
              </ul>
            </div>

            <div className="terms-card">
              <div className="terms-icon">💳</div>
              <h3>Payment</h3>
              <ul>
                <li>Payment can be made via Cash or Online mode</li>
                <li>Full payment required to confirm registration</li>
                <li>Payment receipts will be provided upon request</li>
                <li>Prices are inclusive of all taxes</li>
              </ul>
            </div>

            <div className="terms-card">
              <div className="terms-icon">🚫</div>
              <h3>Cancellation & Refund</h3>
              <ul>
                <li>Registration once confirmed is non-refundable</li>
                <li>No cancellations accepted after payment</li>
                <li>Tickets are non-transferable</li>
                <li>Organizers reserve the right to cancel the event due to unforeseen circumstances</li>
              </ul>
            </div>

            <div className="terms-card">
              <div className="terms-icon">⚠️</div>
              <h3>Event Rules</h3>
              <ul>
                <li>Entry only with valid QR code and ID proof</li>
                <li>Dress code: Smart Casual - No shorts/slippers</li>
                <li>Outside food and beverages strictly prohibited</li>
                <li>Smoking only in designated areas</li>
                <li>Management reserves the right to deny entry</li>
              </ul>
            </div>

            <div className="terms-card">
              <div className="terms-icon">📸</div>
              <h3>Photography & Videography</h3>
              <ul>
                <li>Event photography/videography will be done by organizers</li>
                <li>Photos may be used for promotional purposes</li>
                <li>Personal cameras allowed for personal use only</li>
                <li>Professional equipment requires prior permission</li>
              </ul>
            </div>

            <div className="terms-card">
              <div className="terms-icon">🔐</div>
              <h3>Safety & Security</h3>
              <ul>
                <li>Security check mandatory at entry</li>
                <li>Dangerous items/weapons strictly prohibited</li>
                <li>Organizers not responsible for lost belongings</li>
                <li>Medical assistance available on-site</li>
                <li>Any misconduct may result in immediate expulsion</li>
              </ul>
            </div>
          </div>

          <div className="terms-footer">
            <p><strong>Important:</strong> By registering for this event, you agree to abide by all the terms and conditions mentioned above. The organizers reserve the right to make changes to the terms and conditions without prior notice.</p>
          </div>
        </div>
      </section>

      {/* Registration CTA Section */}
      <section className="register-section" id="register-section">
        <div className="container">
          <div className="register-cta">
            <h2>Ready to Join the Party?</h2>
            <p>Register now and secure your spot for the biggest New Year celebration!</p>
            <Link to="/register" className="register-button">
              🎫 Register Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Event Information</h4>
              <p>31st December DJ Night 2025</p>
              <p>Premium Event Venue</p>
              <p>Vadodara, Gujarat</p>
              <p>7:30 PM onwards</p>
            </div>
            <div className="footer-section">
              <h4>Contact Us</h4>
              <p>Email: event@ieeebvm.in</p>
              <p>Phone: +91 98765 43210</p>
              <p>Phone: +91 98765 43211</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <p><Link to="/register" style={{color: '#ffd700', textDecoration: 'none'}}>Register Now</Link></p>
              <p><Link to="/scanner" style={{color: '#ffd700', textDecoration: 'none'}}>Scan QR Code</Link></p>
              <p><Link to="/login" style={{color: '#ffd700', textDecoration: 'none'}}>Admin Login</Link></p>
            </div>
            <div className="footer-section">
              <h4>Organized By</h4>
              <p>7 Sports Academy</p>
              <p>Samarthya Events</p>
              <p style={{marginTop: '1rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)'}}>In association with event partners</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 DJ Night Event. All rights reserved.</p>
            <div className="footer-links">
              <Link to="/login">Staff/Admin Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
