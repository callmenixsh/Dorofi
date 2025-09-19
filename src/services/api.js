// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      console.log(`🌐 API Request: ${config.method || 'GET'} ${url}`);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ API Response:`, data);
      return data;
    } catch (error) {
      console.error(`❌ API request failed: ${config.method || 'GET'} ${url}`, error);
      throw error;
    }
  }

  // Auth methods
  async googleLogin(googleToken) {
    return this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token: googleToken })
    });
  }

  // Profile methods
  async getProfile() {
    return this.request('/users/profile');
  }

  async getUserStats() {
    return this.request('/users/stats');
  }

  async updateDisplayName(displayName) {
    return this.request('/users/display-name', {
      method: 'PUT',
      body: JSON.stringify({ displayName })
    });
  }

  async checkUsername(username) {
    return this.request(`/users/check-username/${username}`);
  }

  async updateUsername(username) {
    return this.request('/users/username', {
      method: 'PUT',
      body: JSON.stringify({ username })
    });
  }
    async updatePresenceStatus(status) {
        return this.request('/users/status/presence', {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }

    async updateCustomStatus({ text, emoji, isActive }) {
        return this.request('/users/status/custom', {
            method: 'PUT',
            body: JSON.stringify({ text, emoji, isActive })
        });
    }

        async updatePrivacySettings(settings) {
        return this.request('/users/privacy', {
            method: 'PUT',
            body: JSON.stringify(settings)
        });
    }


  //friends section


async getFriends() {
    return this.request('/friends');
}

async sendFriendRequest(friendCode) {
    return this.request('/friends/request', {
        method: 'POST',
        body: JSON.stringify({ friendCode })
    });
}

async removeFriend(friendId) {
    return this.request(`/friends/${friendId}`, {
        method: 'DELETE'
    });
}

async acceptFriendRequest(requestId) {
    return this.request(`/friends/request/${requestId}/accept`, {
        method: 'PUT'
    });
}

async declineFriendRequest(requestId) {
    return this.request(`/friends/request/${requestId}/decline`, {
        method: 'PUT'
    });
}

async cancelFriendRequest(requestId) {
    return this.request(`/friends/request/${requestId}/cancel`, {
        method: 'DELETE'
    });
}


}

export default new ApiService();
