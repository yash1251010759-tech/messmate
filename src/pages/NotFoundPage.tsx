import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="p-4 bg-emerald-100 dark:bg-emerald-950 rounded-full text-emerald-600 mb-4">
        <UtensilsCrossed className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-black mb-2">404 - Page Not Found</h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-6">
        The page or dining resource you are trying to access does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md inline-flex items-center gap-2"
      >
        <Home className="w-4 h-4" /> Return to Home
      </Link>
    </div>
  );
};
