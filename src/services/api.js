const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://samarthya-event-management-backend.vercel.app/api';

// Helper function to handle API errors
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    throw new Error(error.response.data.message || 'Something went wrong');
  } else if (error.request) {
    // Request made but no response
    throw new Error('No response from server');
  } else {
    // Error setting up request
    throw new Error(error.message || 'Request failed');
  }
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const auth = localStorage.getItem('auth');
  if (auth) {
    const { username, password } = JSON.parse(auth);
    const credentials = btoa(`${username}:${password}`);
    return {
      'Authorization': `Basic ${credentials}`
    };
  }
  return {};
};

// Auth API
export const authAPI = {
  login: async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for CORS with credentials
        body: JSON.stringify({ username, password }),
      });
    
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store credentials for Basic Auth
      localStorage.setItem('auth', JSON.stringify({ username, password, role: data.data.role }));
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  verify: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        headers: {
          ...getAuthHeaders(),
        },
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('auth');
  },

  getUser: () => {
    const auth = localStorage.getItem('auth');
    return auth ? JSON.parse(auth) : null;
  }
};

// Registration API
export const registrationAPI = {
  create: async (registrationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(registrationData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (registrationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register/${registrationId}`, {
        credentials: 'include',
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch registration');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  verify: async (registrationId, mobile) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ registrationId, mobile }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }
};

// Admin API
export const adminAPI = {
  getStatistics: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/statistics`, {
        headers: {
          ...getAuthHeaders(),
        },
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch statistics');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  getRegistrations: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE_URL}/admin/registrations?${queryParams}`, {
        headers: {
          ...getAuthHeaders(),
        },
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch registrations');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  getRegistrationDetails: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/registrations/${id}`, {
        headers: {
          ...getAuthHeaders(),
        },
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch registration details');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  updateStatus: async (id, status, notes = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/registrations/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        credentials: 'include',
        body: JSON.stringify({ status, notes }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update status');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  updateRegistration: async (id, updates) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/registrations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update registration');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  deleteRegistration: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/registrations/${id}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeaders(),
        },
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete registration');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  exportRegistrations: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/export`, {
        headers: {
          ...getAuthHeaders(),
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to export registrations');
      }
      
      const blob = await response.blob();
      return blob;
    } catch (error) {
      throw error;
    }
  }
};

// Scanner API
export const scanAPI = {
  // Get registration details without marking attendance
  getDetails: async (registrationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/scan/details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        credentials: 'include',
        body: JSON.stringify({ registrationId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch details');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Mark attendance for a registration
  markAttendance: async (registrationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/scan/mark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        credentials: 'include',
        body: JSON.stringify({ registrationId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to mark attendance');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Legacy scan method (kept for compatibility)
  scan: async (registrationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        credentials: 'include',
        body: JSON.stringify({ registrationId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Scan failed');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  getHistory: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/scan/history`, {
        headers: {
          ...getAuthHeaders(),
        },
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch scan history');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }
};

export default {
  authAPI,
  registrationAPI,
  adminAPI,
  scanAPI
};

// Named exports for convenience
export const verifyRegistration = registrationAPI.verify;
