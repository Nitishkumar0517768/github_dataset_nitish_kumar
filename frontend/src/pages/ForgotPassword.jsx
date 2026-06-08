import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import apiClient from '../services/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Formik Configuration
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.post('/auth/forgot-password', { email: values.email });
        const otp = response.data.data?.otp;
        console.log('Forgot password request successful, OTP:', otp);
        
        // Redirect immediately to the ResetPassword page passing email and mock OTP in state
        navigate('/reset-password', { 
          state: { 
            email: values.email, 
            otp: otp || '' 
          } 
        });
      } catch (err) {
        console.error('Forgot password error:', err);
        setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b0c10] text-slate-800 dark:text-slate-100 p-4 transition-colors duration-300">
      
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <Link 
          to="/login" 
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border px-3.5 py-1.5 rounded-xl shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-dark-card border border-slate-200/60 dark:border-dark-border/60 p-8 rounded-3xl shadow-xl">
        <div>
          <div className="mb-6">
            <h3 className="font-heading text-2xl font-bold mb-2">Forgot Password?</h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm leading-relaxed">
              Enter your registered email address below, and we will send you a password reset link.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm bg-slate-50 dark:bg-dark-card outline-none transition-all ${
                    formik.touched.email && formik.errors.email
                      ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-dark-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                  }`}
                />
              </div>
              {formik.touched.email && formik.errors.email ? (
                <div className="text-xs text-rose-500 font-semibold">{formik.errors.email}</div>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Reset Link
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
