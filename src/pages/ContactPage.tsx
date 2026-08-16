import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { Footer } from '../components/layouts/Footer';

export const ContactPage: React.FC = () => {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Your message has been sent to the Mess Committee desk!', 'success');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black">Contact Mess Committee Desk</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Reach out to the Chief Warden or Catering Management for inquiries or emergency dining support
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Info Card */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
            <h3 className="text-base font-bold text-emerald-400">Hostel Warden Office</h3>
            
            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>Vishwakarma Institute of Technology, 666, Upper Indiranagar, Bibwewadi, Pune, Maharashtra 411037, India</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <p>+91 xxxxx xxxxx</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <p>messcommittee@campus.edu</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
              <p className="font-bold text-white mb-1">Operational Desk Hours</p>
              <p>Mon - Sun: 08:00 AM to 06:00 PM</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Send Direct Message</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Subject</label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="e.g. Special diet request for medical reasons"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Message Detail *</label>
              <textarea
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Send Inquiry Message
            </button>
          </form>

        </div>
      </main>
      <Footer />
    </div>
  );
};
