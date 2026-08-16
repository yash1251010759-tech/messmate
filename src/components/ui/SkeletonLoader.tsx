import React from 'react';

export const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-16"></div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/6"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/6"></div>
    </div>
    <div className="pt-2 flex justify-between items-center">
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-24"></div>
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-28"></div>
    </div>
  </div>
);

export const SkeletonTableRow: React.FC = () => (
  <tr className="animate-pulse border-b border-slate-100 dark:border-slate-800">
    <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32"></div></td>
    <td className="px-6 py-4"><div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-20"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16"></div></td>
    <td className="px-6 py-4 text-right"><div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-12 inline-block"></div></td>
  </tr>
);
