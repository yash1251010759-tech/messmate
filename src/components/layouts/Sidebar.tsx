import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Utensils, 
  CalendarDays, 
  CheckCircle2, 
  History, 
  Bell, 
  MessageSquareHeart, 
  AlertCircle, 
  User as UserIcon, 
  BarChart3, 
  Users, 
  Megaphone, 
  Settings, 
  FileSpreadsheet,
  QrCode,
  CreditCard,
  Store
} from 'lucide-react';

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
}

interface SidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  role: 'student' | 'admin';
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, role }) => {
  const navigate = useNavigate();

  const studentItems: SidebarItem[] = [
    { id: 'today-menu', label: "Today's Menu", icon: <Utensils className="w-4 h-4" /> },
    { id: 'select-mess', label: 'Select & Pay Mess', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'weekly-menu', label: 'Weekly Schedule', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'meal-registration', label: 'Meal Registration', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'meal-history', label: 'Meal Pass & History', icon: <History className="w-4 h-4" /> },
    { id: 'attendance', label: 'Attendance & QR Pass', icon: <QrCode className="w-4 h-4" /> },
    { id: 'announcements', label: 'Announcements', icon: <Bell className="w-4 h-4" /> },
    { id: 'feedback', label: 'Rate & Feedback', icon: <MessageSquareHeart className="w-4 h-4" /> },
    { id: 'complaints', label: 'Complaints Desk', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'profile', label: 'My Student Profile', icon: <UserIcon className="w-4 h-4" /> },
  ];

  const adminItems: SidebarItem[] = [
    { id: 'overview', label: 'Executive Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'mess-cards', label: 'Mess Cards & Listings', icon: <Store className="w-4 h-4" /> },
    { id: 'menu-manage', label: 'Menu Management', icon: <Utensils className="w-4 h-4" /> },
    { id: 'meal-roster', label: 'Registration Roster', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'students', label: 'Student Directory', icon: <Users className="w-4 h-4" /> },
    { id: 'announcements-manage', label: 'Announcements', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'complaints-manage', label: 'Complaints Management', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'feedback-manage', label: 'Feedback Insights', icon: <MessageSquareHeart className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports & Analytics', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'settings', label: 'Mess Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const items = role === 'admin' ? adminItems : studentItems;

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 transition-colors">
      <div className="mb-4 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            Current Workspace
          </span>
          <p className="text-xs font-bold text-slate-900 dark:text-white capitalize">
            {role === 'admin' ? 'Mess Admin Control' : 'Student Portal'}
          </p>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'select-mess') {
                  navigate('/select-mess');
                } else {
                  onTabChange(item.id);
                }
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`px-2 py-0.5 text-[10px] rounded-full font-extrabold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
