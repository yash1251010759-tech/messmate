import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  UtensilsCrossed, 
  Sun, 
  Moon, 
  Menu as MenuIcon, 
  X, 
  User as UserIcon, 
  LogOut, 
  ShieldCheck, 
  GraduationCap,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, switchDemoRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Select & Pay Mess', path: '/select-mess' },
    { name: 'Dashboard', path: user?.role === 'admin' ? '/admin-dashboard' : '/student-dashboard' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-black/80 dark:bg-black/90 backdrop-blur-xl border-b border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-black shadow-[0_0_20px_rgba(16,185,129,0.35)] group-hover:scale-105 transition-transform font-bold">
              <UtensilsCrossed className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">
                Mess<span className="text-emerald-400">Mate</span>
              </span>
              <span className="block text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest -mt-1">
                Campus OS
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive(link.path)
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900/80'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Quick Demo Role Switcher Pill */}
            {isAuthenticated && (
              <div className="flex items-center bg-zinc-900/90 p-1 rounded-full border border-zinc-800">
                <button
                  onClick={() => switchDemoRole('student')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold transition-all ${
                    user?.role === 'student'
                      ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  Student
                </button>
                <button
                  onClick={() => switchDemoRole('admin')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold transition-all ${
                    user?.role === 'admin'
                      ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin
                </button>
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:border-emerald-500/30 transition-all"
              title={`Toggle mode`}
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-zinc-200" /> : <Sun className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* User Profile / Auth State */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:border-emerald-500/40 transition-colors"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-lg object-cover ring-2 ring-emerald-500/50 shadow-sm"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 font-black text-xs flex items-center justify-center ring-2 ring-emerald-500/50 shadow-sm">
                      {user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                    </div>
                  )}
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-white leading-tight">
                      {user.name}
                    </p>
                    <p className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wide">
                      {user.role} • {user.hostelBlock || 'Block-B'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-zinc-950 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-zinc-800 py-2 z-50 animate-fadeIn backdrop-blur-xl">
                    <div className="px-4 py-2.5 border-b border-zinc-800">
                      <p className="text-xs font-bold text-white">{user.name}</p>
                      <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-900 hover:text-emerald-400 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-emerald-400" />
                      View Profile
                    </Link>

                    <Link
                      to={user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard'}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-900 hover:text-emerald-400 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      Dashboard
                    </Link>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-950/30 transition-colors border-t border-zinc-800 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-zinc-800 text-zinc-300"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-zinc-800 text-zinc-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-black/95 px-4 py-4 space-y-3 animate-fadeIn">
          {isAuthenticated && user && (
            <div className="p-3 bg-zinc-900 rounded-xl flex items-center gap-3 mb-3 border border-zinc-800">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-lg object-cover ring-2 ring-emerald-500 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 font-black text-sm flex items-center justify-center ring-2 ring-emerald-500 shrink-0">
                  {user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{user.name}</p>
                <p className="text-xs text-zinc-400">{user.email}</p>
              </div>
            </div>
          )}

          {isAuthenticated && (
            <div className="flex gap-2 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
              <button
                onClick={() => { switchDemoRole('student'); setMobileMenuOpen(false); }}
                className={`flex-1 py-2 text-xs font-extrabold rounded-lg text-center ${
                  user?.role === 'student' ? 'bg-emerald-500 text-black' : 'text-zinc-400'
                }`}
              >
                Student View
              </button>
              <button
                onClick={() => { switchDemoRole('admin'); setMobileMenuOpen(false); }}
                className={`flex-1 py-2 text-xs font-extrabold rounded-lg text-center ${
                  user?.role === 'admin' ? 'bg-emerald-500 text-black' : 'text-zinc-400'
                }`}
              >
                Admin View
              </button>
            </div>
          )}

          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-xs font-bold ${
                  isActive(link.path)
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-800">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-xl text-center text-xs font-bold border border-zinc-800 text-zinc-300"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-xl text-center text-xs font-extrabold bg-emerald-500 text-black shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
