import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Mail, Lock, Key, ArrowLeft, CheckCircle } from 'lucide-react';
import apiClient from '../services/api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Retrieve email and OTP from route state if they navigated from ForgotPassword
  const initialEmail = location.state?.email || '';
  const initialOtp = location.state?.otp || '';

  // Formik Configuration
  const formik = useFormik({
    initialValues: {
      email: initialEmail,
      otp: initialOtp,
      newPassword: '',
      confirmPassword: '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      otp: Yup.string()
        .length(6, 'OTP must be exactly 6 digits')
        .required('Verification OTP is required'),
      newPassword: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm new password is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        await apiClient.post('/auth/reset-password', {
          email: values.email,
          otp: values.otp,
          newPassword: values.newPassword,
        });
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err) {
        console.error('Reset password error:', err);
        setError(err.response?.data?.message || 'Password reset failed. Please verify email and OTP.');
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
        {success ? (
          <div className="text-center space-y-4 py-4">
            <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-xl font-bold">Password Reset Successful</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Your password has been successfully updated. Redirecting you to the login page...
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h3 className="font-heading text-2xl font-bold mb-2">Reset Password</h3>
              <p className="text-slate-400 dark:text-slate-500 text-sm leading-relaxed">
                Provide your email, the OTP verification code, and your new password credentials.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                {error}
              </div>
            )}

            {initialOtp && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                Mock OTP Code captured: <span className="font-bold underline">{initialOtp}</span>
              </div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              
              {/* Email Input */}
              <div className="space-y-1">
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
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-dark-card outline-none transition-all ${
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

              {/* OTP Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">OTP Code</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="otp"
                    placeholder="123456"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.otp}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-dark-card outline-none transition-all ${
                      formik.touched.otp && formik.errors.otp
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-slate-200 dark:border-dark-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                    }`}
                  />
                </div>
                {formik.touched.otp && formik.errors.otp ? (
                  <div className="text-xs text-rose-500 font-semibold">{formik.errors.otp}</div>
                ) : null}
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="••••••••"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.newPassword}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-dark-card outline-none transition-all ${
                      formik.touched.newPassword && formik.errors.newPassword
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-slate-200 dark:border-dark-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                    }`}
                  />
                </div>
                {formik.touched.newPassword && formik.errors.newPassword ? (
                  <div className="text-xs text-rose-500 font-semibold">{formik.errors.newPassword}</div>
                ) : null}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-dark-card outline-none transition-all ${
                      formik.touched.confirmPassword && formik.errors.confirmPassword
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-slate-200 dark:border-dark-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                    }`}
                  />
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                  <div className="text-xs text-rose-500 font-semibold">{formik.errors.confirmPassword}</div>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
