import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { QrCode, ShieldCheck, Phone, Mail, MapPin, Hash, Save, User as UserIcon, CheckCircle2, Upload, Camera, Trash2, Link as LinkIcon } from 'lucide-react';
import { Footer } from '../components/layouts/Footer';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    hostelBlock: user?.hostelBlock || 'Block-B',
    address: user?.address || 'Room B-304, Boys Hostel Block-B, University North Campus, Delhi - 110007',
    rollNo: user?.rollNo || '2023CS108',
    foodPreference: user?.foodPreference || 'Veg',
    avatar: user?.avatar || '',
  });

  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return 'ST';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (JPG, PNG, WEBP)', 'error');
        return;
      }
      if (file.size > 3 * 1024 * 1024) {
        showToast('Image size must be under 3MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => ({ ...prev, avatar: reader.result as string }));
          showToast('Photo selected! Click "Save Profile Details" to apply.', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      setFormData(prev => ({ ...prev, avatar: urlInput.trim() }));
      setUrlInput('');
      setShowUrlInput(false);
      showToast('Image URL loaded! Click "Save Profile Details" to apply.', 'success');
    }
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({ ...prev, avatar: '' }));
    showToast('Photo removed. Digital Monogram ID badge will be used.', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData as any);
    showToast('Profile information and address updated successfully!', 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Header Title */}
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            User Account & Mess ID Profile
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your resident address credentials, student identity, photo, and dining dietary preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Digital Mess Card Preview */}
          <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white p-6 rounded-3xl border border-slate-800 shadow-2xl flex flex-col items-center text-center space-y-5 relative overflow-hidden">
            
            {/* Top ID Card Header Bar */}
            <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Mess ID Pass
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                VERIFIED
              </span>
            </div>

            {/* Photo or Monogram Badge */}
            <div className="relative group">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt={formData.name || user?.name}
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-emerald-500/40 shadow-xl"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-[0_0_25px_rgba(16,185,129,0.35)] ring-4 ring-emerald-500/20">
                  {getInitials(formData.name || user?.name)}
                </div>
              )}

              {/* Quick photo upload icon overlay */}
              <label
                title="Upload/Change Photo"
                className="absolute -bottom-1 -right-1 p-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl cursor-pointer shadow-lg transition-transform hover:scale-110 active:scale-95"
              >
                <Camera className="w-3.5 h-3.5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-1 w-full px-2">
              <h3 className="text-lg font-black text-white">{formData.name || user?.name}</h3>
              <p className="text-xs font-mono text-emerald-400 font-bold">{formData.rollNo || user?.rollNo}</p>
              <div className="flex items-start justify-center gap-1.5 text-xs text-slate-400 mt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                  {formData.address || user?.address || 'University North Campus, Delhi'}
                </p>
              </div>
            </div>

            {/* QR Pass */}
            <div className="p-3.5 bg-white rounded-2xl shadow-md">
              <QrCode className="w-24 h-24 text-slate-900" />
            </div>

            <div className="w-full space-y-1 text-center">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-300 rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Active Student Pass
              </span>
              <p className="text-[10px] text-slate-400 font-medium">Dietary: {formData.foodPreference}</p>
            </div>
          </div>

          {/* Profile Edit Form & Photo Manager */}
          <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            
            {/* Photo Upload Card Section */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Camera className="w-4 h-4 text-emerald-500" />
                    Student Profile Photo (Optional)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Upload your picture for ID verification or leave empty to use Digital Monogram
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>URL</span>
                  </button>

                  {formData.avatar && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold border border-rose-500/20 transition-colors"
                      title="Remove custom photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>

              {/* URL Input dropdown if toggled */}
              {showUrlInput && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 animate-fadeIn">
                  <input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Account & Resident Credentials
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Update your contact details, residential address, and dining preferences
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Address Field replacing Room No */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  Residential / Hostel Address
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Room B-304, Boys Hostel Block-B, University North Campus, Delhi - 110007"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Contact
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Dietary Food Preference
                </label>
                <select
                  value={formData.foodPreference}
                  onChange={(e) => setFormData({ ...formData, foodPreference: e.target.value as any })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                >
                  <option value="Veg">Vegetarian 🥗</option>
                  <option value="Non-Veg">Non-Vegetarian 🍗</option>
                  <option value="Jain">Jain Pure Veg 🌿</option>
                </select>
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Profile Details
              </button>
            </form>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

