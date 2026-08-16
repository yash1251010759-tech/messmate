import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Heart, Shield, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-zinc-400 border-t border-zinc-800/80 transition-colors relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-black font-black shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <UtensilsCrossed className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Mess<span className="text-emerald-400">Mate</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Empowering hostel dining with smart menu planning, QR check-in tokens, food waste reduction telemetry, and transparent grievance resolution.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl w-fit">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Official Campus Dining OS</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-extrabold text-white mb-4 uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home Landing</Link></li>
              <li><Link to="/student-dashboard" className="hover:text-emerald-400 transition-colors">Resident Portal</Link></li>
              <li><Link to="/admin-dashboard" className="hover:text-emerald-400 transition-colors">Warden Console</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About MessMate</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Mess Timings */}
          <div>
            <h4 className="text-xs font-extrabold text-white mb-4 uppercase tracking-wider">Hostel Mess Timings</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex justify-between border-b border-zinc-800/80 pb-1.5">
                <span>Breakfast</span>
                <span className="font-mono text-zinc-200">07:30 - 09:30 AM</span>
              </li>
              <li className="flex justify-between border-b border-zinc-800/80 pb-1.5">
                <span>Lunch</span>
                <span className="font-mono text-zinc-200">12:30 - 02:30 PM</span>
              </li>
              <li className="flex justify-between border-b border-zinc-800/80 pb-1.5">
                <span>Snacks</span>
                <span className="font-mono text-zinc-200">05:00 - 06:15 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Dinner</span>
                <span className="font-mono text-zinc-200">07:30 - 09:30 PM</span>
              </li>
            </ul>
          </div>

          {/* Helpdesk */}
          <div>
            <h4 className="text-xs font-extrabold text-white mb-4 uppercase tracking-wider"> Committee Desk</h4>
            <div className="space-y-3 text-xs text-zinc-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Vishwakarma Institute of Technology, 666, Upper Indiranagar, Bibwewadi, Pune, Maharashtra 411037, India</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                +91 xxxxx xxxxx 
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                messcommittee@mail.com
              </p>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} MessMate Hostel Management OS. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for smart campus dining.
          </p>
        </div>
      </div>
    </footer>
  );
};
