import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('Please enter username and password');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.login(formData.username, formData.password);
      
      if (response.success) {
        const { role } = response.data;
        
        // Redirect based on role
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'staff') {
          navigate('/scanner');
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🎫 Staff/Admin Login</h1>
          <p>BEAT BLAZE 2025 - Event Management</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="login-info">
          <p>🔐 This area is restricted to authorized personnel only.</p>
          <div className="role-info">
            <div className="role-card">
              <h4>Admin Access</h4>
              <p>Full dashboard access, registration management, analytics</p>
            </div>
            <div className="role-card">
              <h4>Staff Access</h4>
              <p>QR scanner for entry verification</p>
            </div>
          </div>
        </div>

        <div className="login-footer">
          <Link to="/" className="back-link">← Back to Homepage</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
