import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  UtensilsCrossed, 
  Sparkles, 
  QrCode, 
  CheckCircle2, 
  BarChart3, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Clock,
  MessageSquare,
  Zap,
  Award,
  ChevronRight,
  UserPlus,
  CreditCard,
  Building,
  Lock,
  Layers,
  Users,
  PieChart,
  Bell,
  GraduationCap,
  Github,
  Linkedin
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Footer } from '../components/layouts/Footer';

function TeamAvatar({ 
  imageUrl, 
  initials, 
  alt, 
  textClassName 
}: { 
  imageUrl?: string; 
  initials: string; 
  alt: string; 
  textClassName: string; 
}) {
  const [imgError, setImgError] = useState(false);

  if (imageUrl && !imgError) {
    return (
      <img 
        src={imageUrl} 
        alt={alt} 
        className="w-full h-full object-cover"
        onError={() => setImgError(true)}
      />
    );
  }

  return <span className={textClassName}>{initials}</span>;
}

export const LandingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeScreenTab, setActiveScreenTab] = useState<'student' | 'admin' | 'qr'>('student');

  const steps = [
    {
      number: '01',
      icon: <UserPlus className="w-6 h-6 text-emerald-400" />,
      title: 'Register Account First',
      description: 'Create your official student or resident profile with hostel block & roll number.',
      action: 'Register Now',
      link: '/register',
    },
    {
      number: '02',
      icon: <CreditCard className="w-6 h-6 text-emerald-400" />,
      title: 'Select Mess & Pay Subscription',
      description: 'Browse mess providers (North Indian, South Indian, Jain Veg, etc.) and complete online fee payment.',
      action: 'Browse Messes',
      link: '/select-mess',
    },
    {
      number: '03',
      icon: <Building className="w-6 h-6 text-emerald-400" />,
      title: 'Access Allotted Mess Portal',
      description: 'Unlock daily meal schedules, QR check-in tokens, opt-out meal passes, and provider updates.',
      action: 'View Portal',
      link: '/student-dashboard',
    },
  ];

  const features = [
    {
      icon: <QrCode className="w-6 h-6 text-emerald-400" />,
      title: 'Digital QR Pass Entry',
      description: 'Instant 2-second check-ins at dining halls with dynamic QR validation to eliminate physical coupon clutter.',
      stat: '< 2s Scan Time',
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
      title: 'Smart Opt-Out & Wastage Cut',
      description: 'Advance 3-hour headcount registration empowers kitchen staff to prepare exact raw quantities.',
      stat: '24.5% Waste Cut',
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-emerald-400" />,
      title: 'Direct Hygiene Grievance Desk',
      description: 'Log meal feedback and hostel complaints directly to the warden office with live status notifications.',
      stat: '100% Response Rate',
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-emerald-400" />,
      title: 'Real-time Kitchen Analytics',
      description: 'Automated dish ratings, turnout forecasts, and inventory logs for mess committees and wardens.',
      stat: '4.8★ Avg Quality',
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Ramesh Verma',
      role: 'Chief Warden, Boys Hostel Block-B',
      comment: 'MessMate transformed our dining management. Food wastage dropped drastically by 24.5% in the very first month.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    },
    {
      name: 'Aarav Sharma',
      role: 'Mess Committee Student Head',
      comment: 'The registration-first workflow ensures students get their allotted mess menus and QR tokens clearly without confusion.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    },
    {
      name: 'Sunita Devi',
      role: 'Head Catering Manager',
      comment: 'Knowing precise subscriber headcount numbers before cooking eliminates raw ingredient wastage and stress during rush hours.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-black text-slate-100 font-sans selection:bg-emerald-500 selection:text-black relative overflow-x-hidden">
      
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-[800px] right-0 w-[500px] h-[500px] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-4xl mx-auto space-y-8">
            
            {/* Top Pill Tag */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.15)] backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span>Campus Dining OS • Student Registration & Mess Selection Portal</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
              Your Next Meal is <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(16,185,129,0.3)]">
                Just One Click Away.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto font-normal">
              Register your account, choose your mess provider, pay the subscription, and get instant access to your allotted mess menu, attendance passes, and daily schedules.
            </p>

            {/* Action Buttons & Status Banner */}
            {isAuthenticated && user ? (
              <div className="p-6 bg-zinc-900/90 border border-emerald-500/40 rounded-3xl max-w-xl mx-auto space-y-3 backdrop-blur-md">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-emerald-400 uppercase tracking-wider">Logged In Session</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">{user.role}</span>
                </div>
                <div className="text-left space-y-1">
                  <p className="text-lg font-black text-white">{user.name}</p>
                  <p className="text-xs text-zinc-400">
                    Allotted Mess: <strong className="text-emerald-400">{user.allottedMessName || 'Not Allotted Yet'}</strong>
                  </p>
                </div>
                <div className="pt-2 flex gap-3">
                  <Link
                    to="/select-mess"
                    className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all text-center shadow-md"
                  >
                    Select / Pay Mess
                  </Link>
                  <Link
                    to="/student-dashboard"
                    className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-all text-center border border-zinc-700"
                  >
                    My Mess Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:shadow-[0_0_45px_rgba(16,185,129,0.55)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5 group"
                >
                  <UserPlus className="w-5 h-5 text-black" />
                  <span>1. Register Student Account</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 hover:border-emerald-500/40 font-bold text-sm transition-all flex items-center justify-center gap-2.5 shadow-lg"
                >
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>2. Sign In to Existing Account</span>
                </Link>
              </div>
            )}

            {/* Metrics Bar */}
            <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-zinc-800/80">
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-sm">
                <p className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">485+</p>
                <p className="text-xs text-zinc-400 font-medium mt-0.5">Active Mess Subscribers</p>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-sm">
                <p className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">4 Providers</p>
                <p className="text-xs text-zinc-400 font-medium mt-0.5">North/South/Veg/Multi</p>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-sm">
                <p className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">100%</p>
                <p className="text-xs text-zinc-400 font-medium mt-0.5">Online Allotment</p>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-sm">
                <p className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">&lt; 2s</p>
                <p className="text-xs text-zinc-400 font-medium mt-0.5">QR Attendance Speed</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* HOW IT WORKS: REGISTER -> SELECT MESS -> VIEW ALLOTTED INFO */}
      <section className="py-16 bg-zinc-950/90 border-y border-zinc-800/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simple 3-Step Onboarding</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              How You Get Access to Your Mess Info
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Follow this straightforward process to select your mess and unlock menus, attendance tokens, and schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-zinc-900/80 border border-zinc-800/90 hover:border-emerald-500/50 rounded-3xl p-6 flex flex-col justify-between space-y-6 transition-all duration-200 hover:shadow-[0_0_25px_rgba(16,185,129,0.1)] group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                      {step.icon}
                    </div>
                    <span className="text-2xl font-black text-zinc-700 group-hover:text-emerald-400 transition-colors font-mono">
                      {step.number}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                <Link
                  to={step.link}
                  className="w-full py-2.5 rounded-xl bg-zinc-800 group-hover:bg-emerald-500 group-hover:text-black text-zinc-200 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <span>{step.action}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* INTERACTIVE CONSOLE SHOWCASE */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
              Allotted Mess Dashboard Feature Preview
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Once registered and allotted, students get instant access to their mess attendance, daily dishes, and meal check-in pass.
            </p>

            {/* Custom Dark Tab Selector */}
            <div className="inline-flex p-1.5 bg-zinc-900 border border-zinc-800 rounded-2xl mt-6 shadow-inner">
              <button
                onClick={() => setActiveScreenTab('student')}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                  activeScreenTab === 'student'
                    ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Resident Mess Portal
              </button>
              <button
                onClick={() => setActiveScreenTab('admin')}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                  activeScreenTab === 'admin'
                    ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Warden Console
              </button>
              <button
                onClick={() => setActiveScreenTab('qr')}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                  activeScreenTab === 'qr'
                    ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                QR Counter Scanner
              </button>
            </div>
          </div>

          {/* Interactive Preview Glass Card */}
          <div className="bg-zinc-950/90 border border-zinc-800/90 rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden">
            
            {/* Window Dots */}
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-800/80">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-[11px] font-mono text-zinc-500">messmate-os // allotted_mess_session</span>
            </div>

            {activeScreenTab === 'student' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      Allotted Mess: Royal North Central Mess
                    </h3>
                    <p className="text-xs text-zinc-400">Resident: Aarav Sharma • Hostel Block-B (Room 304)</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold w-fit">
                    TOKEN: MM-LU-9042
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-zinc-900/90 rounded-2xl border border-zinc-800 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-400 font-semibold">Breakfast</span>
                      <span className="text-emerald-400 font-bold">Attended ✓</span>
                    </div>
                    <p className="text-sm font-bold text-white">Aloo Paratha & Tea</p>
                    <p className="text-[11px] text-zinc-500 font-mono">07:30 AM • Verified</p>
                  </div>

                  <div className="p-4 bg-zinc-900/90 rounded-2xl border border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.15)] space-y-2 relative">
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-500 text-black text-[9px] font-black uppercase">
                      Active Now
                    </span>
                    <div className="flex justify-between text-xs">
                      <span className="text-emerald-400 font-bold">Lunch</span>
                      <span className="text-emerald-400 font-bold">Opted In</span>
                    </div>
                    <p className="text-sm font-bold text-white">Paneer Masala & Gulab Jamun</p>
                    <p className="text-[11px] text-zinc-400 font-mono">12:30 PM • Ready for Scan</p>
                  </div>

                  <div className="p-4 bg-zinc-900/90 rounded-2xl border border-zinc-800 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-400 font-semibold">Dinner</span>
                      <span className="text-emerald-400 font-bold">Registered</span>
                    </div>
                    <p className="text-sm font-bold text-white">Kadai Veg & Custard</p>
                    <p className="text-[11px] text-zinc-500 font-mono">07:30 PM • Upcoming</p>
                  </div>
                </div>
              </div>
            )}

            {activeScreenTab === 'admin' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    Kitchen Roster & Live Headcount Control
                  </h3>
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Telemetry
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-zinc-900/80 rounded-2xl border border-zinc-800">
                    <p className="text-xs text-zinc-400 font-medium">Today Opt-Ins</p>
                    <p className="text-2xl font-black text-emerald-400 mt-1">420 / 485</p>
                    <p className="text-[10px] text-zinc-500 mt-1">86.5% Registered</p>
                  </div>
                  <div className="p-4 bg-zinc-900/80 rounded-2xl border border-zinc-800">
                    <p className="text-xs text-zinc-400 font-medium">Meals Served</p>
                    <p className="text-2xl font-black text-white mt-1">382</p>
                    <p className="text-[10px] text-emerald-400 mt-1">+12% vs last week</p>
                  </div>
                  <div className="p-4 bg-zinc-900/80 rounded-2xl border border-zinc-800">
                    <p className="text-xs text-zinc-400 font-medium">Open Issues</p>
                    <p className="text-2xl font-black text-rose-400 mt-1">1 Pending</p>
                    <p className="text-[10px] text-zinc-500 mt-1">Water cooler audit</p>
                  </div>
                  <div className="p-4 bg-zinc-900/80 rounded-2xl border border-zinc-800">
                    <p className="text-xs text-zinc-400 font-medium">Waste Saved</p>
                    <p className="text-2xl font-black text-emerald-400 mt-1">38 kg/wk</p>
                    <p className="text-[10px] text-emerald-400 mt-1">₹38,000 Saved</p>
                  </div>
                </div>
              </div>
            )}

            {activeScreenTab === 'qr' && (
              <div className="flex flex-col items-center text-center space-y-4 py-6 animate-fadeIn">
                <div className="p-6 bg-white rounded-3xl text-black shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  <QrCode className="w-32 h-32 text-black" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-extrabold text-emerald-400">Scan Student QR at Counter</p>
                  <p className="text-xs text-zinc-400 max-w-sm">
                    Instant token verification ensures seamless queue management and zero paper meal passes.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* FEATURE MATRIX (BENTO GRID) */}
      <section className="py-20 bg-zinc-950/80 relative z-10 border-t border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
              Engineered for Clean & Modern Dining
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              All essential utilities required to manage campus mess operations digitally and transparently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/60 border border-zinc-800/80 hover:border-emerald-500/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                    {feat.icon}
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-mono font-bold">{feat.stat}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-white tracking-tight mb-3">
              Trusted by Campus Wardens & Residents
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Read how MessMate has elevated campus dining experiences across hostellers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-6 flex flex-col justify-between space-y-6 hover:border-emerald-500/30 transition-all"
              >
                <div className="space-y-4">
                  <div className="flex text-emerald-400 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 italic leading-relaxed">
                    "{test.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/80">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{test.name}</h4>
                    <p className="text-[11px] text-zinc-400">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* THE TEAM / MEET THE BUILDERS SECTION */}
      <section className="py-20 relative z-10 bg-zinc-950/80 border-t border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-bold font-mono tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <span>THE TEAM</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
              Meet the <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">Builders</span>
            </h2>
            
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-medium">
              A dedicated team from Vishwakarma Institute of Technology, Pune
              <br />
              <span className="text-xs text-zinc-500 font-mono">(AI & DS, 2026-27)</span>
            </p>
          </div>

          {/* FACULTY GUIDE CARD (Placed above the 5 developers) */}
          <div className="max-w-md mx-auto mb-10">
            <div className="bg-zinc-900/90 border border-amber-500/40 hover:border-amber-400 rounded-3xl p-6 text-center space-y-4 shadow-[0_0_25px_rgba(245,158,11,0.12)] transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider rounded-bl-xl border-l border-b border-amber-500/30 flex items-center gap-1 z-10">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span>Project Guide</span>
              </div>

              {/* Guide Avatar Circle */}
              <div className="w-20 h-20 mx-auto rounded-full bg-amber-950/90 border-2 border-amber-400 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform overflow-hidden">
                <TeamAvatar
                  imageUrl="/team/prof_vivek_patil.jpg" // Put photo URL here or place file in /public/team/prof_vivek_patil.jpg
                  initials="VP"
                  alt="Prof. Vivek Patil"
                  textClassName="text-2xl font-black text-amber-300 font-mono tracking-wider"
                />
              </div>

              <div>
                <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                  Prof. Vivek Patil
                </h3>
                <p className="text-xs font-bold text-amber-400 mt-0.5">Faculty Advisor & Project Guide</p>
                <p className="text-[11px] text-zinc-400 mt-1 font-mono">
                  Dept. of AI & Data Science, VIT Pune
                </p>

                <div className="flex items-center justify-center gap-2 pt-3">
                  <a
                    href="https://github.com/search?q=Prof+Vivek+Patil+VIT+Pune"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 text-amber-400 hover:text-white transition-colors"
                    title="GitHub Profile"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href="https://www.linkedin.com/search/results/all/?keywords=Vivek%20Patil%20VIT%20Pune"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 text-amber-400 hover:text-amber-200 transition-colors"
                    title="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 5 DEVELOPERS CARDS - Single Row Grid */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3 lg:gap-4 overflow-x-auto pb-2">
            {[
              {
                name: 'Yash Mohan Khode',
                branch: 'AI & Data Science',
                initials: 'YK',
                imageUrl: 'https://github.com/yash1251010759-tech.png',
                githubUrl: 'https://github.com/yash1251010759-tech',
                linkedinUrl: 'https://www.linkedin.com/in/yash-khode-441b0a383',
                borderColor: 'hover:border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.1)]',
                circleBg: 'bg-purple-950/90 border-purple-500/50 text-purple-300',
              },
              {
                name: 'Sarthak Kale',
                branch: 'AI & Data Science',
                initials: 'SK',
                imageUrl: '/team/sarthakKale.jpeg',
                githubUrl: 'https://github.com/sarthakskale27',
                linkedinUrl: 'https://www.linkedin.com/in/sarthak-kale-654485386/',
                borderColor: 'hover:border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.1)]',
                circleBg: 'bg-cyan-950/90 border-cyan-500/50 text-cyan-300',
              },
              {
                name: 'Prasad Khot',
                branch: 'AI & Data Science',
                initials: 'PK',
                imageUrl: '/team/prasad.jpeg',
                githubUrl: 'https://github.com/prasadkhot0909',
                linkedinUrl: 'https://www.linkedin.com/in/prasad-khot-953583370/',
                borderColor: 'hover:border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.1)]',
                circleBg: 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300',
              },
              {
                name: 'Sarthak Kalel',
                branch: 'AI & Data Science',
                initials: 'SK',
                imageUrl: '/team/sarthakKalel.jpeg',
                githubUrl: 'https://github.com/kalelsarthak4-eng',
                linkedinUrl: 'https://www.linkedin.com/in/sarthak-kalel-626903386/',
                borderColor: 'hover:border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.1)]',
                circleBg: 'bg-amber-950/90 border-amber-500/50 text-amber-300',
              },
              {
                name: 'Rangnath Kavathekar',
                branch: 'AI & Data Science',
                initials: 'RK',
                imageUrl: '/team/rangnath.jpeg',
                githubUrl: 'https://github.com/rangnathkavathekar',
                linkedinUrl: 'https://www.linkedin.com/in/rangnath-kavathekar-a9a22a3a2/',
                borderColor: 'hover:border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.1)]',
                circleBg: 'bg-rose-950/90 border-rose-500/50 text-rose-300',
              },
            ].map((dev, idx) => (
              <div
                key={idx}
                className={`bg-zinc-900/80 border border-zinc-800 rounded-2xl sm:rounded-3xl p-3 sm:p-5 text-center space-y-3 transition-all duration-300 hover:-translate-y-1 ${dev.borderColor} group flex flex-col justify-between min-w-[140px] sm:min-w-0`}
              >
                <div className="space-y-3">
                  {/* Avatar Circle */}
                  <div className={`w-16 h-16 mx-auto rounded-full border-2 flex items-center justify-center font-black text-lg font-mono tracking-wider transition-transform group-hover:scale-105 overflow-hidden ${dev.circleBg}`}>
                    <TeamAvatar
                      imageUrl={dev.imageUrl}
                      initials={dev.initials}
                      alt={dev.name}
                      textClassName="text-base font-black font-mono tracking-wider"
                    />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {dev.name}
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5 font-medium">
                      {dev.branch}
                    </p>
                  </div>
                </div>

                {/* Social links */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  <a
                    href={dev.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                    title={`${dev.name}'s GitHub`}
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href={dev.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-cyan-400 transition-colors"
                    title={`${dev.name}'s LinkedIn`}
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CALL TO ACTION (CTA) */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border border-emerald-500/30 rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-[0_0_60px_rgba(16,185,129,0.15)] relative overflow-hidden">
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-emerald-500/10 blur-[80px] pointer-events-none" />

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight relative z-10">
              Your Next Meal is Just One Click Away
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed relative z-10">
              Register your profile, choose your mess provider, pay your fee online, and view your selected mess menus and attendance passes.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all"
              >
                Register Student Account
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-200 font-bold text-sm hover:bg-zinc-800 transition-all"
              >
                Sign In to Account
              </Link>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};


