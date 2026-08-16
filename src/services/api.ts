import axios from 'axios';
import { 
  User, 
  MenuItem, 
  MealRegistration, 
  Complaint, 
  FeedbackItem, 
  Announcement, 
  AdminStats, 
  SystemSettings,
  MessProvider,
  PaymentRecord
} from '../types';

const API_BASE_URL = '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('messmate_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData: Partial<User> & { password: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Menu Services
export const menuService = {
  getWeeklyMenu: async () => {
    const response = await api.get('/menu');
    return response.data as MenuItem[];
  },
  getTodayMenu: async () => {
    const response = await api.get('/menu/today');
    return response.data as MenuItem[];
  },
  addMenuItem: async (item: Partial<MenuItem>) => {
    const response = await api.post('/menu', item);
    return response.data as MenuItem;
  },
  updateMenuItem: async (id: string, item: Partial<MenuItem>) => {
    const response = await api.put(`/menu/${id}`, item);
    return response.data as MenuItem;
  },
  deleteMenuItem: async (id: string) => {
    const response = await api.delete(`/menu/${id}`);
    return response.data;
  },
};

// Meal Registration & History Services
export const mealService = {
  getRegistrations: async () => {
    const response = await api.get('/meals/registrations');
    return response.data as MealRegistration[];
  },
  toggleMealRegistration: async (date: string, mealType: string, status: 'Registered' | 'Opted Out') => {
    const response = await api.post('/meals/register', { date, mealType, status });
    return response.data as MealRegistration;
  },
  getMealHistory: async () => {
    const response = await api.get('/meals/history');
    return response.data as MealRegistration[];
  },
  scanMealToken: async (tokenCode: string) => {
    const response = await api.post('/meals/verify-token', { tokenCode });
    return response.data;
  },
};

// Complaints Services
export const complaintService = {
  getComplaints: async () => {
    const response = await api.get('/complaints');
    return response.data as Complaint[];
  },
  createComplaint: async (data: { title: string; category: string; description: string; priority: string }) => {
    const response = await api.post('/complaints', data);
    return response.data as Complaint;
  },
  updateComplaintStatus: async (id: string, status: string, adminResponse?: string) => {
    const response = await api.put(`/complaints/${id}`, { status, adminResponse });
    return response.data as Complaint;
  },
};

// Feedback Services
export const feedbackService = {
  getFeedback: async () => {
    const response = await api.get('/feedback');
    return response.data as FeedbackItem[];
  },
  submitFeedback: async (data: { mealType: string; rating: number; tags: string[]; comment: string }) => {
    const response = await api.post('/feedback', data);
    return response.data as FeedbackItem;
  },
};

// Announcements Services
export const announcementService = {
  getAnnouncements: async () => {
    const response = await api.get('/announcements');
    return response.data as Announcement[];
  },
  createAnnouncement: async (data: Partial<Announcement>) => {
    const response = await api.post('/announcements', data);
    return response.data as Announcement;
  },
  deleteAnnouncement: async (id: string) => {
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  },
};

// Admin Services
export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data as AdminStats;
  },
  getStudents: async () => {
    const response = await api.get('/admin/students');
    return response.data as User[];
  },
  getSettings: async () => {
    const response = await api.get('/admin/settings');
    return response.data as SystemSettings;
  },
  updateSettings: async (settings: Partial<SystemSettings>) => {
    const response = await api.put('/admin/settings', settings);
    return response.data as SystemSettings;
  },
};

// Mess Selection & Allotment Services
export const messService = {
  getMessProviders: async () => {
    const response = await api.get('/messes');
    return response.data as MessProvider[];
  },
  getMessProviderById: async (id: string) => {
    const response = await api.get(`/messes/${id}`);
    return response.data as MessProvider;
  },
  createMessProvider: async (data: Partial<MessProvider>) => {
    const response = await api.post('/messes', data);
    return response.data as MessProvider;
  },
  updateMessProvider: async (id: string, data: Partial<MessProvider>) => {
    const response = await api.put(`/messes/${id}`, data);
    return response.data as MessProvider;
  },
  deleteMessProvider: async (id: string) => {
    const response = await api.delete(`/messes/${id}`);
    return response.data;
  },
  selectAndPayMess: async (payload: {
    messId: string;
    planDuration: '1 Month' | '3 Months' | '1 Semester';
    paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'Campus Wallet';
    couponCode?: string;
  }) => {
    const response = await api.post('/messes/select-and-pay', payload);
    return response.data as {
      message: string;
      user: User;
      paymentRecord: PaymentRecord;
      allottedMess: MessProvider;
    };
  },
  deallotMess: async () => {
    const response = await api.post('/messes/deallot');
    return response.data as { message: string; user: User };
  }
};
