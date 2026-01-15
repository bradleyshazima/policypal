import AsyncStorage from '@react-native-async-storage/async-storage';

// Change this to your actual backend URL
// For local testing: use your computer's IP address (not localhost)
// Example: 'http://192.168.88.252:3000/api'
const API_URL = 'http://192.168.88.252:3000/api';

class ApiService {
  // Get auth token
  async getToken() {
    try {
      return await AsyncStorage.getItem('token');
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  }

  // Set auth token
  async setToken(token) {
    try {
      await AsyncStorage.setItem('token', token);
    } catch (error) {
      console.error('Set token error:', error);
    }
  }

  // Clear auth token
  async clearToken() {
    try {
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.error('Clear token error:', error);
    }
  }

  // Make API request
  async request(endpoint, options = {}) {
    const token = await this.getToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth endpoints
  auth = {
    register: (userData) =>
      this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),

    login: async (credentials) => {
      const data = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (data.token) {
        await this.setToken(data.token);
      }
      return data;
    },

    logout: async () => {
      await this.clearToken();
    },

    getProfile: () => this.request('/auth/profile'),

    updateProfile: (updates) =>
      this.request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      }),

    changePassword: (passwords) =>
      this.request('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify(passwords),
      }),
  };

  // Client endpoints
  clients = {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return this.request(`/clients${query ? `?${query}` : ''}`);
    },

    getById: (id) => this.request(`/clients/${id}`),

    create: (clientData) =>
      this.request('/clients', {
        method: 'POST',
        body: JSON.stringify(clientData),
      }),

    update: (id, updates) =>
      this.request(`/clients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      }),

    delete: (id) =>
      this.request(`/clients/${id}`, {
        method: 'DELETE',
      }),

    getExpiring: (days = 30) =>
      this.request(`/clients/expiring?days=${days}`),
  };

  // Reminder endpoints
  reminders = {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return this.request(`/reminders${query ? `?${query}` : ''}`);
    },

    sendManual: (reminderData) =>
      this.request('/reminders/send', {
        method: 'POST',
        body: JSON.stringify(reminderData),
      }),

    getStatistics: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return this.request(`/reminders/statistics${query ? `?${query}` : ''}`);
    },
  };

  // Template endpoints
  templates = {
    getAll: () => this.request('/templates'),

    getById: (id) => this.request(`/templates/${id}`),

    create: (templateData) =>
      this.request('/templates', {
        method: 'POST',
        body: JSON.stringify(templateData),
      }),

    update: (id, updates) =>
      this.request(`/templates/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      }),

    delete: (id) =>
      this.request(`/templates/${id}`, {
        method: 'DELETE',
      }),
  };

  // Subscription endpoints
  subscription = {
    getPlans: () => this.request('/subscription/plans'),

    getCurrent: () => this.request('/subscription/current'),

    create: (planData) =>
      this.request('/subscription/create', {
        method: 'POST',
        body: JSON.stringify(planData),
      }),

    cancel: () =>
      this.request('/subscription/cancel', {
        method: 'POST',
      }),

    getUsage: () => this.request('/subscription/usage'),
  };
}

export default new ApiService();