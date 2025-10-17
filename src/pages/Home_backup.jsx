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
          <div className="section-header">
            <h2 className="section-title">Event Details</h2>
            <p className="section-subtitle">Everything you need to know about the biggest party of the year</p>
          </div>
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
              <div className="detail-icon">�</div>
              <h3>Dress Code</h3>
              <p>Smart Casual</p>
              <p className="detail-highlight">Party Ready</p>
            </div>
          </div>
        </div>
      </section>

      {/* Organized By Section */}
      <section className="organizers-section">
        <div className="container">
          <h2 className="section-title">Organized By</h2>
          <div className="organizers-grid">
            <div className="organizer-card">
              <div className="organizer-logo">
                <center>
                  <img src="https://7sportsacademy.com/wp-content/uploads/2025/04/7-S-Logo1-1.webp" alt="7 Sports Academy Logo" width={150}/>
                </center>
              </div>
              <h3>7 Sports Academy</h3>
              {/* <p>Leading technical organization fostering innovation and excellence</p> */}
            </div>
            <div className="organizer-card">
              <div className="organizer-logo">
                <center>
                  <img src="https://samarthyaevents.com/assets/logo-ZtLsZ4rm.jpeg" alt="Samarthya Events Logo" width={150}/>
                </center>
              </div>
              <h3>Samarthya Events</h3>
              {/* <p>Premier institution nurturing future engineers and leaders</p> */}
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
          <div className="section-header">
            <h2 className="section-title">Ticket Pricing</h2>
            <p className="section-subtitle">Choose the perfect pass for your celebration</p>
          </div>
          <div className="pricing-grid">
            <div className="price-card">
              <div className="price-header">
                <div className="price-badge popular">Popular Choice</div>
                {/* <div className="price-icon">💑</div> */}
                <h3>Couple Pass</h3>
                <p className="price-description">Perfect for couples looking to celebrate together</p>
              </div>
              <div className="price-amount">
                <span className="currency">₹</span>
                <span className="amount">2,000</span>
                <span className="per-person">₹1,000 per person</span>
              </div>
              <div className="price-features">
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Entry for 2 persons</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Unlimited dinner buffet</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Welcome drinks included</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Access to all facilities</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>DJ & live entertainment</span>
                </div>
              </div>
            </div>
            <div className="price-card featured">
              <div className="price-header">
                <div className="price-badge best-value">Best Value</div>
                {/* <div className="price-icon">👨‍👩‍👧‍👦</div> */}
                <h3>Family Pass</h3>
                <p className="price-description">Bring your whole family for an unforgettable night</p>
              </div>
              <div className="price-amount">
                <span className="currency">₹</span>
                <span className="amount">4,000</span>
                <span className="per-person">Flexible members</span>
              </div>
              <div className="price-features">
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Entry for multiple persons</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Unlimited dinner for all</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Welcome drinks for adults</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Access to all facilities</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>DJ & live entertainment</span>
                </div>
                <div className="feature-item highlight">
                  <span className="feature-icon">✓</span>
                  <span>Special family zone</span>
                </div>
                <div className="feature-item highlight">
                  <span className="feature-icon">✓</span>
                  <span>Kids activity area</span>
                </div>
              </div>
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
