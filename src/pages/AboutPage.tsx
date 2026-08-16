import React from 'react';
import { UtensilsCrossed, ShieldCheck, QrCode, Leaf, CheckCircle2, Heart, Sparkles, Check } from 'lucide-react';
import { Footer } from '../components/layouts/Footer';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 sm:space-y-12">
        
        {/* Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-500/20">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">About MessMate</h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            MessMate is an AI-powered smart hostel dining management platform that transforms traditional mess operations into a data-driven ecosystem. By enabling intelligent meal registration, real-time analytics, and automated attendance-based meal planning, MessMate minimizes food wastage, reduces operational costs, and enhances the dining experience for students while empowering mess administrators with actionable insights.
          </p>
        </div>

        {/* 3 Pillar Cards matching reference design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card 1: Hygienic & High Quality */}
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
                Hygienic & High Quality
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Maintaining the highest hygiene standards through transparent feedback and regular quality audits.
              </p>
              <div className="w-8 h-0.5 bg-emerald-500 rounded-full mb-5" />
              
              <ul className="space-y-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Transparent feedback loops</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Regular meal quality audits</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Hygiene & safety compliance</span>
                </li>
              </ul>
            </div>

            {/* Bottom-right illustration */}
            <div className="mt-6 flex justify-end">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 bg-emerald-100/60 dark:bg-emerald-950/40 rounded-full blur-xs" />
                <div className="relative w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-900/40 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-700/30">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/30">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                </div>
                <Sparkles className="absolute top-2 left-2 w-4 h-4 text-amber-400 fill-amber-300 animate-pulse" />
                <Sparkles className="absolute bottom-2 right-1 w-3.5 h-3.5 text-emerald-400 fill-emerald-300" />
              </div>
            </div>
          </div>

          {/* Card 2: Zero Paper Passes */}
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
                Zero Paper Passes
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Digital QR technology replaces physical tokens and paper lists for a seamless dining experience.
              </p>
              <div className="w-8 h-0.5 bg-emerald-500 rounded-full mb-5" />

              <ul className="space-y-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>2-second QR check-in</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Real-time headcount tracking</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>No more paper, no delays</span>
                </li>
              </ul>
            </div>

            {/* Bottom-right illustration */}
            <div className="mt-6 flex justify-end">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 bg-emerald-100/60 dark:bg-emerald-950/40 rounded-full blur-xs" />
                <div className="relative bg-slate-800 dark:bg-slate-900 border-2 border-slate-700 rounded-2xl w-12 h-18 p-1 shadow-md flex flex-col items-center justify-between">
                  <div className="w-3 h-0.5 bg-slate-600 rounded-full mt-0.5" />
                  <div className="bg-white p-1 rounded-md w-full flex items-center justify-center my-auto shadow-inner">
                    <QrCode className="w-6 h-6 text-slate-900" />
                  </div>
                  <div className="w-1.5 h-0.5 bg-slate-600 rounded-full mb-0.5" />
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border-2 border-white dark:border-slate-900 shadow-md">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Sustainability & Waste Cut */}
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
                Sustainability & Waste Cut
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Smart portion control and advance opt-outs help reduce daily food wastage by over 24%.
              </p>
              <div className="w-8 h-0.5 bg-emerald-500 rounded-full mb-5" />

              <ul className="space-y-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>3-hour advance opt-out</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Smart portion planning</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>24%+ waste reduction</span>
                </li>
              </ul>
            </div>

            {/* Bottom-right illustration */}
            <div className="mt-6 flex justify-end">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 bg-emerald-100/60 dark:bg-emerald-950/40 rounded-full blur-xs" />
                <div className="relative flex flex-col items-center">
                  <div className="flex gap-1 mb-[-2px] z-10">
                    <Leaf className="w-4 h-4 text-emerald-500 rotate-[-15deg] fill-emerald-200" />
                    <Leaf className="w-3.5 h-3.5 text-teal-500 rotate-[20deg] fill-teal-100" />
                  </div>
                  <div className="relative bg-emerald-50 dark:bg-emerald-900/60 border border-emerald-200/80 dark:border-emerald-700/40 rounded-b-full w-16 h-8 flex items-center justify-center shadow-md overflow-hidden">
                    <div className="absolute top-0 w-full h-3 bg-emerald-300/40 dark:bg-emerald-600/40 rounded-full flex justify-center gap-1 p-0.5">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                      <div className="w-2.5 h-2.5 bg-teal-400 rounded-full" />
                      <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/50 rounded-2xl p-4 sm:p-5 flex items-center gap-4 sm:gap-5 shadow-xs">
          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              Built for Students. Backed by Technology. Driven by Sustainability.
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              MessMate is transforming how campuses dine – today and for a better tomorrow.
            </p>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
};

