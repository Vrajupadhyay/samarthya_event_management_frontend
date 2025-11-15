import { useState, useEffect } from 'react';
import { promocodeAPI } from '../services/api';
import './PromocodeManagement.css';

const PromocodeManagement = () => {
  const [promocodes, setPromocodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    code: '',
    individualPrice: '',
    couplePrice: '',
    quantity: ''
  });
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [usageData, setUsageData] = useState(null);
  const [usageLoading, setUsageLoading] = useState(false);

  useEffect(() => {
    fetchPromocodes();
  }, []);

  const fetchPromocodes = async () => {
    try {
      setLoading(true);
      const response = await promocodeAPI.getAll();
      setPromocodes(response.data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'code' ? value.toUpperCase() : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.code || !formData.individualPrice || !formData.couplePrice || !formData.quantity) {
      alert('All fields are required');
      return;
    }

    try {
      await promocodeAPI.create({
        code: formData.code,
        individualPrice: Number(formData.individualPrice),
        couplePrice: Number(formData.couplePrice),
        quantity: Number(formData.quantity)
      });

      alert('Promocode created successfully!');
      setFormData({ code: '', individualPrice: '', couplePrice: '', quantity: '' });
      fetchPromocodes();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleToggleActive = async (promocode) => {
    try {
      if (promocode.isActive) {
        await promocodeAPI.deactivate(promocode._id);
      } else {
        await promocodeAPI.activate(promocode._id);
      }
      fetchPromocodes();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (promocode) => {
    if (promocode.usedCount > 0) {
      alert('Cannot delete promocode that has been used. Deactivate it instead.');
      return;
    }

    if (!confirm(`Are you sure you want to delete promocode "${promocode.code}"?`)) {
      return;
    }

    try {
      await promocodeAPI.delete(promocode._id);
      alert('Promocode deleted successfully');
      fetchPromocodes();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleViewUsage = async (code) => {
    try {
      setUsageLoading(true);
      setShowUsageModal(true);
      const response = await promocodeAPI.getUsage(code);
      setUsageData(response.data);
    } catch (error) {
      alert(error.message);
      setShowUsageModal(false);
    } finally {
      setUsageLoading(false);
    }
  };

  return (
    <div className="promocode-management">
      {/* Create Promocode Form */}
      <div className="promo-create-section">
        <h2>Create New Promocode</h2>
        <form onSubmit={handleSubmit} className="promo-form">
          <div className="promo-form-grid">
            <div className="promo-form-group">
              <label>Code *</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="e.g., SAVE500"
                required
              />
            </div>
            <div className="promo-form-group">
              <label>Individual Price *</label>
              <input
                type="number"
                name="individualPrice"
                value={formData.individualPrice}
                onChange={handleInputChange}
                placeholder="e.g., 1000"
                min="0"
                required
              />
            </div>
            <div className="promo-form-group">
              <label>Couple Price *</label>
              <input
                type="number"
                name="couplePrice"
                value={formData.couplePrice}
                onChange={handleInputChange}
                placeholder="e.g., 1800"
                min="0"
                required
              />
            </div>
            <div className="promo-form-group">
              <label>Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="e.g., 50"
                min="1"
                required
              />
            </div>
          </div>
          <button type="submit" className="promo-submit-btn">
            🎁 Create Promocode
          </button>
        </form>
      </div>

      {/* Promocodes List */}
      <div className="promo-list-section">
        <h2>Promocodes ({promocodes.length})</h2>
        
        {loading ? (
          <div className="promo-loading">Loading promocodes...</div>
        ) : promocodes.length === 0 ? (
          <div className="promo-empty">No promocodes created yet</div>
        ) : (
          <div className="promo-table-container">
            <table className="promo-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Individual Price</th>
                  <th>Couple Price</th>
                  <th>Quantity</th>
                  <th>Used</th>
                  <th>Remaining</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {promocodes.map(promo => (
                  <tr key={promo._id}>
                    <td><strong className="promo-code">{promo.code}</strong></td>
                    <td>₹{promo.individualPrice}</td>
                    <td>₹{promo.couplePrice}</td>
                    <td>{promo.quantity}</td>
                    <td>{promo.usedCount}</td>
                    <td className={promo.quantity - promo.usedCount === 0 ? 'text-danger' : ''}>
                      {promo.quantity - promo.usedCount}
                    </td>
                    <td>
                      <span className={`promo-status ${promo.isActive ? 'active' : 'inactive'}`}>
                        {promo.isActive ? '✅ Active' : '❌ Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="promo-actions">
                        <button
                          className="promo-btn promo-btn-view"
                          onClick={() => handleViewUsage(promo.code)}
                          title="View Usage"
                        >
                          👁️ Usage
                        </button>
                        <button
                          className={`promo-btn ${promo.isActive ? 'promo-btn-deactivate' : 'promo-btn-activate'}`}
                          onClick={() => handleToggleActive(promo)}
                          title={promo.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {promo.isActive ? '⏸️ Deactivate' : '▶️ Activate'}
                        </button>
                        {promo.usedCount === 0 && (
                          <button
                            className="promo-btn promo-btn-delete"
                            onClick={() => handleDelete(promo)}
                            title="Delete"
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Usage Modal */}
      {showUsageModal && (
        <div className="promo-modal-overlay" onClick={() => setShowUsageModal(false)}>
          <div className="promo-modal" onClick={e => e.stopPropagation()}>
            <div className="promo-modal-header">
              <h3>Promocode Usage Details</h3>
              <button className="promo-modal-close" onClick={() => setShowUsageModal(false)}>
                ✕
              </button>
            </div>
            
            {usageLoading ? (
              <div className="promo-modal-loading">Loading usage data...</div>
            ) : usageData ? (
              <div className="promo-modal-content">
                <div className="promo-usage-summary">
                  <h4>Promocode: {usageData.promocode.code}</h4>
                  <p>Used: {usageData.promocode.usedCount} / {usageData.promocode.quantity}</p>
                  <p>Status: {usageData.promocode.isActive ? '✅ Active' : '❌ Inactive'}</p>
                </div>

                <h4>Registrations ({usageData.registrations.length})</h4>
                {usageData.registrations.length === 0 ? (
                  <p className="promo-no-usage">This promocode hasn't been used yet</p>
                ) : (
                  <table className="promo-usage-table">
                    <thead>
                      <tr>
                        <th>Ticket ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usageData.registrations.map(reg => (
                        <tr key={reg._id}>
                          <td>{reg.assignedTicketId}</td>
                          <td>{reg.firstName} {reg.lastName}</td>
                          <td>{reg.email}</td>
                          <td>{reg.mobile}</td>
                          <td>{reg.type}</td>
                          <td>₹{reg.amount}</td>
                          <td>
                            <span className={`status-badge status-${reg.status.toLowerCase()}`}>
                              {reg.status}
                            </span>
                          </td>
                          <td>{new Date(reg.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default PromocodeManagement;
