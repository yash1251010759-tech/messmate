import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sidebar } from '../components/layouts/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  menuService, 
  mealService, 
  complaintService, 
  feedbackService, 
  announcementService,
  messService 
} from '../services/api';
import { MenuItem, MealRegistration, Complaint, FeedbackItem, Announcement, MealType, DayOfWeek, MessProvider } from '../types';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Pagination } from '../components/ui/Pagination';
import { 
  Utensils, 
  Calendar, 
  Clock, 
  Star, 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Bell, 
  Send, 
  Search, 
  Download, 
  Plus, 
  MessageSquare,
  Sparkles,
  Award,
  Building,
  CreditCard,
  Phone,
  MapPin,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('today-menu');
  const [loading, setLoading] = useState(false);

  // Allotted Mess Provider details state
  const [allottedMessDetail, setAllottedMessDetail] = useState<MessProvider | null>(null);

  // Data States
  const [todayMenu, setTodayMenu] = useState<MenuItem[]>([]);
  const [weeklyMenu, setWeeklyMenu] = useState<MenuItem[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [registrations, setRegistrations] = useState<MealRegistration[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // QR Pass Modal
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [activePass, setActivePass] = useState<{ meal: string; code: string } | null>(null);

  // Complaint Form State
  const [newComplaint, setNewComplaint] = useState({
    title: '',
    category: 'Food Quality',
    priority: 'Medium',
    description: '',
  });

  // Feedback Form State
  const [newFeedback, setNewFeedback] = useState({
    mealType: 'Lunch' as MealType,
    rating: 5,
    selectedTags: [] as string[],
    comment: '',
  });

  // Filters & Search
  const [historySearch, setHistorySearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const availableTags = ['Tasty & Fresh', 'Hot Food', 'Hygienic', 'Generous Portion', 'Needs Salt', 'Cold Food', 'Slow Refill'];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [todayData, weeklyData, regData, cmpData, fbData, annData] = await Promise.all([
        menuService.getTodayMenu(),
        menuService.getWeeklyMenu(),
        mealService.getRegistrations(),
        complaintService.getComplaints(),
        feedbackService.getFeedback(),
        announcementService.getAnnouncements(),
      ]);

      setTodayMenu(todayData);
      setWeeklyMenu(weeklyData);
      setRegistrations(regData);
      setComplaints(cmpData);
      setFeedbacks(fbData);
      setAnnouncements(annData);

      // Fetch allotted mess provider details
      const currentMessId = user?.allottedMessId || 'mess_101';
      try {
        const messInfo = await messService.getMessProviderById(currentMessId);
        setAllottedMessDetail(messInfo);
      } catch {
        // Fallback
      }
    } catch {
      showToast('Error syncing dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRegistration = async (mealType: MealType, currentStatus: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newStatus = currentStatus === 'Registered' ? 'Opted Out' : 'Registered';
    try {
      const updated = await mealService.toggleMealRegistration(today, mealType, newStatus);
      setRegistrations(prev => {
        const index = prev.findIndex(r => r.mealType === mealType && r.date === today);
        if (index !== -1) {
          const next = [...prev];
          next[index] = updated;
          return next;
        }
        return [...prev, updated];
      });
      showToast(`Updated ${mealType} status to ${newStatus}`, 'success');
    } catch {
      showToast('Could not update registration status', 'error');
    }
  };

  const handleOpenQRModal = (meal: string, code: string) => {
    setActivePass({ meal, code });
    setQrModalOpen(true);
  };

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComplaint.title || !newComplaint.description) {
      showToast('Please provide a title and description.', 'warning');
      return;
    }

    try {
      const created = await complaintService.createComplaint(newComplaint);
      setComplaints([created, ...complaints]);
      setNewComplaint({ title: '', category: 'Food Quality', priority: 'Medium', description: '' });
      showToast('Complaint submitted successfully! Warden team notified.', 'success');
    } catch {
      showToast('Error submitting complaint', 'error');
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await feedbackService.submitFeedback({
        mealType: newFeedback.mealType,
        rating: newFeedback.rating,
        tags: newFeedback.selectedTags,
        comment: newFeedback.comment,
      });
      setFeedbacks([created, ...feedbacks]);
      setNewFeedback({ mealType: 'Lunch', rating: 5, selectedTags: [], comment: '' });
      showToast('Thank you for rating today’s meal!', 'success');
    } catch {
      showToast('Error submitting feedback', 'error');
    }
  };

  const daysList: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const filteredHistory = registrations.filter(r => 
    r.mealType.toLowerCase().includes(historySearch.toLowerCase()) ||
    r.date.includes(historySearch) ||
    r.tokenCode.toLowerCase().includes(historySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} role="student" />

      {/* Main Content Dashboard Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Top Student Header Card */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-14 h-14 rounded-2xl object-cover ring-4 ring-white/30 shrink-0 shadow-lg"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md text-white font-black text-xl flex items-center justify-center ring-4 ring-white/30 shrink-0 shadow-inner">
                {user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'AS'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black">{user?.name}</h1>
                <Badge variant="emerald" size="sm">
                  {user?.foodPreference || 'Veg'}
                </Badge>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                Roll No: <span className="font-bold">{user?.rollNo || '2023CS108'}</span> • {user?.hostelBlock} ({user?.roomNo})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
            <Award className="w-5 h-5 text-amber-300" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">Mess Attendance Rate</p>
              <p className="text-sm font-black text-white">94.2% (26/28 Meals)</p>
            </div>
          </div>
        </div>

        {/* ALLOTTED MESS STATUS BANNER */}
        <div className="bg-white dark:bg-slate-900 border border-emerald-500/30 dark:border-emerald-500/30 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
                <Building className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    Allotted Dining Hall
                  </span>
                  <Badge variant="emerald" size="sm">
                    {user?.subscriptionStatus === 'Active' ? 'Active Subscription' : 'Allotted'}
                  </Badge>
                </div>

                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  {allottedMessDetail?.name || user?.allottedMessName || 'Royal North Central Mess'}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    {allottedMessDetail?.location || 'Central Dining Block A'}
                  </span>
                  <span>•</span>
                  <span className="font-medium">
                    Caterer: <strong>{allottedMessDetail?.providerCompany || 'Royal Hospitality Services'}</strong>
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Valid Until: {user?.subscriptionValidUntil || '2026-09-30'}
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                onClick={() => navigate('/select-mess')}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5 transition-all"
              >
                <CreditCard className="w-4 h-4" />
                Change / Select Mess
              </button>
            </div>

          </div>
        </div>

        {loading && <LoadingSpinner text="Fetching latest mess records..." />}

        {/* TAB 1: TODAY'S MENU */}
        {activeTab === 'today-menu' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Today's Dining Schedule
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select a meal to view ingredients or show your digital QR pass at the serving counter
                </p>
              </div>
              <Badge variant="emerald">Live Kitchen Status: Open</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {todayMenu.map((meal) => {
                const reg = registrations.find(r => r.mealType === meal.mealType);
                const isRegistered = reg?.status === 'Registered' || reg?.status === 'Attended';
                const tokenCode = reg?.tokenCode || `MM-${meal.mealType.substring(0, 2).toUpperCase()}-9102`;

                return (
                  <div
                    key={meal.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/80 rounded-2xl text-emerald-600 dark:text-emerald-400">
                          <Utensils className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            {meal.mealType}
                          </h3>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {meal.timing}
                          </p>
                        </div>
                      </div>

                      <Badge variant={isRegistered ? 'emerald' : 'amber'}>
                        {reg?.status || 'Opted In'}
                      </Badge>
                    </div>

                    {/* Meal Items List */}
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Dish Menu Items
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {meal.items.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Info & Actions */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-semibold text-slate-500">{meal.calories} kcal</span>
                        <div className="flex items-center gap-1 font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {meal.rating}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleRegistration(meal.mealType, reg?.status || 'Registered')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                            isRegistered
                              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100'
                              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100'
                          }`}
                        >
                          {isRegistered ? 'Opt Out' : 'Opt In'}
                        </button>
                        <button
                          onClick={() => handleOpenQRModal(meal.mealType, tokenCode)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          Pass QR
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: WEEKLY SCHEDULE */}
        {activeTab === 'weekly-menu' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Weekly Mess Menu Matrix
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select any day below to inspect full breakfast, lunch, snacks, and dinner offerings
                </p>
              </div>

              <button
                onClick={() => showToast('Weekly menu PDF downloaded!', 'info')}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                Download Menu PDF
              </button>
            </div>

            {/* Day Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {daysList.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                    selectedDay === day
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Menu Items for Selected Day */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weeklyMenu
                .filter(m => m.day === selectedDay)
                .map((meal) => (
                  <div
                    key={meal.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <Utensils className="w-4 h-4 text-emerald-600" />
                        {meal.mealType}
                      </span>
                      <span className="text-xs text-slate-400">{meal.timing}</span>
                    </div>

                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      {meal.items.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
                      <span>{meal.calories} kcal</span>
                      <div className="flex gap-1">
                        {meal.dietaryTags.map((tag, tIdx) => (
                          <Badge key={tIdx} variant="slate" size="sm">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: MEAL REGISTRATION */}
        {activeTab === 'meal-registration' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Upcoming Meal Registrations
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage your meal opt-ins at least 3 hours prior to meal timing to ensure accurate kitchen preparation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(['Breakfast', 'Lunch', 'Dinner'] as MealType[]).map((mType) => {
                const reg = registrations.find(r => r.mealType === mType);
                const isRegistered = reg?.status !== 'Opted Out';

                return (
                  <div
                    key={mType}
                    className={`p-6 rounded-3xl border transition-all space-y-4 ${
                      isRegistered
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {mType}
                      </h3>
                      <Badge variant={isRegistered ? 'emerald' : 'rose'}>
                        {isRegistered ? 'Opted In' : 'Opted Out'}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isRegistered
                        ? 'You are currently listed in the kitchen headcount roster for this meal.'
                        : 'You have opted out. No food portion will be allocated.'}
                    </p>

                    <button
                      onClick={() => handleToggleRegistration(mType, reg?.status || 'Registered')}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all ${
                        isRegistered
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {isRegistered ? 'Cancel Registration' : 'Opt-In for Meal'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: MEAL HISTORY & ATTENDANCE */}
        {activeTab === 'meal-history' || activeTab === 'attendance' ? (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Meal Attendance & Pass Tokens
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  History of verified token check-ins and meal pass redemptions
                </p>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Search token code or date..."
                  className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-64"
                />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5">Date</th>
                      <th className="px-6 py-3.5">Meal Type</th>
                      <th className="px-6 py-3.5">Token Pass</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">QR Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredHistory.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{reg.date}</td>
                        <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">{reg.mealType}</td>
                        <td className="px-6 py-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">{reg.tokenCode}</td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={
                              reg.status === 'Attended' ? 'emerald' :
                              reg.status === 'Registered' ? 'blue' : 'rose'
                            }
                          >
                            {reg.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleOpenQRModal(reg.mealType, reg.tokenCode)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 inline-flex items-center gap-1"
                          >
                            <QrCode className="w-3.5 h-3.5" /> Show QR
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredHistory.length === 0 && (
                <EmptyState
                  title="No Meal Records Found"
                  description="No meal check-in history matches your search filter."
                />
              )}
            </div>
          </div>
        ) : null}

        {/* TAB 5: ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Mess Notices & Feasts
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official notices broadcasted by the Hostel Warden and Catering Committee
              </p>
            </div>

            <div className="space-y-4">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className={`p-6 rounded-3xl border transition-all ${
                    ann.isPinned
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <Bell className="w-4 h-4" /> {ann.category}
                    </span>
                    <span className="text-[11px] text-slate-400">{ann.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {ann.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {ann.content}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-400">
                    Posted by: <span className="text-slate-700 dark:text-slate-300">{ann.author}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: FEEDBACK & RATINGS */}
        {activeTab === 'feedback' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Meal Quality Feedback
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Rate today's food quality to help the catering team improve daily dishes
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Submission Form */}
              <form onSubmit={handleSubmitFeedback} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Leave Rating for Recent Meal
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Meal Type
                  </label>
                  <select
                    value={newFeedback.mealType}
                    onChange={(e) => setNewFeedback({ ...newFeedback, mealType: e.target.value as MealType })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-bold"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Dinner">Dinner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Overall Rating (1 to 5 Stars)
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewFeedback({ ...newFeedback, rating: star })}
                        className={`p-2 rounded-xl transition-all ${
                          newFeedback.rating >= star
                            ? 'text-amber-400 scale-110'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Select Feedback Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableTags.map((tag) => {
                      const isSel = newFeedback.selectedTags.includes(tag);
                      return (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => {
                            const tags = isSel
                              ? newFeedback.selectedTags.filter(t => t !== tag)
                              : [...newFeedback.selectedTags, tag];
                            setNewFeedback({ ...newFeedback, selectedTags: tags });
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            isSel
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Additional Comments
                  </label>
                  <textarea
                    rows={3}
                    value={newFeedback.comment}
                    onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
                    placeholder="Tell us what was great or how to improve seasoning..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Submit Feedback
                </button>
              </form>

              {/* Feedbacks Stream */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Community Feedback Activity
                </h3>
                {feedbacks.map((fb) => (
                  <div key={fb.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{fb.studentName} ({fb.mealType})</span>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" /> {fb.rating}.0
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{fb.comment}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {fb.tags.map((t, idx) => (
                        <Badge key={idx} variant="emerald" size="sm">{t}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: COMPLAINTS DESK */}
        {activeTab === 'complaints' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Complaints & Issue Tracking Desk
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Log hygiene, equipment, or service complaints directly to the Warden Office
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form */}
              <form onSubmit={handleSubmitComplaint} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm lg:col-span-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  File New Complaint
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Issue Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newComplaint.title}
                    onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
                    placeholder="e.g. Water dispenser lukewarm"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Category
                    </label>
                    <select
                      value={newComplaint.category}
                      onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-bold"
                    >
                      <option value="Food Quality">Food Quality</option>
                      <option value="Hygiene">Hygiene</option>
                      <option value="Timing">Timing</option>
                      <option value="Staff Behavior">Staff Behavior</option>
                      <option value="Equipment">Equipment</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Priority
                    </label>
                    <select
                      value={newComplaint.priority}
                      onChange={(e) => setNewComplaint({ ...newComplaint, priority: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-bold"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Detailed Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={newComplaint.description}
                    onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                    placeholder="Describe the problem, location, and date..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Submit Complaint
                </button>
              </form>

              {/* Status List */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  My Active Complaints & Warden Responses
                </h3>

                {complaints.map((cmp) => (
                  <div
                    key={cmp.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">#{cmp.id}</span>
                        <Badge variant="indigo" size="sm">{cmp.category}</Badge>
                      </div>
                      <Badge
                        variant={
                          cmp.status === 'Resolved' ? 'emerald' :
                          cmp.status === 'In Progress' ? 'amber' : 'rose'
                        }
                      >
                        {cmp.status}
                      </Badge>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{cmp.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{cmp.description}</p>

                    {cmp.adminResponse && (
                      <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs space-y-1">
                        <p className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Warden Office Resolution Response:
                        </p>
                        <p className="text-slate-700 dark:text-slate-300">{cmp.adminResponse}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Student Mess ID Card
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official dining identity credential and dietary preferences
              </p>
            </div>

            <div className="max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user?.name}
                    className="w-24 h-24 rounded-3xl object-cover ring-4 ring-emerald-500/30 shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 font-black text-2xl flex items-center justify-center ring-4 ring-emerald-500/30 shadow-md">
                    {user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'AS'}
                  </div>
                )}
                <div className="text-center sm:text-left space-y-1">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">{user?.name}</h3>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{user?.email}</p>
                  <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{user?.address || 'Room B-304, Boys Hostel Block-B, University Campus, Delhi'}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Roll Number</p>
                  <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{user?.rollNo}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Food Preference</p>
                  <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{user?.foodPreference}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Phone Contact</p>
                  <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{user?.phone}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Digital QR Pass Modal */}
      <Modal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title={`Digital QR Meal Pass (${activePass?.meal})`}
        subtitle="Show this code at the dining hall entry counter"
        maxWidth="sm"
      >
        <div className="flex flex-col items-center text-center space-y-4 py-2">
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xl">
            <QrCode className="w-44 h-44 text-slate-900" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Pass Redemption Code</p>
            <p className="text-2xl font-mono font-black text-emerald-600 dark:text-emerald-400">
              {activePass?.code}
            </p>
          </div>
          <p className="text-xs text-slate-500">
            Token valid for today's {activePass?.meal} service window.
          </p>
          <button
            onClick={() => setQrModalOpen(false)}
            className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs"
          >
            Close Pass
          </button>
        </div>
      </Modal>

    </div>
  );
};
