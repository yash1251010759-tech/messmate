import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  UtensilsCrossed, 
  User, 
  Mail, 
  Lock, 
  Building, 
  Phone, 
  Upload, 
  Image as ImageIcon, 
  DollarSign, 
  Sparkles, 
  ArrowRight,
  Store,
  CheckCircle2
} from 'lucide-react';

const PRESET_IMAGES = [
  {
    name: 'Pure Veg Thali',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'South Indian Feast',
    url: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'North Indian Special',
    url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Modern Dining Pavilion',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600'
  }
];

export const RegisterPage: React.FC = () => {
  const { register, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole = (searchParams.get('role') === 'mess_provider' || searchParams.get('role') === 'admin') 
    ? (searchParams.get('role') as 'mess_provider' | 'admin') 
    : 'student';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    hostelBlock: 'Block-A',
    roomNo: '',
    rollNo: '',
    foodPreference: 'Veg' as 'Veg' | 'Non-Veg' | 'Jain',
    phone: '',
    role: initialRole as 'student' | 'admin' | 'mess_provider',

    // Mess Provider Specific Fields
    messName: '',
    providerCompany: '',
    location: '',
    cuisineType: 'Pure Veg Mess' as 'Pure Veg Mess' | 'North Indian' | 'South Indian' | 'Multi-Cuisine Special',
    monthlyFee: '3000',
    quarterlyFee: '8500',
    semesterFee: '13800',
    capacity: '200',
    description: '',
    todaysSpecial: 'Special Thali, Sweet Dish, Fresh Salad',
    tags: 'Hygienic Kitchen, RO UV Water, Quick QR Entry',
    image: PRESET_IMAGES[0].url,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image file size must be less than 5MB', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
        showToast('Mess image uploaded successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      showToast('Please fill in required fields (Name, Email, Password).', 'warning');
      return;
    }

    if (formData.role === 'mess_provider' && !formData.messName) {
      showToast('Please enter your Mess Name.', 'warning');
      return;
    }

    try {
      if (formData.role === 'mess_provider' || formData.messName) {
        const customMessObj = {
          id: `mess_${Date.now()}`,
          name: formData.messName || `${formData.name}'s Mess`,
          providerCompany: formData.providerCompany || (formData.messName ? `${formData.messName} Catering Services` : 'Campus Dining Services'),
          location: formData.location || 'Hostel Campus Pavilion',
          cuisineType: formData.cuisineType || 'Pure Veg Mess',
          monthlyFee: Number(formData.monthlyFee) || 3000,
          quarterlyFee: Number(formData.quarterlyFee) || 8500,
          semesterFee: Number(formData.semesterFee) || 13800,
          rating: 4.8,
          reviewCount: 15,
          capacity: Number(formData.capacity) || 200,
          activeSubscribers: 1,
          timings: {
            breakfast: '07:30 AM - 09:30 AM',
            lunch: '12:15 PM - 02:30 PM',
            snacks: '05:00 PM - 06:15 PM',
            dinner: '07:30 PM - 09:30 PM',
          },
          contactPerson: formData.name || 'Manager',
          contactPhone: formData.phone || '+91 98765 43210',
          description: formData.description || 'Hygienic and pure campus dining with fresh daily prepared meals.',
          tags: formData.tags ? formData.tags.split(',').map(s => s.trim()).filter(Boolean) : ['Hygienic Kitchen', 'RO UV Water', 'Quick QR Entry'],
          todaysSpecial: formData.todaysSpecial ? formData.todaysSpecial.split(',').map(s => s.trim()).filter(Boolean) : ['Special Thali', 'Sweet Dish', 'Fresh Salad'],
          features: ['QR Pass Entry', 'Hygienic Steam Kitchen', 'RO UV Water Filter', 'Daily Quality Audit'],
          image: formData.image || PRESET_IMAGES[0].url
        };

        const existingLocal = JSON.parse(localStorage.getItem('messmate_custom_messes') || '[]');
        localStorage.setItem('messmate_custom_messes', JSON.stringify([customMessObj, ...existingLocal]));
      }

      await register({
        ...formData,
        monthlyFee: Number(formData.monthlyFee) || 3000,
        quarterlyFee: Number(formData.quarterlyFee) || 8500,
        semesterFee: Number(formData.semesterFee) || 13800,
        capacity: Number(formData.capacity) || 200,
      });

      if (formData.role === 'mess_provider') {
        showToast(`Mess "${formData.messName || 'Your Mess'}" Registered! Your card is now LIVE on Select & Pay Mess page.`, 'success');
        navigate('/select-mess');
      } else if (formData.role === 'admin') {
        showToast('Admin account registered successfully!', 'success');
        navigate('/admin-dashboard');
      } else {
        showToast('Student account created successfully! Welcome to MessMate.', 'success');
        navigate('/student-dashboard');
      }
    } catch {
      showToast('Registration failed. Please try again.', 'error');
    }
  };

  const isProvider = formData.role === 'mess_provider' || formData.role === 'admin';

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-2xl w-full space-y-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-500/20">
            {isProvider ? <Store className="w-6 h-6" /> : <UtensilsCrossed className="w-6 h-6" />}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {isProvider ? 'Register Your Mess Service' : 'Create Student Account'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {isProvider 
              ? 'List your mess, set pricing & menu details to display live on Select & Pay Mess'
              : 'Get instant access to daily meal registrations and digital QR passes'}
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, role: 'student' }))}
            className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              formData.role === 'student'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Student Account</span>
          </button>

          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, role: 'mess_provider' }))}
            className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              formData.role === 'mess_provider'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Mess Provider / Partner</span>
          </button>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* User Account Basics */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Personal Account Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={isProvider ? "e.g. Ramesh Singh (Mess Owner)" : "e.g. Aarav Sharma"}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@domain.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Student Specific Fields */}
          {!isProvider && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" />
                <span>Student Hostel Info</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Hostel Block
                  </label>
                  <select
                    name="hostelBlock"
                    value={formData.hostelBlock}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Block-A">Block-A (Boys)</option>
                    <option value="Block-B">Block-B (Boys)</option>
                    <option value="Block-C">Block-C (Girls)</option>
                    <option value="Block-D">Block-D (PG & Research)</option>
                    <option value="Block-E">Block-E (General)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Room No / Pincode
                  </label>
                  <input
                    type="text"
                    name="roomNo"
                    value={formData.roomNo}
                    onChange={handleChange}
                    placeholder="e.g. B-304"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Roll / Student ID
                  </label>
                  <input
                    type="text"
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleChange}
                    placeholder="e.g. 2023CS108"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mess Provider Specific Details */}
          {isProvider && (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-200/60 dark:border-emerald-800/40 pb-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <Store className="w-4 h-4" />
                  <span>Mess Card Information (Menu Driven)</span>
                </h3>
                <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                  Will appear on Select & Pay
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Mess / Dining Hall Name *
                  </label>
                  <input
                    type="text"
                    name="messName"
                    required={isProvider}
                    value={formData.messName}
                    onChange={handleChange}
                    placeholder="e.g. Apex Central Veg Mess"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Catering / Company Name
                  </label>
                  <input
                    type="text"
                    name="providerCompany"
                    value={formData.providerCompany}
                    onChange={handleChange}
                    placeholder="e.g. Apex Food Services Ltd"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Campus Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Hostel Block-C Pavilion"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Cuisine Type *
                  </label>
                  <select
                    name="cuisineType"
                    value={formData.cuisineType}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  >
                    <option value="Pure Veg Mess">Pure Veg Mess 🥗</option>
                    <option value="North Indian">North Indian 🥘</option>
                    <option value="South Indian">South Indian 🍛</option>
                    <option value="Multi-Cuisine Special">Multi-Cuisine Special 🍱</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Seating Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="200"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Pricing Section */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800/80 space-y-2">
                <label className="block text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Subscription Plans Pricing (₹) *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">Monthly Fee</span>
                    <input
                      type="number"
                      name="monthlyFee"
                      value={formData.monthlyFee}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">Quarterly Fee</span>
                    <input
                      type="number"
                      name="quarterlyFee"
                      value={formData.quarterlyFee}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">Semester Fee</span>
                    <input
                      type="number"
                      name="semesterFee"
                      value={formData.semesterFee}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Description & Special Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Mess Description
                  </label>
                  <textarea
                    name="description"
                    rows={2}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your hygiene standards, food quality, chef experience..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Special Items (Comma-separated)
                  </label>
                  <textarea
                    name="todaysSpecial"
                    rows={2}
                    value={formData.todaysSpecial}
                    onChange={handleChange}
                    placeholder="e.g. Paneer Butter Masala, Gulab Jamun, Basmati Rice"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* IMAGE UPLOAD & PRESETS */}
              <div className="space-y-3 pt-1">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Mess Banner Photo (Upload Image or Select Preset)
                </label>

                {/* Live Preview */}
                {formData.image && (
                  <div className="relative w-full h-36 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-md group">
                    <img 
                      src={formData.image} 
                      alt="Mess Preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 flex items-end p-3 text-white">
                      <span className="text-xs font-bold flex items-center gap-1 bg-emerald-600/90 px-2.5 py-1 rounded-full backdrop-blur-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Card Banner Image Preview
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* File Upload Input */}
                  <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-emerald-400 dark:border-emerald-600/60 bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <Upload className="w-4 h-4" />
                    <span>Upload Image File from Device</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                  </label>

                  {/* Custom URL Input */}
                  <div className="relative">
                    <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="Or paste Image URL..."
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Preset Thumbnails */}
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block mb-1.5">Or Choose Quick Preset Photo:</span>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_IMAGES.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: img.url }))}
                        className={`relative rounded-xl overflow-hidden border-2 h-16 transition-all ${
                          formData.image === img.url ? 'border-emerald-500 ring-2 ring-emerald-500/50 scale-[1.02]' : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[9px] text-white truncate px-1 text-center py-0.5">
                          {img.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            {isLoading ? 'Processing Registration...' : (isProvider ? '🚀 Publish Mess Card & Complete Registration' : 'Complete Registration')}
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              Log in here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

