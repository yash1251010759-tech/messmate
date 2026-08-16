import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { messService } from '../services/api';
import { MessProvider, PaymentRecord } from '../types';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { 
  Utensils, 
  MapPin, 
  Star, 
  Clock, 
  CheckCircle2, 
  CreditCard, 
  QrCode, 
  ShieldCheck, 
  Search, 
  Sparkles, 
  Phone, 
  ArrowRight, 
  Tag, 
  Users, 
  Receipt, 
  Award,
  RefreshCw,
  Info,
  Building,
  Store,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MessSelectionPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [messes, setMesses] = useState<MessProvider[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');

  // Detail Modal
  const [selectedMessDetail, setSelectedMessDetail] = useState<MessProvider | null>(null);

  // Payment Modal State
  const [paymentMess, setPaymentMess] = useState<MessProvider | null>(null);
  const [planDuration, setPlanDuration] = useState<'1 Month' | '3 Months' | '1 Semester'>('1 Month');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Net Banking' | 'Campus Wallet'>('UPI');
  const [upiId, setUpiId] = useState('student@okicici');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [discountCodeName, setDiscountCodeName] = useState<string>('');
  const [isProcessingPay, setIsProcessingPay] = useState(false);

  // Receipt Modal State after successful payment
  const [receiptRecord, setReceiptRecord] = useState<PaymentRecord | null>(null);
  const [allottedMessInfo, setAllottedMessInfo] = useState<MessProvider | null>(null);

  useEffect(() => {
    fetchMesses();
  }, []);

  const fetchMesses = async () => {
    setLoading(true);
    try {
      const data = await messService.getMessProviders();
      const localCustomStr = localStorage.getItem('messmate_custom_messes');
      let combined = [...data];

      if (localCustomStr) {
        try {
          const localMesses: MessProvider[] = JSON.parse(localCustomStr);
          const existingIds = new Set(data.map(m => m.id));
          const newLocal = localMesses.filter(m => !existingIds.has(m.id));
          combined = [...newLocal, ...data];
        } catch (e) {
          console.error(e);
        }
      }
      setMesses(combined);
    } catch {
      const localCustomStr = localStorage.getItem('messmate_custom_messes');
      if (localCustomStr) {
        try {
          setMesses(JSON.parse(localCustomStr));
        } catch {
          showToast('Error loading mess providers list', 'error');
        }
      } else {
        showToast('Error loading mess providers list', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'WELCOME10') {
      setAppliedDiscount(10);
      setDiscountCodeName('WELCOME10 (10% OFF)');
      showToast('Coupon WELCOME10 applied! 10% discount added.', 'success');
    } else if (couponCode.trim().toUpperCase() === 'STUDENT20') {
      setAppliedDiscount(20);
      setDiscountCodeName('STUDENT20 (20% OFF)');
      showToast('Coupon STUDENT20 applied! 20% discount added.', 'success');
    } else {
      showToast('Invalid coupon code. Try WELCOME10 or STUDENT20', 'warning');
    }
  };

  const calculateAmount = (mess: MessProvider) => {
    let base = mess.monthlyFee;
    if (planDuration === '3 Months') base = mess.quarterlyFee;
    if (planDuration === '1 Semester') base = mess.semesterFee;

    if (appliedDiscount > 0) {
      base = Math.round(base * (1 - appliedDiscount / 100));
    }
    return base;
  };

  const handleProcessPayment = async () => {
    if (!paymentMess) return;

    setIsProcessingPay(true);
    try {
      const result = await messService.selectAndPayMess({
        messId: paymentMess.id,
        planDuration,
        paymentMethod,
        couponCode: discountCodeName ? couponCode : undefined,
      });

      // Update AuthContext user state
      updateProfile({
        allottedMessId: result.user.allottedMessId,
        allottedMessName: result.user.allottedMessName,
        subscriptionStatus: result.user.subscriptionStatus,
        subscriptionValidUntil: result.user.subscriptionValidUntil,
        paymentHistory: result.user.paymentHistory,
      });

      setReceiptRecord(result.paymentRecord);
      setAllottedMessInfo(result.allottedMess);
      setPaymentMess(null);
      showToast(`Payment Successful! Mess Allotted: ${result.allottedMess.name}`, 'success');
      
      // Refresh messes list to reflect updated active subscribers
      fetchMesses();
    } catch {
      showToast('Payment processing failed. Please try again.', 'error');
    } finally {
      setIsProcessingPay(false);
    }
  };

  const handleDeallot = async () => {
    if (!window.confirm('Are you sure you want to reset your mess allotment?')) return;
    try {
      const res = await messService.deallotMess();
      updateProfile({
        allottedMessId: undefined,
        allottedMessName: undefined,
        subscriptionStatus: 'None',
      });
      showToast(res.message, 'info');
    } catch {
      showToast('Could not reset allotment', 'error');
    }
  };

  // Filter Logic
  const filteredMesses = messes.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.providerCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.cuisineType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCuisine = selectedCuisine === 'All' || m.cuisineType === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  const cuisines = ['All', 'North Indian', 'South Indian', 'Pure Veg Mess', 'Multi-Cuisine Special'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-emerald-500/20">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-extrabold px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Hostel Dining Provider Portal & Allotment Engine
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                Browse, Select & Pay for Your Hostel Mess
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Compare official hostel mess providers, inspect daily menu items, pay subscription fees online, and get your preferred dining hall allotted instantly.
              </p>
              
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/register?role=mess_provider"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-emerald-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Mess Service (Show Card Here)</span>
                </Link>
                <span className="text-[11px] text-emerald-300 font-semibold">
                  • Menu Driven Custom Cards
                </span>
              </div>
            </div>

            {/* Current Allotment Badge */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 shrink-0 flex flex-col justify-between gap-3 min-w-[280px]">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300">Your Allotted Mess</p>
                {user?.allottedMessName ? (
                  <div className="mt-1 space-y-1">
                    <p className="text-base font-black text-white flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-emerald-400" />
                      {user.allottedMessName}
                    </p>
                    <p className="text-xs text-emerald-200 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Status: Active until {user.subscriptionValidUntil || '2026-09-30'}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm font-bold text-amber-300 mt-1">
                    No Mess Allotted Yet — Please Select a Mess Below
                  </p>
                )}
              </div>

              {user?.allottedMessName && (
                <button
                  onClick={handleDeallot}
                  className="w-full py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/30 text-rose-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Switch / Change Allotment
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters & Search Row */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search mess name, cuisine type, or hostel block..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Quick Coupons Info Pill */}
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 shrink-0">
              <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Use Coupons: <strong className="font-mono text-emerald-800 dark:text-emerald-200">WELCOME10</strong> (10% off) or <strong className="font-mono text-emerald-800 dark:text-emerald-200">STUDENT20</strong></span>
            </div>
          </div>

          {/* Cuisine Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Cuisine:</span>
            {cuisines.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCuisine(c)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedCuisine === c
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching available mess providers..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMesses.map((mess) => {
              const isAllottedToThis = user?.allottedMessId === mess.id;

              return (
                <div
                  key={mess.id}
                  className={`bg-white dark:bg-slate-900 border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between ${
                    isAllottedToThis
                      ? 'border-2 border-emerald-500 dark:border-emerald-500 ring-4 ring-emerald-500/10'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div>
                    {/* Cover Header Image */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                      <img
                        src={mess.image}
                        alt={mess.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge variant="emerald" size="sm">
                          {mess.cuisineType}
                        </Badge>
                        {isAllottedToThis && (
                          <Badge variant="blue" size="sm">
                            ★ Currently Allotted
                          </Badge>
                        )}
                      </div>

                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl text-amber-300 text-xs font-black flex items-center gap-1 border border-white/20">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {mess.rating} ({mess.reviewCount})
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="text-lg font-black leading-snug">{mess.name}</h3>
                        <p className="text-xs text-slate-300 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          {mess.location}
                        </p>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-4">
                      
                      {/* Provider Info */}
                      <div className="text-xs space-y-1">
                        <p className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">Caterer & Vendor</p>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{mess.providerCompany}</p>
                        <p className="text-slate-500 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-500" />
                          {mess.contactPerson} ({mess.contactPhone})
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {mess.description}
                      </p>

                      {/* Special Items Highlights */}
                      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl text-xs space-y-1.5">
                        <p className="font-extrabold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                          <Utensils className="w-3.5 h-3.5 text-amber-600" />
                          Special Items:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {mess.todaysSpecial.map((item, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-[11px] font-bold rounded-lg">
                              • {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {mess.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium rounded-lg"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Timings & Capacity Grid */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Subscriber Headcount</p>
                          <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                            <Users className="w-3.5 h-3.5 text-emerald-500" />
                            {mess.activeSubscribers} / {mess.capacity} Seats
                          </p>
                        </div>
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Lunch Hours</p>
                          <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3.5 h-3.5 text-emerald-500" />
                            {mess.timings.lunch}
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Card Footer Price & Action */}
                  <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Monthly Subscription</p>
                      <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                        ₹{mess.monthlyFee.toLocaleString('en-IN')}
                        <span className="text-xs font-semibold text-slate-500"> / mo</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedMessDetail(mess)}
                        className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all"
                      >
                        Info & Menu
                      </button>

                      <button
                        onClick={() => {
                          setPaymentMess(mess);
                          setAppliedDiscount(0);
                          setDiscountCodeName('');
                          setCouponCode('');
                        }}
                        className={`px-4 py-2.5 rounded-xl font-black text-xs shadow-md transition-all flex items-center gap-1.5 ${
                          isAllottedToThis
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        {isAllottedToThis ? 'Renew Allotment' : 'Select & Pay'}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* MODAL 1: FULL MESS DETAIL & MENU MODAL */}
      <Modal
        isOpen={!!selectedMessDetail}
        onClose={() => setSelectedMessDetail(null)}
        title={selectedMessDetail?.name || 'Mess Provider Info'}
        subtitle={`Managed by ${selectedMessDetail?.providerCompany}`}
        maxWidth="lg"
      >
        {selectedMessDetail && (
          <div className="space-y-6 py-2 text-xs">
            
            {/* Header info */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <img
                src={selectedMessDetail.image}
                alt={selectedMessDetail.name}
                className="w-20 h-20 rounded-xl object-cover shrink-0"
              />
              <div className="space-y-1">
                <Badge variant="emerald">{selectedMessDetail.cuisineType}</Badge>
                <p className="text-sm font-black text-slate-900 dark:text-white">{selectedMessDetail.name}</p>
                <p className="text-slate-500">{selectedMessDetail.location}</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Contact: {selectedMessDetail.contactPerson} ({selectedMessDetail.contactPhone})
                </p>
              </div>
            </div>

            {/* Timings Grid */}
            <div className="space-y-2">
              <h4 className="font-extrabold uppercase text-slate-400 tracking-wider text-[10px]">Daily Meal Service Windows</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <p className="font-bold text-slate-800 dark:text-slate-200">Breakfast</p>
                  <p className="text-slate-500 font-mono mt-0.5">{selectedMessDetail.timings.breakfast}</p>
                </div>
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <p className="font-bold text-slate-800 dark:text-slate-200">Lunch</p>
                  <p className="text-slate-500 font-mono mt-0.5">{selectedMessDetail.timings.lunch}</p>
                </div>
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <p className="font-bold text-slate-800 dark:text-slate-200">Snacks</p>
                  <p className="text-slate-500 font-mono mt-0.5">{selectedMessDetail.timings.snacks}</p>
                </div>
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <p className="font-bold text-slate-800 dark:text-slate-200">Dinner</p>
                  <p className="text-slate-500 font-mono mt-0.5">{selectedMessDetail.timings.dinner}</p>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="space-y-2">
              <h4 className="font-extrabold uppercase text-slate-400 tracking-wider text-[10px]">Facilities & Hygiene Standards</h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedMessDetail.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold text-emerald-900 dark:text-emerald-200">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Options */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-emerald-400 text-[10px]">Subscription Passes & Pricing</h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                  <p className="text-slate-400 text-[10px]">1 Month Pass</p>
                  <p className="text-base font-black text-white mt-1">₹{selectedMessDetail.monthlyFee.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                  <p className="text-slate-400 text-[10px]">3 Months (Quarterly)</p>
                  <p className="text-base font-black text-emerald-400 mt-1">₹{selectedMessDetail.quarterlyFee.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                  <p className="text-slate-400 text-[10px]">1 Semester (6 Mo)</p>
                  <p className="text-base font-black text-amber-400 mt-1">₹{selectedMessDetail.semesterFee.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedMessDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const mess = selectedMessDetail;
                  setSelectedMessDetail(null);
                  setPaymentMess(mess);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black flex items-center gap-1.5 shadow-md"
              >
                <CreditCard className="w-4 h-4" /> Proceed to Pay & Allot
              </button>
            </div>

          </div>
        )}
      </Modal>

      {/* MODAL 2: INTERACTIVE PAYMENT & ALLOTMENT MODAL */}
      <Modal
        isOpen={!!paymentMess}
        onClose={() => setPaymentMess(null)}
        title="Hostel Mess Allotment Payment"
        subtitle={`Selected: ${paymentMess?.name}`}
        maxWidth="md"
      >
        {paymentMess && (
          <div className="space-y-5 py-1 text-xs">
            
            {/* Step 1: Select Duration Plan */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300">
                1. Select Subscription Duration Plan
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: '1 Month' as const, fee: paymentMess.monthlyFee, tag: 'Standard' },
                  { name: '3 Months' as const, fee: paymentMess.quarterlyFee, tag: 'Save 6%' },
                  { name: '1 Semester' as const, fee: paymentMess.semesterFee, tag: 'Save 12%' },
                ].map((plan) => (
                  <button
                    key={plan.name}
                    type="button"
                    onClick={() => setPlanDuration(plan.name)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      planDuration === plan.name
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-500/30'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-extrabold text-slate-900 dark:text-white">{plan.name}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900">{plan.tag}</span>
                    </div>
                    <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                      ₹{plan.fee.toLocaleString('en-IN')}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Coupon Code */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700 dark:text-slate-300">
                2. Apply Promo / Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter WELCOME10 or STUDENT20"
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-black text-white font-bold"
                >
                  Apply
                </button>
              </div>
              {appliedDiscount > 0 && (
                <p className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Discount Applied: {discountCodeName}
                </p>
              )}
            </div>

            {/* Step 3: Payment Method */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300">
                3. Choose Payment Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'UPI' as const, label: 'UPI (GPay / PhonePe)' },
                  { id: 'Card' as const, label: 'Credit / Debit Card' },
                  { id: 'Net Banking' as const, label: 'Net Banking' },
                  { id: 'Campus Wallet' as const, label: 'Campus Wallet (Bal: ₹5,000)' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left ${
                      paymentMethod === m.id
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {paymentMethod === 'UPI' && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1 mt-2">
                  <label className="block text-[11px] font-bold text-slate-500">Virtual Payment Address (VPA / UPI ID)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold"
                  />
                </div>
              )}
            </div>

            {/* Summary Box */}
            <div className="p-4 bg-slate-100 dark:bg-slate-800/80 rounded-2xl space-y-2 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Mess Provider Fee ({planDuration}):</span>
                <span className="font-mono font-bold">
                  ₹{(planDuration === '1 Month' ? paymentMess.monthlyFee : planDuration === '3 Months' ? paymentMess.quarterlyFee : paymentMess.semesterFee).toLocaleString('en-IN')}
                </span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Coupon Discount ({appliedDiscount}%):</span>
                  <span className="font-mono">- ₹{((planDuration === '1 Month' ? paymentMess.monthlyFee : planDuration === '3 Months' ? paymentMess.quarterlyFee : paymentMess.semesterFee) * (appliedDiscount / 100)).toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Hostel Dining Service Tax:</span>
                <span className="font-mono font-bold text-emerald-600">₹0 (Waived)</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <span className="font-black text-slate-900 dark:text-white text-sm">Total Payable Amount:</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  ₹{calculateAmount(paymentMess).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPaymentMess(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessingPay}
                onClick={handleProcessPayment}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-lg flex items-center gap-2 transition-all"
              >
                {isProcessingPay ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Payment...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" /> Pay ₹{calculateAmount(paymentMess).toLocaleString('en-IN')} & Allot Mess
                  </>
                )}
              </button>
            </div>

          </div>
        )}
      </Modal>

      {/* MODAL 3: DIGITAL RECEIPT & ALLOTMENT CERTIFICATE MODAL */}
      <Modal
        isOpen={!!receiptRecord}
        onClose={() => setReceiptRecord(null)}
        title="Mess Allotment & Payment Receipt"
        subtitle="Official Hostel Dining Service Certificate"
        maxWidth="md"
      >
        {receiptRecord && allottedMessInfo && (
          <div className="space-y-5 py-2 text-xs">
            <div className="p-6 bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/30 rounded-3xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Mess Allotted Successfully!</h3>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                  Transaction Verified: {receiptRecord.transactionId}
                </p>
              </div>
            </div>

            {/* Details Table */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 font-bold">Allotted Mess Name:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{allottedMessInfo.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 font-bold">Mess Caterer Provider:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{allottedMessInfo.providerCompany}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 font-bold">Location / Hall:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{allottedMessInfo.location}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 font-bold">Plan Duration:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{receiptRecord.planDuration}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 font-bold">Subscription Valid Until:</span>
                <span className="font-bold text-slate-900 dark:text-white">{receiptRecord.validUntil}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-bold">Amount Paid:</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                  ₹{receiptRecord.amount.toLocaleString('en-IN')} ({receiptRecord.paymentMethod})
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              Your attendance records, daily menu, and meal passes are now synced to <strong>{allottedMessInfo.name}</strong>.
            </p>

            <button
              onClick={() => {
                setReceiptRecord(null);
                window.location.href = '/student-dashboard';
              }}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" /> Go to My Allotted Mess Dashboard
            </button>
          </div>
        )}
      </Modal>

    </div>
  );
};
