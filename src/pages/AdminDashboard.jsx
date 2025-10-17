import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, adminAPI } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    paymentMode: '',
    search: ''
  });
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const [statsRes, regsRes] = await Promise.all([
        adminAPI.getStatistics(),
        adminAPI.getRegistrations(filters)
      ]);
      
      setStatistics(statsRes.data);
      setRegistrations(regsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.message.includes('Authentication')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViewDetails = (registration) => {
    setSelectedRegistration(registration);
    setShowModal(true);
  };

  const handleStatusUpdate = async (id, status) => {
    if (!confirm(`Are you sure you want to ${status.toLowerCase()} this registration?`)) {
      return;
    }

    try {
      await adminAPI.updateStatus(id, status);
      alert(`Registration ${status.toLowerCase()} successfully!`);
      fetchData();
      setShowModal(false);
    } catch (error) {
      alert(`Failed to update status: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this registration? This action cannot be undone.')) {
      return;
    }

    try {
      await adminAPI.deleteRegistration(id);
      alert('Registration deleted successfully!');
      fetchData();
      setShowModal(false);
    } catch (error) {
      alert(`Failed to delete registration: ${error.message}`);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await adminAPI.exportRegistrations();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Failed to export: ${error.message}`);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Accepted': return 'status-accepted';
      case 'Rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loader"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-content">
          <h1>🎉 Admin Dashboard</h1>
          <p>DJ Night 2025 - Event Management</p>
        </div>
        <div className="header-actions">
          <button className="export-btn" onClick={handleExport}>📥 Export CSV</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* Statistics Section */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{statistics.totalRegistrations}</h3>
            <p>Total Registrations</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{statistics.totalMembers}</h3>
            <p>Total Attendees</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>₹{statistics.totalAmount.toLocaleString()}</h3>
            <p>Total Collection</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{statistics.status.accepted}</h3>
            <p>Accepted</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{statistics.status.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👦</div>
          <div className="stat-content">
            <h3>{statistics.gender.male}</h3>
            <p>Male</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👩</div>
          <div className="stat-content">
            <h3>{statistics.gender.female}</h3>
            <p>Female</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎟️</div>
          <div className="stat-content">
            <h3>{statistics.attendance.attended}</h3>
            <p>Attended</p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <input
          type="text"
          name="search"
          placeholder="Search by name, email, phone, or ID..."
          value={filters.search}
          onChange={handleFilterChange}
          className="search-input"
        />
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
        <select name="type" value={filters.type} onChange={handleFilterChange}>
          <option value="">All Types</option>
          <option value="Couple">Couple</option>
          <option value="Family">Family</option>
        </select>
        <select name="paymentMode" value={filters.paymentMode} onChange={handleFilterChange}>
          <option value="">All Payments</option>
          <option value="Cash">Cash</option>
          <option value="Online">Online</option>
        </select>
      </div>

      {/* Registrations Table */}
      <div className="table-container">
        <table className="registrations-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Type</th>
              <th>Members</th>
              <th>Payment</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Attended</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg) => (
              <tr key={reg._id}>
                <td className="id-cell">{reg.registrationId}</td>
                <td>{reg.firstName} {reg.lastName}</td>
                <td>{reg.email}</td>
                <td>{reg.mobile}</td>
                <td>{reg.type}</td>
                <td>{reg.totalMembers}</td>
                <td>{reg.paymentMode}</td>
                <td>₹{reg.amount.toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${getStatusBadgeClass(reg.status)}`}>
                    {reg.status}
                  </span>
                </td>
                <td>{reg.attended ? '✅' : '❌'}</td>
                <td>
                  <button className="action-btn view-btn" onClick={() => handleViewDetails(reg)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {registrations.length === 0 && (
          <div className="no-data">
            <p>No registrations found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedRegistration && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Registration Details</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div><strong>ID:</strong> {selectedRegistration.registrationId}</div>
                <div><strong>Name:</strong> {selectedRegistration.firstName} {selectedRegistration.lastName}</div>
                <div><strong>Email:</strong> {selectedRegistration.email}</div>
                <div><strong>Phone:</strong> {selectedRegistration.mobile}</div>
                <div><strong>Gender:</strong> {selectedRegistration.gender}</div>
                <div><strong>Type:</strong> {selectedRegistration.type}</div>
                <div><strong>Payment:</strong> {selectedRegistration.paymentMode}</div>
                <div><strong>Amount:</strong> ₹{selectedRegistration.amount.toLocaleString()}</div>
                <div><strong>Status:</strong> <span className={`status-badge ${getStatusBadgeClass(selectedRegistration.status)}`}>{selectedRegistration.status}</span></div>
                <div><strong>Attended:</strong> {selectedRegistration.attended ? 'Yes' : 'No'}</div>
              </div>
              
              {selectedRegistration.additionalMembers.length > 0 && (
                <div className="members-section">
                  <h3>Additional Members</h3>
                  {selectedRegistration.additionalMembers.map((member, index) => (
                    <div key={index} className="member-row">
                      {index + 1}. {member.firstName} {member.lastName} ({member.gender})
                    </div>
                  ))}
                </div>
              )}

              {selectedRegistration.qrCode && (
                <div className="qr-section">
                  <h3>QR Code</h3>
                  <img src={selectedRegistration.qrCode} alt="QR Code" />
                </div>
              )}
            </div>
            <div className="modal-actions">
              {selectedRegistration.status === 'Pending' && (
                <>
                  <button className="accept-btn" onClick={() => handleStatusUpdate(selectedRegistration._id, 'Accepted')}>
                    ✅ Accept
                  </button>
                  <button className="reject-btn" onClick={() => handleStatusUpdate(selectedRegistration._id, 'Rejected')}>
                    ❌ Reject
                  </button>
                </>
              )}
              <button className="delete-btn" onClick={() => handleDelete(selectedRegistration._id)}>
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
