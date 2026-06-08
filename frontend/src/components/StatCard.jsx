import React, { useEffect, useState } from 'react';

const CountUp = ({ end, duration = 800 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (typeof end !== 'number') return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{typeof end === 'number' ? count.toLocaleString() : end}</span>;
};

const StatCard = ({ title, value, icon: Icon, color = 'brand', description, loading }) => {
  const colorMap = {
    brand: 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    pink: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
    orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  };

  const selectedColor = colorMap[color] || colorMap.brand;

  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-dark-border/60 p-6 rounded-2xl shadow-sm flex flex-col justify-between h-36 animate-pulse">
        <div className="flex justify-between items-start">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
          <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
        <div className="space-y-2">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-dark-border/60 p-6 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-36 group">
      <div className="flex justify-between items-start">
        <span className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl border ${selectedColor} transition-transform duration-300 group-hover:scale-110`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>
      
      <div>
        <h3 className="text-3xl font-extrabold tracking-tight">
          <CountUp end={value} />
        </h3>
        {description && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">{description}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
