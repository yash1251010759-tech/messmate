import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/layouts/Sidebar';
import { useToast } from '../context/ToastContext';
import { 
  menuService, 
  mealService, 
  complaintService, 
  feedbackService, 
  announcementService, 
  adminService,
  messService
} from '../services/api';
import { 
  MenuItem, 
  MealRegistration, 
  Complaint, 
  FeedbackItem, 
  Announcement, 
  AdminStats, 
  User, 
  SystemSettings,
  DayOfWeek,
  MealType,
  MessProvider
} from '../types';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Pagination } from '../components/ui/Pagination';
import { 
  BarChart3, 
  Users, 
  Utensils, 
  AlertCircle, 
  MessageSquare, 
  Megaphone, 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  CheckCircle2, 
  Clock, 
  Settings, 
  FileSpreadsheet,
  TrendingUp,
  Award,
  Send,
  XCircle,
  Save,
  QrCode,
  Store,
  Upload,
  MapPin,
  Phone
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  // Stats & Master Data
  const [stats, setStats] = useState<AdminStats>({
    totalStudents: 485,
    todayRegistrations: 420,
    mealsServedToday: 382,
    pendingComplaints: 1,
    avgFeedbackRating: 4.8,
    wasteReductionPct: 24.5,
    monthlyAttendancePct: 91.2,
  });

  const [weeklyMenu, setWeeklyMenu] = useState<MenuItem[]>([]);
  const [registrations, setRegistrations] = useState<MealRegistration[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [settings, setSettings] = useState<SystemSettings>({
    messName: 'Hostel Central Mess #1',
    breakfastTiming: '07:30 AM - 09:30 AM',
    lunchTiming: '12:30 PM - 02:30 PM',
    snacksTiming: '05:00 PM - 06:15 PM',
    dinnerTiming: '07:30 PM - 09:30 PM',
    registrationCutoffHours: 3,
    guestMealPrice: 85,
    autoOptOutEnabled: false,
    notificationAlerts: true,
  });

  // Mess Provider Cards State
  const [messProviders, setMessProviders] = useState<MessProvider[]>([]);
  const [messModalOpen, setMessModalOpen] = useState(false);
  const [editingMess, setEditingMess] = useState<MessProvider | null>(null);
  const [messForm, setMessForm] = useState({
    name: '',
    providerCompany: '',
    location: '',
    cuisineType: 'Pure Veg Mess' as any,
    rating: 4.8,
    reviewCount: 45,
    monthlyFee: 3000,
    quarterlyFee: 8500,
    semesterFee: 13800,
    capacity: 200,
    currentOccupancy: 120,
    contactPerson: '',
    contactPhone: '',
    description: '',
    todaysSpecialText: 'Special Thali, Sweet Dish, Fresh Salad',
    tagsText: 'Hygienic Kitchen, RO UV Water, Quick QR Entry',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600',
  });

  // Modal States
  const [addMenuModalOpen, setAddMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  const [addAnnounceModalOpen, setAddAnnounceModalOpen] = useState(false);
  const [complaintResponseModalOpen, setComplaintResponseModalOpen] = useState(false);
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyStatus, setReplyStatus] = useState<any>('Resolved');

  // Form States
  const [menuForm, setMenuForm] = useState({
    day: 'Monday' as DayOfWeek,
    mealType: 'Lunch' as MealType,
    itemsText: '',
    calories: 550,
    dietaryTagsText: 'Veg',
    timing: '12:30 PM - 02:30 PM',
    special: false,
  });

  const [annForm, setAnnForm] = useState({
    title: '',
    content: '',
    category: 'Important' as any,
    isPinned: false,
  });

  // Filters
  const [studentSearch, setStudentSearch] = useState('');
  const [rosterSearch, setRosterSearch] = useState('');
  const [complaintFilterStatus, setComplaintFilterStatus] = useState('All');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [
        statsData, 
        menuData, 
        regData, 
        stuData, 
        cmpData, 
        fbData, 
        annData, 
        settData,
        messData
      ] = await Promise.all([
        adminService.getDashboardStats(),
        menuService.getWeeklyMenu(),
        mealService.getRegistrations(),
        adminService.getStudents(),
        complaintService.getComplaints(),
        feedbackService.getFeedback(),
        announcementService.getAnnouncements(),
        adminService.getSettings(),
        messService.getMessProviders(),
      ]);

      setStats(statsData);
      setWeeklyMenu(menuData);
      setRegistrations(regData);
      setStudents(stuData);
      setComplaints(cmpData);
      setFeedbacks(fbData);
      setAnnouncements(annData);
      setSettings(settData);
      setMessProviders(messData || []);
    } catch {
      showToast('Error syncing admin records', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Menu Handlers
  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const items = menuForm.itemsText.split(',').map(s => s.trim()).filter(Boolean);
    const dietaryTags = menuForm.dietaryTagsText.split(',').map(s => s.trim()).filter(Boolean);

    try {
      if (editingMenuItem) {
        const updated = await menuService.updateMenuItem(editingMenuItem.id, {
          day: menuForm.day,
          mealType: menuForm.mealType,
          items,
          calories: Number(menuForm.calories),
          dietaryTags,
          timing: menuForm.timing,
          special: menuForm.special,
        });
        setWeeklyMenu(weeklyMenu.map(m => m.id === editingMenuItem.id ? updated : m));
        showToast('Menu item updated successfully!', 'success');
      } else {
        const created = await menuService.addMenuItem({
          day: menuForm.day,
          mealType: menuForm.mealType,
          items,
          calories: Number(menuForm.calories),
          dietaryTags,
          timing: menuForm.timing,
          special: menuForm.special,
        });
        setWeeklyMenu([...weeklyMenu, created]);
        showToast('New menu item added!', 'success');
      }
      setAddMenuModalOpen(false);
      setEditingMenuItem(null);
    } catch {
      showToast('Error saving menu item', 'error');
    }
  };

  const handleDeleteMenuClick = (id: string) => {
    setSelectedDeleteId(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDeleteMenu = async () => {
    if (!selectedDeleteId) return;
    try {
      await menuService.deleteMenuItem(selectedDeleteId);
      setWeeklyMenu(weeklyMenu.filter(m => m.id !== selectedDeleteId));
      showToast('Menu item deleted', 'info');
    } catch {
      showToast('Error deleting item', 'error');
    }
  };

  // Complaint Response Handler
  const handleOpenComplaintReply = (cmp: Complaint) => {
    setActiveComplaint(cmp);
    setReplyText(cmp.adminResponse || '');
    setReplyStatus(cmp.status);
    setComplaintResponseModalOpen(true);
  };

  const handleSaveComplaintReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaint) return;
    try {
      const updated = await complaintService.updateComplaintStatus(activeComplaint.id, replyStatus, replyText);
      setComplaints(complaints.map(c => c.id === activeComplaint.id ? updated : c));
      setComplaintResponseModalOpen(false);
      showToast('Complaint response recorded!', 'success');
    } catch {
      showToast('Error updating complaint', 'error');
    }
  };

  // Announcement Handler
  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await announcementService.createAnnouncement({
        title: annForm.title,
        content: annForm.content,
        category: annForm.category,
        isPinned: annForm.isPinned,
        author: 'Hostel Warden Office',
      });
      setAnnouncements([created, ...announcements]);
      setAddAnnounceModalOpen(false);
      setAnnForm({ title: '', content: '', category: 'Important', isPinned: false });
      showToast('Announcement posted to student portals!', 'success');
    } catch {
      showToast('Error posting announcement', 'error');
    }
  };

  // Mess Provider Handlers
  const handleSaveMessProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    const todaysSpecial = messForm.todaysSpecialText.split(',').map(s => s.trim()).filter(Boolean);
    const tags = messForm.tagsText.split(',').map(s => s.trim()).filter(Boolean);

    try {
      if (editingMess) {
        const updated = await messService.updateMessProvider(editingMess.id, {
          ...messForm,
          todaysSpecial,
          tags
        });
        setMessProviders(messProviders.map(m => m.id === updated.id ? updated : m));
        showToast('Mess Card updated successfully!', 'success');
      } else {
        const created = await messService.createMessProvider({
          ...messForm,
          todaysSpecial,
          tags,
          features: ['Pure Hygiene', 'RO UV Water', 'Daily Special Menu']
        });
        setMessProviders([...messProviders, created]);
        showToast('New Mess Card published and visible on Select & Pay Mess!', 'success');
      }
      setMessModalOpen(false);
    } catch {
      showToast('Failed to save mess card details', 'error');
    }
  };

  const handleDeleteMess = async (id: string) => {
    try {
      await messService.deleteMessProvider(id);
      setMessProviders(messProviders.filter(m => m.id !== id));
      showToast('Mess Card removed', 'info');
    } catch {
      showToast('Failed to delete mess card', 'error');
    }
  };

  // Settings Handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await adminService.updateSettings(settings);
      setSettings(updated);
      showToast('System configuration saved!', 'success');
    } catch {
      showToast('Error saving settings', 'error');
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    (s.rollNo && s.rollNo.toLowerCase().includes(studentSearch.toLowerCase())) ||
    s.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredComplaints = complaints.filter(c => {
    if (complaintFilterStatus === 'All') return true;
    return c.status === complaintFilterStatus;
  });

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} role="admin" />

      {/* Main Admin Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Admin Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Mess Administrative Dashboard
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hostel Dining Management & Quality Operations Control
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingMenuItem(null);
                setMenuForm({
                  day: 'Monday',
                  mealType: 'Lunch',
                  itemsText: '',
                  calories: 550,
                  dietaryTagsText: 'Veg',
                  timing: '12:30 PM - 02:30 PM',
                  special: false,
                });
                setAddMenuModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Menu Item
            </button>
            <button
              onClick={() => setAddAnnounceModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5"
            >
              <Megaphone className="w-4 h-4 text-emerald-600" /> Post Notice
            </button>
          </div>
        </div>

        {loading && <LoadingSpinner text="Syncing admin records..." />}

        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold">Total Students</span>
                  <Users className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalStudents}</p>
                <p className="text-[11px] text-emerald-600 font-semibold">Active Mess Subscriptions</p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold">Today Registrations</span>
                  <Utensils className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.todayRegistrations}</p>
                <p className="text-[11px] text-slate-500 font-medium">Headcount forecast</p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold">Meals Served Today</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.mealsServedToday}</p>
                <p className="text-[11px] text-emerald-600 font-semibold">91% Turnout</p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold">Pending Complaints</span>
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                </div>
                <p className="text-2xl font-black text-rose-600 dark:text-rose-400">{stats.pendingComplaints}</p>
                <p className="text-[11px] text-rose-500 font-medium">Requires response</p>
              </div>
            </div>

            {/* Quick Overview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Complaints Widget */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                    Recent Issues Logged
                  </h3>
                  <button
                    onClick={() => setActiveTab('complaints-manage')}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Manage All ({complaints.length})
                  </button>
                </div>

                <div className="space-y-3">
                  {complaints.slice(0, 3).map((cmp) => (
                    <div key={cmp.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-900 dark:text-white">{cmp.title}</span>
                        <Badge variant={cmp.status === 'Resolved' ? 'emerald' : 'amber'} size="sm">
                          {cmp.status}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{cmp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback Summary */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    Mess Quality Score
                  </h3>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    4.8 ★ Avg Rating
                  </span>
                </div>

                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-2">
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    Food Waste Reduction Progress: +24.5%
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    Automated opt-outs reduced raw ingredient wastage by 38 kg per week in hostel Block-A & B dining rooms.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: MENU MANAGEMENT */}
        {activeTab === 'menu-manage' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Weekly Menu Master
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Add, edit, or delete scheduled meal dishes for all 7 days
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingMenuItem(null);
                  setAddMenuModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md"
              >
                + Add Dish
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weeklyMenu.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        {item.day} • {item.mealType}
                      </span>
                      <p className="text-[11px] text-slate-400">{item.timing}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingMenuItem(item);
                          setMenuForm({
                            day: item.day,
                            mealType: item.mealType,
                            itemsText: item.items.join(', '),
                            calories: item.calories,
                            dietaryTagsText: item.dietaryTags.join(', '),
                            timing: item.timing,
                            special: !!item.special,
                          });
                          setAddMenuModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMenuClick(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {item.items.map((dish, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs text-slate-700 dark:text-slate-300">
                        {dish}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: REGISTRATION ROSTER */}
        {activeTab === 'meal-roster' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Meal Registration Headcount Roster
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live headcount counts for kitchen inventory preparation
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="px-6 py-3.5">Student Name</th>
                    <th className="px-6 py-3.5">Roll No</th>
                    <th className="px-6 py-3.5">Meal Type</th>
                    <th className="px-6 py-3.5">Token Code</th>
                    <th className="px-6 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {registrations.map((r) => (
                    <tr key={r.id}>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{r.studentName}</td>
                      <td className="px-6 py-4 text-slate-500">{r.rollNo}</td>
                      <td className="px-6 py-4 font-semibold">{r.mealType}</td>
                      <td className="px-6 py-4 font-mono font-bold text-emerald-600">{r.tokenCode}</td>
                      <td className="px-6 py-4">
                        <Badge variant={r.status === 'Attended' ? 'emerald' : 'amber'}>
                          {r.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: STUDENT DIRECTORY */}
        {activeTab === 'students' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Student Directory
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage hostel meal subscribers and dietary preferences
                </p>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search student or roll no..."
                  className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium w-full sm:w-64"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredStudents.map((stu) => {
                const initials = stu.name
                  ? stu.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                  : 'ST';
                return (
                  <div key={stu.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      {stu.avatar ? (
                        <img
                          src={stu.avatar}
                          alt={stu.name}
                          className="w-10 h-10 rounded-xl object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                          {initials}
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{stu.name}</h4>
                        <p className="text-xs text-slate-500">{stu.rollNo} • {stu.hostelBlock}</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-500">
                      <span>Preference: <strong className="text-emerald-600">{stu.foodPreference}</strong></span>
                      <span>Room {stu.roomNo}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: ANNOUNCEMENTS MANAGEMENT */}
        {activeTab === 'announcements-manage' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Announcements & Notices
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Broadcast notices regarding special menus or maintenance
                </p>
              </div>
              <button
                onClick={() => setAddAnnounceModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow"
              >
                + Create Notice
              </button>
            </div>

            <div className="space-y-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-600">{ann.category}</span>
                    <button
                      onClick={async () => {
                        await announcementService.deleteAnnouncement(ann.id);
                        setAnnouncements(announcements.filter(a => a.id !== ann.id));
                        showToast('Notice deleted', 'info');
                      }}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                  <h3 className="text-sm font-bold">{ann.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: COMPLAINTS MANAGEMENT */}
        {activeTab === 'complaints-manage' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Student Complaints Management
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Review issues submitted by students and record official resolutions
              </p>
            </div>

            <div className="space-y-4">
              {filteredComplaints.map((cmp) => (
                <div key={cmp.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{cmp.title}</h4>
                      <p className="text-xs text-slate-500">By {cmp.studentName} ({cmp.hostelBlock})</p>
                    </div>
                    <button
                      onClick={() => handleOpenComplaintReply(cmp)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                    >
                      Respond & Resolve
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{cmp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: FEEDBACK INSIGHTS */}
        {activeTab === 'feedback-manage' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Feedback & Quality Analytics
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Student ratings and sentiment distribution
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feedbacks.map((fb) => (
                <div key={fb.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold">{fb.studentName} • {fb.mealType}</span>
                    <span className="text-amber-400 font-bold">{fb.rating} ★</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{fb.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: REPORTS & ANALYTICS */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Reports & Food Waste Reduction Metrics
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Monthly meal consumption breakdown and efficiency reports
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-2">
                <p className="text-xs text-slate-400 font-bold uppercase">Average Turnout</p>
                <p className="text-3xl font-black text-emerald-600">91.2%</p>
                <p className="text-xs text-slate-500">Highest on Wednesday & Saturday</p>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-2">
                <p className="text-xs text-slate-400 font-bold uppercase">Estimated Waste Reduction</p>
                <p className="text-3xl font-black text-emerald-600">24.5%</p>
                <p className="text-xs text-slate-500">Savings: ~₹38,000 / month</p>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-2">
                <p className="text-xs text-slate-400 font-bold uppercase">Top Rated Dish</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">Paneer Butter Masala</p>
                <p className="text-xs text-emerald-600 font-bold">4.95 ★ Rating</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB: MESS CARDS & LISTINGS */}
        {activeTab === 'mess-cards' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Store className="w-5 h-5 text-emerald-600" /> Mess Cards & Partner Listings
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage registered Mess Providers appearing on the "Select & Pay Mess" page
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingMess(null);
                  setMessForm({
                    name: '',
                    providerCompany: '',
                    location: '',
                    cuisineType: 'Pure Veg Mess',
                    rating: 4.8,
                    reviewCount: 20,
                    monthlyFee: 3000,
                    quarterlyFee: 8500,
                    semesterFee: 13800,
                    capacity: 200,
                    currentOccupancy: 100,
                    contactPerson: '',
                    contactPhone: '',
                    description: '',
                    todaysSpecialText: 'Special Thali, Sweet Dish',
                    tagsText: 'Hygienic Kitchen, Pure Veg',
                    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600'
                  });
                  setMessModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add New Mess Card
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {messProviders.map((m) => (
                <div key={m.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="relative h-40 w-full bg-slate-800">
                      <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-600 text-white font-extrabold text-[10px] rounded-full">
                        {m.cuisineType}
                      </span>
                      <div className="absolute bottom-2 left-3 right-3 text-white">
                        <h3 className="font-black text-sm">{m.name}</h3>
                        <p className="text-[11px] text-slate-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-400" /> {m.location}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="text-xs space-y-1">
                        <p className="font-bold text-slate-700 dark:text-slate-300">{m.providerCompany}</p>
                        <p className="text-[11px] text-slate-500">Contact: {m.contactPerson} ({m.contactPhone})</p>
                      </div>

                      <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
                        <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Pricing Plans</p>
                        <div className="grid grid-cols-3 gap-1 text-[11px] font-bold text-slate-800 dark:text-slate-200">
                          <div>₹{m.monthlyFee}/mo</div>
                          <div>₹{m.quarterlyFee}/qtr</div>
                          <div>₹{m.semesterFee}/sem</div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {m.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800 mt-2 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setEditingMess(m);
                        setMessForm({
                          name: m.name,
                          providerCompany: m.providerCompany,
                          location: m.location,
                          cuisineType: m.cuisineType as any,
                          rating: m.rating,
                          reviewCount: m.reviewCount,
                          monthlyFee: m.monthlyFee,
                          quarterlyFee: m.quarterlyFee,
                          semesterFee: m.semesterFee,
                          capacity: m.capacity,
                          currentOccupancy: m.currentOccupancy,
                          contactPerson: m.contactPerson,
                          contactPhone: m.contactPhone,
                          description: m.description,
                          todaysSpecialText: m.todaysSpecial.join(', '),
                          tagsText: m.tags.join(', '),
                          image: m.image
                        });
                        setMessModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit Card
                    </button>

                    <button
                      onClick={() => handleDeleteMess(m.id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Mess Operational Configuration
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure timing cutoffs, guest meal tariffs, and automated alerts
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 max-w-2xl shadow-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mess Name
                </label>
                <input
                  type="text"
                  value={settings.messName}
                  onChange={(e) => setSettings({ ...settings, messName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Registration Cutoff (Hours)
                  </label>
                  <input
                    type="number"
                    value={settings.registrationCutoffHours}
                    onChange={(e) => setSettings({ ...settings, registrationCutoffHours: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Guest Meal Tariff (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.guestMealPrice}
                    onChange={(e) => setSettings({ ...settings, guestMealPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save System Settings
              </button>
            </form>
          </div>
        )}

      </main>

      {/* Add / Edit Menu Item Modal */}
      <Modal
        isOpen={addMenuModalOpen}
        onClose={() => setAddMenuModalOpen(false)}
        title={editingMenuItem ? 'Edit Scheduled Menu' : 'Add New Menu Item'}
        maxWidth="md"
      >
        <form onSubmit={handleSaveMenuItem} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Day</label>
              <select
                value={menuForm.day}
                onChange={(e) => setMenuForm({ ...menuForm, day: e.target.value as DayOfWeek })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Meal Type</label>
              <select
                value={menuForm.mealType}
                onChange={(e) => setMenuForm({ ...menuForm, mealType: e.target.value as MealType })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
              >
                {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Dish Items (Comma Separated)
            </label>
            <input
              type="text"
              required
              value={menuForm.itemsText}
              onChange={(e) => setMenuForm({ ...menuForm, itemsText: e.target.value })}
              placeholder="Paneer Butter Masala, Dal Tadka, Jeera Rice, Chapati"
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Calories (kcal)</label>
              <input
                type="number"
                value={menuForm.calories}
                onChange={(e) => setMenuForm({ ...menuForm, calories: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Serving Timing</label>
              <input
                type="text"
                value={menuForm.timing}
                onChange={(e) => setMenuForm({ ...menuForm, timing: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow hover:bg-emerald-700"
          >
            Save Menu Item
          </button>
        </form>
      </Modal>

      {/* Post Notice Modal */}
      <Modal
        isOpen={addAnnounceModalOpen}
        onClose={() => setAddAnnounceModalOpen(false)}
        title="Post Mess Notice"
        maxWidth="md"
      >
        <form onSubmit={handleSaveAnnouncement} className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1">Notice Title</label>
            <input
              type="text"
              required
              value={annForm.title}
              onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
              placeholder="e.g. Festival Feast Timings"
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Notice Content</label>
            <textarea
              rows={3}
              required
              value={annForm.content}
              onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
            />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs">
            Publish Notice
          </button>
        </form>
      </Modal>

      {/* Reply Complaint Modal */}
      <Modal
        isOpen={complaintResponseModalOpen}
        onClose={() => setComplaintResponseModalOpen(false)}
        title={`Respond to Complaint #${activeComplaint?.id}`}
        maxWidth="md"
      >
        <form onSubmit={handleSaveComplaintReply} className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1">Update Status</label>
            <select
              value={replyStatus}
              onChange={(e) => setReplyStatus(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
            >
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Resolution Response to Student</label>
            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Detail action taken (e.g. Technician dispatched)..."
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
            />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs">
            Save & Notify Student
          </button>
        </form>
      </Modal>

      {/* Create / Edit Mess Card Modal */}
      <Modal
        isOpen={messModalOpen}
        onClose={() => setMessModalOpen(false)}
        title={editingMess ? 'Edit Mess Card Details' : 'Register New Mess Card'}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveMessProvider} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1">Mess / Hall Name *</label>
              <input
                type="text"
                required
                value={messForm.name}
                onChange={(e) => setMessForm({ ...messForm, name: e.target.value })}
                placeholder="e.g. Apex Central Veg Mess"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Caterer Company</label>
              <input
                type="text"
                value={messForm.providerCompany}
                onChange={(e) => setMessForm({ ...messForm, providerCompany: e.target.value })}
                placeholder="e.g. Apex Hospitality Services"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1">Location *</label>
              <input
                type="text"
                required
                value={messForm.location}
                onChange={(e) => setMessForm({ ...messForm, location: e.target.value })}
                placeholder="e.g. Hostel Block C"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Cuisine Type *</label>
              <select
                value={messForm.cuisineType}
                onChange={(e) => setMessForm({ ...messForm, cuisineType: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
              >
                <option value="Pure Veg Mess">Pure Veg Mess 🥗</option>
                <option value="North Indian">North Indian 🥘</option>
                <option value="South Indian">South Indian 🍛</option>
                <option value="Multi-Cuisine Special">Multi-Cuisine Special 🍱</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Capacity</label>
              <input
                type="number"
                value={messForm.capacity}
                onChange={(e) => setMessForm({ ...messForm, capacity: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Monthly Fee (₹)</label>
              <input
                type="number"
                value={messForm.monthlyFee}
                onChange={(e) => setMessForm({ ...messForm, monthlyFee: Number(e.target.value) })}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Quarterly Fee (₹)</label>
              <input
                type="number"
                value={messForm.quarterlyFee}
                onChange={(e) => setMessForm({ ...messForm, quarterlyFee: Number(e.target.value) })}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Semester Fee (₹)</label>
              <input
                type="number"
                value={messForm.semesterFee}
                onChange={(e) => setMessForm({ ...messForm, semesterFee: Number(e.target.value) })}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1">Contact Person</label>
              <input
                type="text"
                value={messForm.contactPerson}
                onChange={(e) => setMessForm({ ...messForm, contactPerson: e.target.value })}
                placeholder="Ramesh Kumar (Supervisor)"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Contact Phone</label>
              <input
                type="text"
                value={messForm.contactPhone}
                onChange={(e) => setMessForm({ ...messForm, contactPhone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Mess Banner Image URL</label>
            <input
              type="text"
              value={messForm.image}
              onChange={(e) => setMessForm({ ...messForm, image: e.target.value })}
              placeholder="https://..."
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1">Description</label>
              <textarea
                rows={2}
                value={messForm.description}
                onChange={(e) => setMessForm({ ...messForm, description: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Special Items (Comma-separated)</label>
              <textarea
                rows={2}
                value={messForm.todaysSpecialText}
                onChange={(e) => setMessForm({ ...messForm, todaysSpecialText: e.target.value })}
                placeholder="e.g. Paneer Butter Masala, Gulab Jamun"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
              />
            </div>
          </div>

          <button type="submit" className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md">
            {editingMess ? 'Update Mess Card' : '🚀 Save & Publish Mess Card'}
          </button>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDeleteMenu}
        title="Delete Menu Item"
        message="Are you sure you want to delete this menu dish item from the weekly matrix?"
      />

    </div>
  );
};
