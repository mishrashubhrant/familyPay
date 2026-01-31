import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Authentication
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me')
};

// Circle Management
export const circleAPI = {
    create: (data) => api.post('/circle/create', data),
    addMember: (data) => api.post('/circle/add-member', data),
    removeMember: (memberId) => api.delete(`/circle/remove-member/${memberId}`),
    setLimit: (memberId, data) => api.put(`/circle/set-limit/${memberId}`, data),
    getMembers: () => api.get('/circle/members'),
    getMyCircle: () => api.get('/circle/my-circle')
};

// Payment
export const paymentAPI = {
    request: (data) => api.post('/payment/request', data),
    approve: (data) => api.post('/payment/approve', data),
    getPending: () => api.get('/payment/pending')
};

// Transactions
export const transactionAPI = {
    getHistory: (params) => api.get('/transactions/history', { params }),
    getUserTransactions: (userId, params) => api.get(`/transactions/user/${userId}`, { params })
};

// Analytics
export const analyticsAPI = {
    getSummary: () => api.get('/analytics/summary'),
    getMonthly: (params) => api.get('/analytics/monthly', { params })
};

// Notifications
export const notificationAPI = {
    get: () => api.get('/notifications'),
    markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`)
};

export default api;
