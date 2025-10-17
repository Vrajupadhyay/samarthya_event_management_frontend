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

      {/* Event Details Section */}
      <section className="details-section">
        <div className="container">
          <h2 className="section-title">Event Details</h2>
          <div className="details-grid">
            <div className="detail-card">
              <div className="detail-icon">📅</div>
              <h3>Date & Time</h3>
              <p>31st December 2025</p>
              <p className="detail-highlight">7:30 PM onwards</p>
            </div>
            <div className="detail-card">
              <div className="detail-icon">📍</div>
              <h3>Venue</h3>
              <p>XYZ Club</p>
              <p className="detail-highlight">City</p>
            </div>
            <div className="detail-card">
              <div className="detail-icon">🎉</div>
              <h3>Organized By</h3>
              <p>XYZ Event Management</p>
              <p className="detail-highlight">Premium Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="facilities-section">
        <div className="container">
          <h2 className="section-title">What's Included</h2>
          <div className="facilities-grid">
            <div className="facility-card">
              <div className="facility-icon">🎵</div>
              <h3>DJ Party</h3>
              <p>Live DJ spinning the best tracks all night long</p>
            </div>
            <div className="facility-card">
              <div className="facility-icon">🍔</div>
              <h3>Dinner & Food</h3>
              <p>Delicious dinner buffet with multiple cuisines</p>
            </div>
            <div className="facility-card">
              <div className="facility-icon">🎯</div>
              <h3>Fun & Games</h3>
              <p>Exciting games and activities throughout the night</p>
            </div>
            <div className="facility-card">
              <div className="facility-icon">🎆</div>
              <h3>Fireworks</h3>
              <p>Spectacular fireworks display at midnight</p>
            </div>
            <div className="facility-card">
              <div className="facility-icon">📸</div>
              <h3>Photo Booth</h3>
              <p>Capture memories at our themed photo booth</p>
            </div>
            <div className="facility-card">
              <div className="facility-icon">🎁</div>
              <h3>Prizes & Giveaways</h3>
              <p>Win exciting prizes throughout the event</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <div className="container">
          <h2 className="section-title">Ticket Pricing</h2>
          <div className="pricing-grid">
            <div className="price-card">
              <div className="price-badge">Popular</div>
              <div className="price-icon">💑</div>
              <h3>Couple Pass</h3>
              <div className="price">
                <span className="currency">₹</span>
                <span className="amount">2,000</span>
              </div>
              <p className="price-description">Perfect for couples</p>
              <ul className="price-features">
                <li>✓ Entry for 2 persons</li>
                <li>✓ Dinner included</li>
                <li>✓ Unlimited beverages</li>
                <li>✓ Access to all facilities</li>
              </ul>
            </div>
            <div className="price-card featured">
              <div className="price-badge">Best Value</div>
              <div className="price-icon">👨‍👩‍👧‍👦</div>
              <h3>Family Pass</h3>
              <div className="price">
                <span className="currency">₹</span>
                <span className="amount">4,000</span>
              </div>
              <p className="price-description">Bring your whole family</p>
              <ul className="price-features">
                <li>✓ Entry for multiple persons</li>
                <li>✓ Dinner included for all</li>
                <li>✓ Unlimited beverages</li>
                <li>✓ Access to all facilities</li>
                <li>✓ Special family zone</li>
              </ul>
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
              <h4>Event Details</h4>
              <p>31st December DJ Night 2025</p>
              <p>XYZ Club, City</p>
              <p>7:30 PM onwards</p>
            </div>
            <div className="footer-section">
              <h4>Contact Us</h4>
              <p>Email: info@djnight2025.com</p>
              <p>Phone: +91 9999999999</p>
            </div>
            <div className="footer-section">
              <h4>Sponsored By</h4>
              <p>ABC Group</p>
              <p>RedBull</p>
              <p>XYZ Beverages</p>
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
