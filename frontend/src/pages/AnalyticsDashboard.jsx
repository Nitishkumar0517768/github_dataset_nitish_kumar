import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalyticsData, clearStatsError } from '../store/statsSlice';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  CartesianGrid
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  RefreshCw, 
  AlertCircle 
} from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f97316', '#06b6d4', '#ec4899', '#f59e0b'];

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-xl text-xs">
        <p className="font-bold text-white capitalize">{payload[0].name.replace('_', ' ')}</p>
        <p className="text-brand-400 font-semibold mt-1">
          Count: <span className="text-white">{payload[0].value.toLocaleString()}</span>
        </p>
      </div>
    );
  }
  return null;
};

const AnalyticsDashboard = () => {
  const dispatch = useDispatch();
  const { analytics, loading, error } = useSelector((state) => state.stats);

  useEffect(() => {
    if (!analytics) {
      dispatch(fetchAnalyticsData());
    }
  }, [dispatch, analytics]);

  const handleRefresh = () => {
    dispatch(clearStatsError());
    dispatch(fetchAnalyticsData());
  };

  // Safe extractions
  const typeData = analytics?.typeStats || [];
  const repoData = analytics?.repoStats || [];
  const sourceData = analytics?.sourceStats || [];
  const languageData = analytics?.languageStats || [];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-dark-border pb-5">
        <div>
          <h1 className="font-heading text-3xl font-bold">Analytics Insights</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Interactive chart visualizations representing repository distributions, types, and language metrics.
          </p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl transition-all cursor-pointer flex items-center gap-2 border border-slate-200 dark:border-dark-border shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Charts
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl flex items-start gap-3 text-rose-600 dark:text-rose-400 animate-fade-in">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1 space-y-1">
            <h4 className="font-bold text-sm">Failed to Load Analytics</h4>
            <p className="text-xs text-rose-500/90">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-2 text-xs font-bold underline cursor-pointer hover:text-rose-700 dark:hover:text-rose-300"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Grid Charts Section */}
      {loading && !analytics ? (
        // Loading Skeleton State
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-dark-border/60 p-6 rounded-3xl shadow-sm h-[380px] animate-pulse flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="h-44 w-44 rounded-full bg-slate-100 dark:bg-slate-850 flex items-center justify-center">
                  <div className="h-32 w-32 rounded-full bg-white dark:bg-dark-card" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart 1: Classification Donut */}
          <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-dark-border/60 p-6 rounded-3xl shadow-sm flex flex-col h-[385px] justify-between">
            <div className="mb-2">
              <h3 className="text-base font-bold flex items-center gap-1.5">
                <PieIcon className="w-4.5 h-4.5 text-brand-500" />
                Classification Type Distribution
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Visual ratio comparison of training dataset classification types.
              </p>
            </div>
            <div className="flex-1 min-h-0 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconSize={10} 
                    iconType="circle"
                    formatter={(value) => <span className="text-xs font-semibold capitalize text-slate-600 dark:text-slate-300">{value.replace('_', ' ')}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Horizontal Top Repositories */}
          <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-dark-border/60 p-6 rounded-3xl shadow-sm flex flex-col h-[385px] justify-between">
            <div className="mb-2">
              <h3 className="text-base font-bold flex items-center gap-1.5">
                <BarChart3 className="w-4.5 h-4.5 text-purple-500" />
                Top 6 Repository Sources
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Repositories contributing the largest volume of dataset samples.
              </p>
            </div>
            <div className="flex-1 min-h-0 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={repoData}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-slate-100 dark:stroke-dark-border/30" />
                  <XAxis type="number" className="text-[10px] fill-slate-400" />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={100}
                    className="text-[10px] font-semibold fill-slate-500 dark:fill-slate-400"
                    tickFormatter={(val) => val.length > 15 ? `${val.substring(0, 12)}...` : val}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
                  <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={16}>
                    {repoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Languages Breakdown */}
          <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-dark-border/60 p-6 rounded-3xl shadow-sm flex flex-col h-[385px] justify-between">
            <div className="mb-2">
              <h3 className="text-base font-bold flex items-center gap-1.5">
                <BarChart3 className="w-4.5 h-4.5 text-emerald-500" />
                Language / Extension Distribution
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Total dataset inventory grouped by file extensions (e.g. py, js).
              </p>
            </div>
            <div className="flex-1 min-h-0 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={languageData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-100 dark:stroke-dark-border/30" />
                  <XAxis 
                    dataKey="name" 
                    className="text-[10px] font-bold fill-slate-500 dark:fill-slate-400 uppercase"
                  />
                  <YAxis className="text-[10px] fill-slate-400" />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={24}>
                    {languageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Platform Source Type Pie */}
          <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-dark-border/60 p-6 rounded-3xl shadow-sm flex flex-col h-[385px] justify-between">
            <div className="mb-2">
              <h3 className="text-base font-bold flex items-center gap-1.5">
                <PieIcon className="w-4.5 h-4.5 text-orange-500" />
                Platform Source Type
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Breakdown of training dataset files by platform origins.
              </p>
            </div>
            <div className="flex-1 min-h-0 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    dataKey="count"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconSize={10} 
                    formatter={(value) => <span className="text-xs font-semibold capitalize text-slate-600 dark:text-slate-300">{value.replace('_', ' ')}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
