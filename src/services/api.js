// src/services/api.js - Clean Production Version
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class ApiService {
	constructor() {
		this.baseURL = API_URL;
	}

	getAuthHeaders() {
		const token = localStorage.getItem("token");
		return {
			"Content-Type": "application/json",
			...(token && { Authorization: `Bearer ${token}` }),
		};
	}

	async request(endpoint, options = {}) {
		const url = `${this.baseURL}${endpoint}`;
		const config = {
			headers: this.getAuthHeaders(),
			...options,
		};

		try {
			const response = await fetch(url, config);

			if (!response.ok) {
				const errorData = await response
					.json()
					.catch(() => ({ error: "Network error" }));
				throw new Error(
					errorData.error || `HTTP error! status: ${response.status}`
				);
			}

			return await response.json();
		} catch (error) {
			console.error(
				`API ${config.method || "GET"} ${endpoint}:`,
				error.message
			);
			throw error;
		}
	}

	// Auth Methods
	async googleLogin(googleToken) {
		return this.request("/auth/google", {
			method: "POST",
			body: JSON.stringify({ token: googleToken }),
		});
	}

	// Profile Methods
	async getProfile() {
		return this.request("/users/profile");
	}

	async updateDisplayName(displayName) {
		return this.request("/users/display-name", {
			method: "PUT",
			body: JSON.stringify({ displayName }),
		});
	}

	async checkUsername(username) {
		return this.request(`/users/check-username/${username}`);
	}

	async updateUsername(username) {
		return this.request("/users/username", {
			method: "PUT",
			body: JSON.stringify({ username }),
		});
	}

	async updatePresenceStatus(status) {
		return this.request("/users/status/presence", {
			method: "PUT",
			body: JSON.stringify({ status }),
		});
	}

	async updateCustomStatus({ text, emoji, isActive }) {
		return this.request("/users/status/custom", {
			method: "PUT",
			body: JSON.stringify({ text, emoji, isActive }),
		});
	}

	async updatePrivacySettings(settings) {
		return this.request("/users/privacy", {
			method: "PUT",
			body: JSON.stringify(settings),
		});
	}

	async updateWeeklyGoal(weeklyGoal) {
		return this.request("/users/weekly-goal", {
			method: "PUT",
			body: JSON.stringify({ weeklyGoal }),
		});
	}

	// Stats Methods
	async getUnifiedStats() {
		return this.request("/stats");
	}

	async getLeaderboard() {
		return this.request("/stats/leaderboard");
	}

	async getMonthlyActivity() {
		return this.request("/stats/monthly-activity");
	}

	async getAchievements() {
		return this.request("/stats/achievements");
	}

	async checkAchievements() {
		return this.request("/stats/achievements/check", {
			method: "POST",
		});
	}

	// Timer Methods
	async recordSession(sessionData) {
		return this.request("/timer/session-complete", {
			method: "POST",
			body: JSON.stringify(sessionData),
		});
	}

	async getTimerPresets() {
		return this.request("/timer/presets");
	}

	async saveTimerPreset(presetData) {
		return this.request("/timer/presets", {
			method: "POST",
			body: JSON.stringify(presetData),
		});
	}

	async updateTimerPreset(presetId, presetData) {
		return this.request(`/timer/presets/${presetId}`, {
			method: "PUT",
			body: JSON.stringify(presetData),
		});
	}

	async deleteTimerPreset(presetId) {
		return this.request(`/timer/presets/${presetId}`, {
			method: "DELETE",
		});
	}

	// Friends Methods
	async getFriends() {
		return this.request("/friends");
	}

	// Add this to your Stats Methods section in api.js
	async getUserStatsByUsername(username) {
		console.log("🔍 Fetching user stats for username:", username);
		return this.request(`/stats/user/${username}`);
	}

	async sendFriendRequest(friendCode) {
		return this.request("/friends/request", {
			method: "POST",
			body: JSON.stringify({ friendCode }),
		});
	}

	async removeFriend(friendId) {
		return this.request(`/friends/${friendId}`, {
			method: "DELETE",
		});
	}

	async acceptFriendRequest(requestId) {
		return this.request(`/friends/request/${requestId}/accept`, {
			method: "PUT",
		});
	}

	async declineFriendRequest(requestId) {
		return this.request(`/friends/request/${requestId}/decline`, {
			method: "PUT",
		});
	}

	async cancelFriendRequest(requestId) {
		return this.request(`/friends/request/${requestId}/cancel`, {
			method: "DELETE",
		});
	}

	// Tasks Methods
	async getTasks() {
		return this.request("/tasks");
	}

	async addTask(taskData) {
		return this.request("/tasks", {
			method: "POST",
			body: JSON.stringify(taskData),
		});
	}

	async updateTask(taskId, taskData) {
		return this.request(`/tasks/${taskId}`, {
			method: "PUT",
			body: JSON.stringify(taskData),
		});
	}

	async deleteTask(taskId) {
		return this.request(`/tasks/${taskId}`, {
			method: "DELETE",
		});
	}
}

export default new ApiService();
