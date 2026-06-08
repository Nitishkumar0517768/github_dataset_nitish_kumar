import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearNotification } from '../store/uiSlice';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContainer = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.ui.notification);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (notification) {
      setVisible(true);
      setProgress(100);

      // Decrement progress bar
      const interval = setInterval(() => {
        setProgress((prev) => Math.max(prev - 2.5, 0));
      }, 100);

      // Clear notification after 4 seconds
      const timeout = setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          dispatch(clearNotification());
        }, 300); // Wait for fade-out animation
      }, 4000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
      setVisible(false);
    }
  }, [notification, dispatch]);

  if (!notification) return null;

  const { message, type } = notification;

  // Configuration for toast styles based on notification type
  const typeConfig = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-100 dark:border-emerald-900/30',
      text: 'text-emerald-800 dark:text-emerald-300',
      progressBg: 'bg-emerald-500',
      icon: CheckCircle
    },
    error: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-100 dark:border-rose-900/30',
      text: 'text-rose-800 dark:text-rose-300',
      progressBg: 'bg-rose-500',
      icon: AlertCircle
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-100 dark:border-amber-900/30',
      text: 'text-amber-800 dark:text-amber-300',
      progressBg: 'bg-amber-500',
      icon: AlertTriangle
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      border: 'border-blue-100 dark:border-blue-900/30',
      text: 'text-blue-800 dark:text-blue-300',
      progressBg: 'bg-blue-500',
      icon: Info
    }
  };

  const current = typeConfig[type] || typeConfig.info;
  const Icon = current.icon;

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      dispatch(clearNotification());
    }, 300);
  };

  return (
    <div className="fixed top-6 right-6 z-50 max-w-sm w-full pointer-events-none">
      <div 
        className={`pointer-events-auto border rounded-2xl shadow-xl overflow-hidden flex flex-col transition-all duration-300 ${
          current.bg
        } ${
          current.border
        } ${
          visible 
            ? 'translate-x-0 opacity-100 scale-100' 
            : 'translate-x-12 opacity-0 scale-95'
        }`}
      >
        <div className="p-4 flex items-start gap-3">
          <div className={`p-1 rounded-lg flex-shrink-0 ${current.text}`}>
            <Icon className="w-5 h-5" />
          </div>
          
          <div className="flex-1 min-w-0 pt-0.5">
            <p className={`text-xs font-semibold leading-relaxed ${current.text}`}>
              {message}
            </p>
          </div>

          <button 
            onClick={handleClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress Bar indicator */}
        <div className="w-full bg-slate-200/40 dark:bg-slate-800/40 h-1">
          <div 
            className={`h-full ${current.progressBg} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ToastContainer;
