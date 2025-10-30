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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [showWhatsAppDropdown, setShowWhatsAppDropdown] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, [filters]);

  // Close WhatsApp dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showWhatsAppDropdown && !event.target.closest('.whatsapp-dropdown-wrapper')) {
        setShowWhatsAppDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showWhatsAppDropdown]);

  const fetchData = async () => {
    try {
      const [statsRes, regsRes] = await Promise.all([
        adminAPI.getStatistics(),
        adminAPI.getRegistrations(filters)
      ]);
      
      setStatistics(statsRes.data);
      setRegistrations(regsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert(error.message);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleViewDetails = (registration) => {
    setSelectedRegistration(registration);
    setActiveTab('details');
    setShowModal(true);
  };

  const handleEdit = (registration) => {
    setEditData({
      ...registration,
      additionalMembers: registration.additionalMembers || []
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Updating registration:', editData._id, editData);
      const response = await adminAPI.updateRegistration(editData._id, editData);
      console.log('Update response:', response);
      alert('Registration updated successfully!');
      setShowEditModal(false);
      fetchData();
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update: ' + error.message);
    }
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddMember = () => {
    setEditData({
      ...editData,
      additionalMembers: [
        ...editData.additionalMembers,
        { firstName: '', lastName: '', gender: 'Male' }
      ]
    });
  };

  const handleRemoveMember = (index) => {
    const newMembers = editData.additionalMembers.filter((_, i) => i !== index);
    setEditData({
      ...editData,
      additionalMembers: newMembers
    });
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...editData.additionalMembers];
    newMembers[index][field] = value;
    setEditData({
      ...editData,
      additionalMembers: newMembers
    });
  };

  const handleStatusUpdate = async (status) => {
    if (!selectedRegistration) return;
    
    setStatusUpdating(true);
    try {
      const response = await adminAPI.updateStatus(selectedRegistration._id, status, '');
      
      // Show success message with email status
      const emailStatus = response.emailSent ? '📧 Email sent successfully!' : '⚠️ Email sending failed';
      alert(`✅ Registration ${status.toLowerCase()} successfully!\n\n${emailStatus}`);
      
      setShowModal(false);
      fetchData();
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRegistration) return;
    
    if (window.confirm('Are you sure you want to delete this registration?')) {
      try {
        await adminAPI.deleteRegistration(selectedRegistration._id);
        alert('Registration deleted successfully!');
        setShowModal(false);
        fetchData();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleExport = async () => {
    try {
      const blob = await adminAPI.exportRegistrations();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `registrations-${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(error.message);
    }
  };

  // WhatsApp messaging helper functions
  const generateWhatsAppMessage = (registration, template) => {
    const { firstName, lastName, assignedTicketId, ticketId, type, amount, status } = registration;
    const fullName = `${firstName || ''} ${lastName || ''}`.trim() || 'Guest';
    const ticketDisplay = assignedTicketId || ticketId || 'N/A';
    const amountDisplay = amount || 'N/A';
    const typeDisplay = type || 'N/A';
    const statusDisplay = status || 'Pending';
    
    switch(template) {
      case 'confirmation':
        return `*Registration Confirmation*\n\nHello ${fullName}!\n\nYour registration has been received:\n\nType: ${typeDisplay}\nTicket ID: ${ticketDisplay}\nAmount: Rs.${amountDisplay}\nStatus: ${statusDisplay}\n\nThank you for registering!`;
      
      case 'approved':
        return `*Registration Approved*\n\nHello ${fullName}!\n\nGreat news! Your registration has been approved.\n\nTicket ID: ${ticketDisplay}\nAmount: Rs.${amountDisplay}\n\nWe look forward to seeing you at the event!`;
      
      case 'reminder':
        return `*Event Reminder*\n\nHello ${fullName}!\n\nThis is a reminder about your upcoming event:\n\nYour Ticket ID: ${ticketDisplay}\nType: ${typeDisplay}\n\nPlease bring your ticket to the venue. See you soon!`;
      
      case 'custom':
        return `Hello ${fullName}!\n\nTicket ID: ${ticketDisplay}\n\n`;
      
      default:
        return `Hello ${fullName}!\n\nTicket ID: ${ticketDisplay}`;
    }
  };

  const handleSendWhatsAppTemplate = (registration, template) => {
    // Check if mobile number exists
    if (!registration.mobile) {
      alert('No phone number available for this registration');
      return;
    }

    const message = generateWhatsAppMessage(registration, template);
    // Format phone number for WhatsApp (add country code if needed)
    let phoneNumber = registration.mobile.replace(/\D/g, '');
    
    // Add India country code if not present
    if (!phoneNumber.startsWith('91') && phoneNumber.length === 10) {
      phoneNumber = '91' + phoneNumber;
    }
    
    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>🎉 Admin Dashboard</h1>
          <div className="header-actions">
            <button onClick={handleExport} className="btn-secondary">
              📊 Export CSV
            </button>
            <button onClick={handleLogout} className="btn-danger">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>Total Registrations</h3>
            <p className="stat-value">{statistics.totalRegistrations}</p>
          </div>
        </div>

        <div className="stat-card stat-members">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Members</h3>
            <p className="stat-value">{statistics.totalMembers}</p>
          </div>
        </div>

        <div className="stat-card stat-amount">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Amount</h3>
            <p className="stat-value">₹{statistics.totalAmount}</p>
          </div>
        </div>

        <div className="stat-card stat-accepted">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Accepted</h3>
            <p className="stat-value">{statistics.status.accepted}</p>
          </div>
        </div>

        <div className="stat-card stat-pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending</h3>
            <p className="stat-value">{statistics.status.pending}</p>
          </div>
        </div>

        <div className="stat-card stat-attended">
          <div className="stat-icon">🎟️</div>
          <div className="stat-content">
            <h3>Attended</h3>
            <p className="stat-value">{statistics.attendance.attended}</p>
          </div>
        </div>

        <div className="stat-card stat-male">
          <div className="stat-icon">👨</div>
          <div className="stat-content">
            <h3>Male</h3>
            <p className="stat-value">{statistics.gender.male}</p>
          </div>
        </div>

        <div className="stat-card stat-female">
          <div className="stat-icon">👩</div>
          <div className="stat-content">
            <h3>Female</h3>
            <p className="stat-value">{statistics.gender.female}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-container">
          <input
            type="text"
            name="search"
            placeholder="🔍 Search by name, email, ID..."
            value={filters.search}
            onChange={handleFilterChange}
            className="filter-input"
          />
          
          <select name="status" value={filters.status} onChange={handleFilterChange} className="filter-select">
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
          
          <select name="type" value={filters.type} onChange={handleFilterChange} className="filter-select">
            <option value="">All Types</option>
            <option value="Couple">Couple</option>
            <option value="Family">Family</option>
          </select>
          
          <select name="paymentMode" value={filters.paymentMode} onChange={handleFilterChange} className="filter-select">
            <option value="">All Payments</option>
            <option value="Cash">Cash</option>
            <option value="Online">Online</option>
          </select>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="table-section">
        <div className="table-header">
          <h2>📋 Registrations ({registrations.length})</h2>
        </div>
        
        <div className="table-container">
          <table className="registrations-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
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
                  <td><span className="table-id">{reg.assignedTicketId || reg.ticketId}</span></td>
                  <td>{reg.firstName} {reg.lastName}</td>
                  <td>{reg.email}</td>
                  <td>{reg.mobile}</td>
                  <td><span className={`badge badge-type-${reg.type.toLowerCase()}`}>{reg.type}</span></td>
                  <td>{reg.totalMembers}</td>
                  <td><span className={`badge badge-payment-${reg.paymentMode.toLowerCase()}`}>{reg.paymentMode}</span></td>
                  <td>₹{reg.amount}</td>
                  <td><span className={`badge badge-status-${reg.status.toLowerCase()}`}>{reg.status}</span></td>
                  <td>{reg.attended ? '✅' : '❌'}</td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleViewDetails(reg)} className="btn-action btn-view" title="View Details">
                        👁️
                      </button>
                      <button onClick={() => handleEdit(reg)} className="btn-action btn-edit" title="Edit">
                        ✏️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {showModal && selectedRegistration && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content modern-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Registration Details</h2>
              <button onClick={() => setShowModal(false)} className="close-btn">✕</button>
            </div>

            {/* Tabs */}
            <div className="modal-tabs">
              <button 
                className={`tab ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                📋 Details
              </button>
              <button 
                className={`tab ${activeTab === 'members' ? 'active' : ''}`}
                onClick={() => setActiveTab('members')}
              >
                👥 Members
              </button>
              <button 
                className={`tab ${activeTab === 'qr' ? 'active' : ''}`}
                onClick={() => setActiveTab('qr')}
              >
                🎟️ QR Code
              </button>
            </div>

            <div className="modal-body">
              {/* Details Tab */}
              {activeTab === 'details' && (
                <div className="tab-content">
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Ticket ID</span>
                      <span className="detail-value">{selectedRegistration.assignedTicketId || selectedRegistration.ticketId}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Name</span>
                      <span className="detail-value">{selectedRegistration.firstName} {selectedRegistration.lastName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email</span>
                      <span className="detail-value">{selectedRegistration.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Phone</span>
                      <span className="detail-value">{selectedRegistration.mobile}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Gender</span>
                      <span className="detail-value">{selectedRegistration.gender}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Type</span>
                      <span className="detail-value">
                        <span className={`badge badge-type-${selectedRegistration.type.toLowerCase()}`}>
                          {selectedRegistration.type}
                        </span>
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Payment Mode</span>
                      <span className="detail-value">
                        <span className={`badge badge-payment-${selectedRegistration.paymentMode.toLowerCase()}`}>
                          {selectedRegistration.paymentMode}
                        </span>
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Amount</span>
                      <span className="detail-value">₹{selectedRegistration.amount}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status</span>
                      <span className="detail-value">
                        <span className={`badge badge-status-${selectedRegistration.status.toLowerCase()}`}>
                          {selectedRegistration.status}
                        </span>
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Attended</span>
                      <span className="detail-value">{selectedRegistration.attended ? '✅ Yes' : '❌ No'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Total Members</span>
                      <span className="detail-value">{selectedRegistration.totalMembers}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Registered At</span>
                      <span className="detail-value">{new Date(selectedRegistration.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Members Tab */}
              {activeTab === 'members' && (
                <div className="tab-content">
                  <h3 className="members-heading">👥 Additional Members</h3>
                  {selectedRegistration.additionalMembers && selectedRegistration.additionalMembers.length > 0 ? (
                    <div className="members-list">
                      {selectedRegistration.additionalMembers.map((member, index) => (
                        <div key={index} className="member-card">
                          <div className="member-avatar">
                            {member.gender === 'Male' ? '👨' : member.gender === 'Female' ? '👩' : '👤'}
                          </div>
                          <div className="member-info">
                            <p className="member-name">{member.firstName} {member.lastName}</p>
                            <p className="member-gender">{member.gender}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-members">No additional members</p>
                  )}
                </div>
              )}

              {/* QR Code Tab */}
              {activeTab === 'qr' && (
                <div className="tab-content qr-tab">
                  <div className="qr-container-modal">
                    <img src={selectedRegistration.qrCodeDataURL || selectedRegistration.qrCode} alt="QR Code" className="qr-image" />
                    <p className="qr-id">{selectedRegistration.assignedTicketId || selectedRegistration.ticketId}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {/* WhatsApp Dropdown */}
              <div className="whatsapp-dropdown-wrapper">
                <button 
                  onClick={() => setShowWhatsAppDropdown(!showWhatsAppDropdown)}
                  className="btn-whatsapp"
                >
                  💬 Send WhatsApp
                </button>
                {showWhatsAppDropdown && (
                  <div className="whatsapp-dropdown-menu">
                    <button 
                      onClick={() => {
                        handleSendWhatsAppTemplate(selectedRegistration, 'confirmation');
                        setShowWhatsAppDropdown(false);
                      }}
                      className="dropdown-item"
                    >
                      Confirmation Message
                    </button>
                    <button 
                      onClick={() => {
                        handleSendWhatsAppTemplate(selectedRegistration, 'approved');
                        setShowWhatsAppDropdown(false);
                      }}
                      className="dropdown-item"
                    >
                      Approval Message
                    </button>
                    <button 
                      onClick={() => {
                        handleSendWhatsAppTemplate(selectedRegistration, 'reminder');
                        setShowWhatsAppDropdown(false);
                      }}
                      className="dropdown-item"
                    >
                      Event Reminder
                    </button>
                    <button 
                      onClick={() => {
                        handleSendWhatsAppTemplate(selectedRegistration, 'custom');
                        setShowWhatsAppDropdown(false);
                      }}
                      className="dropdown-item"
                    >
                      Custom Message
                    </button>
                  </div>
                )}
              </div>

              {selectedRegistration.status === 'Pending' && (
                <>
                  <button 
                    onClick={() => handleStatusUpdate('Accepted')} 
                    className="btn-success"
                    disabled={statusUpdating}
                  >
                    {statusUpdating ? (
                      <>
                        <span className="spinner-small"></span>
                        Accepting & Sending Email...
                      </>
                    ) : (
                      '✅ Accept'
                    )}
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate('Rejected')} 
                    className="btn-warning"
                    disabled={statusUpdating}
                  >
                    {statusUpdating ? (
                      <>
                        <span className="spinner-small"></span>
                        Rejecting & Sending Email...
                      </>
                    ) : (
                      '❌ Reject'
                    )}
                  </button>
                </>
              )}
              <button 
                onClick={handleDelete} 
                className="btn-danger"
                disabled={statusUpdating}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editData && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✏️ Edit Registration</h2>
              <button onClick={() => setShowEditModal(false)} className="close-btn">✕</button>
            </div>

            <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={editData.firstName}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={editData.lastName}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mobile</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={editData.mobile}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select name="gender" value={editData.gender} onChange={handleEditChange} required>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Type</label>
                  <select name="type" value={editData.type} onChange={handleEditChange} required>
                    <option value="Couple">Couple</option>
                    <option value="Family">Family</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Payment Mode</label>
                  <select name="paymentMode" value={editData.paymentMode} onChange={handleEditChange} required>
                    <option value="Cash">Cash</option>
                    <option value="Online">Online</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input
                    type="number"
                    name="amount"
                    value={editData.amount}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>

              {/* Additional Members */}
              <div className="members-section">
                <div className="members-header">
                  <h3>👥 Additional Members</h3>
                  <button type="button" onClick={handleAddMember} className="btn-add-member">
                    + Add Member
                  </button>
                </div>

                {editData.additionalMembers.map((member, index) => (
                  <div key={index} className="member-form-card">
                    <div className="member-form-header">
                      <span>Member {index + 1}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveMember(index)} 
                        className="btn-remove-member"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="member-form-grid">
                      <input
                        type="text"
                        placeholder="First Name"
                        value={member.firstName}
                        onChange={(e) => handleMemberChange(index, 'firstName', e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={member.lastName}
                        onChange={(e) => handleMemberChange(index, 'lastName', e.target.value)}
                        required
                      />
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
                ))}
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowEditModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  💾 Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
