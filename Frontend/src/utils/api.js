const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Set auth token in localStorage
  setAuthToken(token) {
    localStorage.setItem('token', token);
  }

  // Remove auth token from localStorage
  removeAuthToken() {
    localStorage.removeItem('token');
  }

  // Get headers for API requests
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      
    } else {
      console.log('No token found in localStorage');
    }
    
    return headers;
  }

  // Generic request method with enhanced error handling
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized - redirect to login
          this.removeAuthToken();
          window.location.href = '/login-screen';
          throw new Error('Unauthorized - Please login again');
        }
        
        if (response.status === 423) {
          // Account locked
          throw new Error(data.message || 'Account is temporarily locked');
        }
        
        if (response.status === 429) {
          // Rate limited
          throw new Error('Too many requests. Please try again later.');
        }
        
        // Handle other errors with detailed messages
        const errorMessage = data.message || data.msg || `HTTP error! status: ${response.status}`;
        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = data;
        throw error;
      }
      
      // Return the data directly (success responses)
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      
      // If it's already an Error object with our custom message, throw it as is
      if (error.message && error.message !== 'Failed to fetch') {
        throw error;
      }
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw new Error('Network error. Please check your connection and try again.');
      }
      
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Auth endpoints
  async login(credentials) {
    const response = await this.post('/auth/login', credentials);
    if (response.success && response.token) {
      this.setAuthToken(response.token);
    }
    return response;
  }

  async register(userData) {
    const response = await this.post('/auth/register', userData);
    if (response.success && response.token) {
      this.setAuthToken(response.token);
    }
    return response;
  }

  async getCurrentUser() {
    return this.get('/auth/me');
  }

  async logout() {
    try {
      await this.post('/auth/logout');
    } finally {
      this.removeAuthToken();
    }
  }

  async changePassword(passwords) {
    return this.put('/auth/change-password', passwords);
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.get('/dashboard/stats');
  }

  async getRecentDoctors() {
    return this.get('/dashboard/recent-doctors');
  }

  async getRecentConsultants() {
    return this.get('/dashboard/recent-consultants');
  }

  async getActivityFeed() {
    return this.get('/dashboard/activity-feed');
  }

  // Doctor endpoints
  async getDoctors(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await this.get(`/doctors?${queryString}`);
    return response;
  }

  async getDoctorStats() {
    return this.get('/doctors/stats');
  }

  async getDoctorById(id) {
    const response = await this.get(`/doctors/${id}`);
    return response;
  }

  async createDoctor(doctorData) {
    const response = await this.post('/doctors', doctorData);
    return response;
  }

  async updateDoctor(id, doctorData) {
    const response = await this.put(`/doctors/${id}`, doctorData);
    return response;
  }

  async deleteDoctor(id) {
    return this.delete(`/doctors/${id}`);
  }

  async bulkDeleteDoctors(doctorIds) {
    return this.post('/doctors/bulk-delete', { doctorIds });
  }

  async bulkExportDoctors(doctorIds) {
    return this.post('/doctors/bulk-export', { doctorIds });
  }

  // Consultant endpoints
  async getConsultants(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await this.get(`/consultants?${queryString}`);
    return response;
  }

  async getConsultantStats() {
    return this.get('/consultants/stats');
  }

  async getConsultantById(id) {
    const response = await this.get(`/consultants/${id}`);
    return response;
  }

  async createConsultant(consultantData) {
    const response = await this.post('/consultants', consultantData);
    return response;
  }

  async updateConsultant(id, consultantData) {
    const response = await this.put(`/consultants/${id}`, consultantData);
    return response;
  }

  async deleteConsultant(id) {
    return this.delete(`/consultants/${id}`);
  }

  async addDoctorMapping(consultantId, doctorId, referrals) {
    return this.post(`/consultants/${consultantId}/map-doctor`, {
      doctorId,
      referrals
    });
  }

  async updateDoctorMapping(consultantId, doctorId, referrals) {
    return this.put(`/consultants/${consultantId}/update-mapping/${doctorId}`, {
      referrals
    });
  }

  async removeDoctorMapping(consultantId, doctorId) {
    return this.delete(`/consultants/${consultantId}/unmap-doctor/${doctorId}`);
  }

  async bulkDeleteConsultants(consultantIds) {
    return this.post('/consultants/bulk-delete', { consultantIds });
  }

  async bulkExportConsultants(consultantIds) {
    return this.post('/consultants/bulk-export', { consultantIds });
  }
}

const api = new ApiService();
export default api; 