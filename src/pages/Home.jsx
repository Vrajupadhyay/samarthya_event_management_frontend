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
      {/* Decorative Background Elements */}
      <div className="bg-decoration">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-stars"></div>
        <div className="hero-content">
          <div className="hero-badge">✨ NEW YEAR 2026 SPECIAL ✨</div>
          
          {/* Event Logo */}
          <center>
            <div className="hero-logo-wrapper">
              <img 
                src="/logo.png" 
                alt="Event Logo" 
                className="hero-logo"
              />
            </div>
          </center>
          
          <h1 className="hero-title">
            <span className="hero-subtitle">31st December DJ Party</span>
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
            {/* <p className="section-subtitle">Proudly presented by premier organizations</p> */}
          </div>
          <div className="organizers-grid-modern">
            <div className="organizer-card-modern">
              <div className="organizer-logo-wrapper">
                <img 
                  src="/sm.jpg" 
                  alt="Samarthya Events" 
                  className="organizer-logo-img"
                />
              </div>
              <h3>Samarthya Events</h3>
              {/* <p>Premier event management and entertainment</p> */}
              <div className="organizer-badge">Organizer</div>
              <br />
              <a 
                href="https://samarthyaevents.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="organizer-website-btn"
              >
                🌐 Visit Website
              </a>
            </div>
            <div className="organizer-card-modern">
              <div className="organizer-logo-wrapper">
                <img 
                  src="/7 sport logo-1.png" 
                  alt="7 Sports Academy" 
                  className="organizer-logo-img"
                />
              </div>
              <h3>7 Sports Academy</h3>
              {/* <p>Leading sports and fitness excellence center</p> */}
              <div className="organizer-badge">Organizer</div>
              <br />
              <a 
                href="https://7sportsacademy.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="organizer-website-btn"
              >
                🌐 Visit Website
              </a>
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
              <p className="detail-highlight">6:45 PM onwards</p>
            </div>
            <div className="detail-card-modern">
              <div className="detail-icon-large">📍</div>
              <h3>Venue</h3>
              <p>Premium Event Venue</p>
              <p className="detail-highlight">7 Sports Academy, Rampura, Bakrol, Anand, Gujarat</p>
            </div>
            {/* <div className="detail-card-modern">
              <div className="detail-icon-large">👔</div>
              <h3>Dress Code</h3>
              <p>Smart Casual</p>
              <p className="detail-highlight">Party Ready</p>
            </div> */}
            {/* <div className="detail-card-modern">
              <div className="detail-icon-large">🎫</div>
              <h3>Entry</h3>
              <p>QR Code Based</p>
              <p className="detail-highlight">E-Ticket Required</p>
            </div> */}
          </div>
        </div>
      </section>

      {/* Venue Location Section - Google Maps */}
      <section className="location-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">📍 Event Location</h2>
            <p className="section-subtitle">7 Sports Academy, Rampura, Bakrol, Anand, Gujarat</p>
          </div>
          <div className="map-container">
            <iframe 
              src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=7%20Sports%20Academy%20Anand+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
              width="100%" 
              height="450" 
              style={{ border: 0, borderRadius: '15px' }}
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="7 Sports Academy Location"
            ></iframe>
            <div className="map-overlay-info">
              <a 
                href="https://maps.app.goo.gl/69mpjuJxerroVxTN7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="get-directions-btn"
              >
                🧭 Get Directions
              </a>
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
              <div className="facility-icon-large">🍽️</div>
              <h3>Dinner</h3>
              <p>Delicious dinner buffet with multiple cuisines</p>
            </div>
            <div className="facility-card-modern">
              <div className="facility-icon-large">🚗</div>
              <h3>Valet Parking</h3>
              <p>Convenient valet parking service for all guests</p>
            </div>
            {/* <div className="facility-card-modern">
              <div className="facility-icon-large">🎆</div>
              <h3>Fireworks</h3>
              <p>Spectacular fireworks display at midnight</p>
            </div> */}
            <div className="facility-card-modern">
              <div className="facility-icon-large">📸</div>
              <h3>Photo Booth</h3>
              <p>Capture memories at our themed photo booth</p>
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
          <div className="pricing-grid-modern three-cards">
            {/* Individual Pass */}
            <div className="price-card-modern">
              <div className="price-icon-wrapper">
                {/* <div className="price-icon">🎫</div> */}
              </div>
              <h3 className="price-title">Individual</h3>
              <div className="price-amount-wrapper">
                <span className="price-currency">₹</span>
                <span className="price-amount">1,149</span>
              </div>
              <p className="price-per-person">Solo Entry</p>
            </div>

            {/* Couple Pass */}
            <div className="price-card-modern popular">
              <div className="price-ribbon">Popular</div>
              <div className="price-icon-wrapper">
                {/* <div className="price-icon">💑</div> */}
              </div>
              <h3 className="price-title">Couple</h3>
              <div className="price-amount-wrapper">
                <span className="price-currency">₹</span>
                <span className="price-amount">1,999</span>
              </div>
              <p className="price-per-person">For 2 person</p>
              <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '8px', fontSize: '13px', lineHeight: '1.6' }}>
                <p style={{ margin: 0, color: '#ffd700', fontWeight: '600' }}>Child Policy:</p>
                <p style={{ margin: '5px 0 0 0', color: '#b2bec3' }}>• Below 5 years: Free entry</p>
                <p style={{ margin: '5px 0 0 0', color: '#b2bec3' }}>• Above 5 years: Individual ticket required</p>
              </div>
            </div>
          </div>

          {/* Benefits Section - Shown Once Below All Tickets */}
          <div className="benefits-section-unified">
            <h3 className="benefits-title">What's Included in All Tickets</h3>
            <ul className="benefits-list-unified">
              <li><span className="check-icon">✓</span> Entry for specified person(s)</li>
              <li><span className="check-icon">✓</span> Unlimited dinner buffet</li>
              {/* <li><span className="check-icon">✓</span> Welcome drinks</li> */}
              <li><span className="check-icon">✓</span> DJ & live entertainment</li>
              <li><span className="check-icon">✓</span> Photo booth</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Terms & Conditions Section - Modern Redesign */}
      <section className="terms-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Terms & Conditions</h2>
            <p className="section-subtitle">Important guidelines for all attendees</p>
          </div>
          
          {/* Important Notice Banner */}
          <div className="terms-notice-banner">
            {/* <div className="notice-icon">⚠️</div> */}
            <div className="notice-content">
              <h3>Please Read Carefully</h3>
              <p>By registering, you agree to abide by all terms and conditions listed below</p>
            </div>
          </div>

          {/* Terms Grid - Categorized */}
          <div className="terms-modern-grid">
            {/* Registration & Entry */}
            <div className="term-category-card">
              <div className="term-category-header">
                <span className="term-icon">🎫</span>
                <h3>Registration & Entry</h3>
              </div>
              <ul className="term-list">
                <li>Registration confirmation will be sent via email with QR code</li>
                <li>QR code is mandatory for entry (digital or printed)</li>
                <li>Entry only with valid QR code and ID proof</li>
                <li>Tickets are non-transferable</li>
              </ul>
            </div>

            {/* Payment & Refunds */}
            <div className="term-category-card">
              <div className="term-category-header">
                <span className="term-icon">💳</span>
                <h3>Payment & Refunds</h3>
              </div>
              <ul className="term-list">
                <li>Full payment required to confirm registration</li>
                <li>Registration once confirmed is non-refundable</li>
                <li>No cancellations or refunds under any circumstances</li>
              </ul>
            </div>

            {/* Event Rules */}
            <div className="term-category-card">
              <div className="term-category-header">
                <span className="term-icon">📜</span>
                <h3>Event Rules</h3>
              </div>
              <ul className="term-list">
                <li>Alcohol is strictly prohibited at the event</li>
                <li>Outside food and beverages strictly prohibited</li>
                <li>Security check mandatory at entry</li>
                <li>Management reserves the right to deny entry</li>
              </ul>
            </div>

            {/* Liability & Privacy */}
            <div className="term-category-card">
              <div className="term-category-header">
                <span className="term-icon">🛡️</span>
                <h3>Liability & Privacy</h3>
              </div>
              <ul className="term-list">
                <li>Organizers not responsible for lost belongings</li>
                <li>Event photos may be used for promotional purposes</li>
                <li>Organizers reserve the right to remove any attendee for misconduct without refund</li>
              </ul>
            </div>
          </div>

          {/* Agreement Footer */}
          <div className="terms-agreement-footer">
            <div className="agreement-box">
              <span className="agreement-icon">✓</span>
              <p>By clicking "Register Now", you acknowledge that you have read, understood, and agree to be bound by these terms and conditions. The organizers reserve the right to make changes without prior notice.</p>
            </div>
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
              <p>31st December BEAT BLAZE 2025</p>
              {/* <p>Premium Event Venue</p> */}
              <p>7 Sports Academy, Rampura, Bakrol, Anand, Gujarat</p>
              <p>6:45 PM onwards</p>
            </div>
            <div className="footer-section">
              <h4>Contact Us</h4>
              <p>Email: samarthyaevents07@gmail.com</p>
              <p>Phone: +91 9173864156</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <p><Link to="/register" style={{color: '#ffd700', textDecoration: 'none'}}>Register Now</Link></p>
              {/* <p><Link to="/verify" style={{color: '#ffd700', textDecoration: 'none'}}>Retrieve Your Pass</Link></p>
              <p><Link to="/scanner" style={{color: '#ffd700', textDecoration: 'none'}}>Scan QR Code</Link></p> */}
              <p><Link to="/login" style={{color: '#ffd700', textDecoration: 'none'}}>Admin Login</Link></p>
            </div>
            <div className="footer-section">
              <h4>Organized By</h4>
              <p>7 Sports Academy</p>
              <p>Samarthya Events</p>
            </div>
          </div>
        </div>
      </footer>

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
          <p className="copyright-text">&copy; 2025 BEAT BLAZE Event. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
