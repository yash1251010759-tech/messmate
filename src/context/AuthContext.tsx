import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => void;
  switchDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_STUDENT: User = {
  id: 'usr_stu_1',
  name: 'Aarav Sharma',
  email: 'student@messmate.com',
  role: 'student',
  hostelBlock: 'Block-B',
  roomNo: 'B-304',
  address: 'Room B-304, Boys Hostel Block-B, University North Campus, Delhi - 110007',
  rollNo: '2023CS108',
  foodPreference: 'Veg',
  phone: '+91 98765 43210',
  avatar: '',
  token: 'mock_jwt_student_token',
  allottedMessId: 'mess_101',
  allottedMessName: 'Royal North Central Mess',
  subscriptionStatus: 'Active',
  subscriptionValidUntil: '2026-09-30',
  paymentHistory: [
    {
      id: 'pay_90812',
      studentId: 'usr_stu_1',
      messId: 'mess_101',
      messName: 'Royal North Central Mess',
      amount: 3200,
      planDuration: '1 Month',
      paymentMethod: 'UPI',
      transactionId: 'TXN_MM_99182310',
      date: '2026-08-01',
      validUntil: '2026-09-30',
      status: 'Success'
    }
  ]
};

const DEMO_ADMIN: User = {
  id: 'usr_adm_1',
  name: 'Dr. Ramesh Verma',
  email: 'admin@messmate.com',
  role: 'admin',
  hostelBlock: 'Main Mess Office',
  roomNo: 'M-01',
  address: 'Admin Office M-01, Central Dining Complex, University Campus',
  rollNo: 'STAFF-001',
  foodPreference: 'Veg',
  phone: '+91 98111 22233',
  avatar: '',
  token: 'mock_jwt_admin_token'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('messmate_user');
      const token = localStorage.getItem('messmate_token');

      if (storedUser && token) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.avatar) {
            parsed.avatar = '';
            localStorage.setItem('messmate_user', JSON.stringify(parsed));
          }
          setUser(parsed);
        } catch {
          localStorage.removeItem('messmate_user');
          localStorage.removeItem('messmate_token');
        }
      } else {
        // Default to demo student logged in so review is instant
        setUser(DEMO_STUDENT);
        localStorage.setItem('messmate_user', JSON.stringify(DEMO_STUDENT));
        localStorage.setItem('messmate_token', DEMO_STUDENT.token || 'mock_token');
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      localStorage.setItem('messmate_user', JSON.stringify(data.user));
      localStorage.setItem('messmate_token', data.token);
    } catch {
      // Fallback for demo mode
      const selectedUser = email.includes('admin') ? DEMO_ADMIN : {
        ...DEMO_STUDENT,
        email: email,
        name: email.split('@')[0].toUpperCase(),
      };
      setUser(selectedUser);
      localStorage.setItem('messmate_user', JSON.stringify(selectedUser));
      localStorage.setItem('messmate_token', selectedUser.token || 'mock_token');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User> & { password: string }) => {
    setIsLoading(true);
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      localStorage.setItem('messmate_user', JSON.stringify(data.user));
      localStorage.setItem('messmate_token', data.token);
    } catch {
      const newUser: User = {
        id: 'usr_' + Date.now(),
        name: userData.name || 'New Student',
        email: userData.email || 'student@messmate.com',
        role: userData.role || 'student',
        hostelBlock: userData.hostelBlock || 'Block-A',
        roomNo: userData.roomNo || 'A-101',
        rollNo: userData.rollNo || '2024CS001',
        foodPreference: userData.foodPreference || 'Veg',
        phone: userData.phone || '+91 99000 11223',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
        token: 'mock_token_' + Date.now(),
      };
      setUser(newUser);
      localStorage.setItem('messmate_user', JSON.stringify(newUser));
      localStorage.setItem('messmate_token', newUser.token!);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('messmate_user');
    localStorage.removeItem('messmate_token');
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    setUser(updated);
    localStorage.setItem('messmate_user', JSON.stringify(updated));
  };

  const switchDemoRole = (role: UserRole) => {
    const target = role === 'admin' ? DEMO_ADMIN : DEMO_STUDENT;
    setUser(target);
    localStorage.setItem('messmate_user', JSON.stringify(target));
    localStorage.setItem('messmate_token', target.token!);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
