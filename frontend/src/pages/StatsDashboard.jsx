import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStatsSummary, clearStatsError } from '../store/statsSlice';
import StatCard from '../components/StatCard';
import { 
  Database, 
  Code2, 
  Box, 
  FileText, 
  BookOpen, 
  GitBranch, 
  Binary, 
  Cpu, 
  Activity, 
  AlertCircle, 
  RefreshCw 
} from 'lucide-react';

const GithubIcon = ({ className = "w-5 h-5" }) => (
  <svg 
    className={className} 
    fill="currentColor" 
    viewBox="0 0 24 24" 
    aria-hidden="true"
  >
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" 
    />
  </svg>
);


const StatsDashboard = () => {
  const dispatch = useDispatch();
  const { summary, loading, error } = useSelector((state) => state.stats);

  useEffect(() => {
    if (!summary) {
      dispatch(fetchStatsSummary());
    }
  }, [dispatch, summary]);

  const handleRefresh = () => {
    dispatch(clearStatsError());
    dispatch(fetchStatsSummary());
  };

  // Define details for each of the 10 stats cards
  const statCardsConfig = [
    {
      key: 'total',
      title: 'Total Datasets',
      icon: Database,
      color: 'brand',
      description: 'Grand count of stored records',
    },
    {
      key: 'functions',
      title: 'Functions',
      icon: Code2,
      color: 'blue',
      description: 'Individual function nodes & snippets',
    },
    {
      key: 'classes',
      title: 'Classes',
      icon: Box,
      color: 'purple',
      description: 'Object-oriented structures & templates',
    },
    {
      key: 'documentation',
      title: 'Documentation',
      icon: FileText,
      color: 'emerald',
      description: 'API docs & descriptive comments',
    },
    {
      key: 'readme',
      title: 'README Files',
      icon: BookOpen,
      color: 'orange',
      description: 'Repository main description files',
    },
    {
      key: 'repos',
      title: 'Repositories',
      icon: GitBranch,
      color: 'cyan',
      description: 'Unique repository source origins',
    },
    {
      key: 'languages',
      title: 'Languages',
      icon: Binary,
      color: 'indigo',
      description: 'Unique file extensions found',
    },
    {
      key: 'frameworks',
      title: 'Frameworks',
      icon: Activity,
      color: 'pink',
      description: 'AI & scientific computing tools',
    },
    {
      key: 'github',
      title: 'GitHub Sources',
      icon: GithubIcon,
      color: 'rose',
      description: 'Extracted directly from GitHub repo structures',
    },
    {
      key: 'ai',
      title: 'AI Specific',
      icon: Cpu,
      color: 'amber',
      description: 'Records matching machine learning patterns',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-dark-border pb-5">
        <div>
          <h1 className="font-heading text-3xl font-bold">Inventory Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Real-time metadata statistics and inventory counters of code datasets.
          </p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl transition-all cursor-pointer flex items-center gap-2 border border-slate-200 dark:border-dark-border shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Stats
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl flex items-start gap-3 text-rose-600 dark:text-rose-400">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1 space-y-1">
            <h4 className="font-bold text-sm">Failed to Load Statistics</h4>
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

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {statCardsConfig.map((card) => {
          const statData = summary?.[card.key];
          return (
            <StatCard
              key={card.key}
              title={card.title}
              value={statData?.count ?? 0}
              icon={card.icon}
              color={card.color}
              description={card.description}
              loading={loading && !summary}
            />
          );
        })}
      </div>

      {/* Additional Visual Insights Block */}
      {!loading && summary && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Elements Distribution Section */}
          <div className="lg:col-span-2 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-dark-border/60 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold mb-1">Dataset Element Classification</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
                Relative comparison of dataset contents by code elements
              </p>

              <div className="space-y-4">
                {[
                  { label: 'Functions & Implementations', key: 'functions', color: 'bg-blue-500' },
                  { label: 'Classes & Objects', key: 'classes', color: 'bg-purple-500' },
                  { label: 'Documentation & API Guides', key: 'documentation', color: 'bg-emerald-500' },
                  { label: 'README Files & Repositories', key: 'readme', color: 'bg-orange-500' },
                ].map((item) => {
                  const val = summary[item.key]?.count || 0;
                  const total = summary.total?.count || 1;
                  const percentage = ((val / total) * 100).toFixed(1);

                  return (
                    <div key={item.key} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
                        <span className="text-slate-400">{percentage}% ({val.toLocaleString()})</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full transition-all duration-1000`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-dark-border text-xs text-slate-400">
              Note: A single record may contain both documentation and functions, resulting in overlapping counts.
            </div>
          </div>

          {/* Database Health Monitor Card */}
          <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-dark-border/60 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold mb-1">Database Performance</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
                Connected cluster configuration and storage type
              </p>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-dark-border">
                  <span className="text-slate-400">Cluster Status</span>
                  <span className="font-semibold text-emerald-500">Connected</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-dark-border">
                  <span className="text-slate-400">Primary Database</span>
                  <span className="font-semibold">MongoDB Atlas</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-dark-border">
                  <span className="text-slate-400">Total Index Fields</span>
                  <span className="font-semibold">6 Indexes</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Statistics Cache</span>
                  <span className="font-semibold text-purple-500">O(1) Indexed</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl flex items-center gap-3 mt-6">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                MongoDB query optimizations and indexes are applied to the counts.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsDashboard;
