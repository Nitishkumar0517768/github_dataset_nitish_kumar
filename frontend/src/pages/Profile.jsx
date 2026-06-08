import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { User, Lock, Mail, Shield, ShieldCheck, CheckCircle } from 'lucide-react';
import { updateProfile, changePassword, clearError, clearSuccess } from '../store/authSlice';
import { showNotification } from '../store/uiSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error, successMessage } = useSelector((state) => state.auth);

  // Clear states on unmount
  useEffect(() => {
    dispatch(clearError());
    dispatch(clearSuccess());
  }, [dispatch]);

  // Dispatch toast alert notifications on success or error changes
  useEffect(() => {
    if (successMessage) {
      dispatch(showNotification({ message: successMessage, type: 'success' }));
      dispatch(clearSuccess());
    }
    if (error) {
      dispatch(showNotification({ message: error, type: 'error' }));
      dispatch(clearError());
    }
  }, [successMessage, error, dispatch]);

  // Formik Configuration: Profile Information
  const profileFormik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
    }),
    onSubmit: (values) => {
      dispatch(updateProfile({ name: values.name, email: values.email }));
    },
  });

  // Formik Configuration: Password Change
  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required('Current password is required'),
      newPassword: Yup.string()
        .min(6, 'New password must be at least 6 characters')
        .required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm new password is required'),
    }),
    onSubmit: (values, { resetForm }) => {
      dispatch(
        changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        })
      )
        .unwrap()
        .then(() => {
          resetForm();
        });
    },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-dark-border pb-5">
        <div>
          <h1 className="font-heading text-3xl font-bold">Account Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your profile information and login credentials</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Account Summary Card */}
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-dark-border/60 p-6 rounded-2xl shadow-sm h-fit">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-20 w-20 rounded-full bg-brand-500 text-white flex items-center justify-center text-3xl font-extrabold uppercase shadow-md shadow-brand-500/20">
              {user?.name ? user.name.charAt(0) : <User />}
            </div>
            
            <div>
              <h2 className="text-lg font-bold">{user?.name || 'User'}</h2>
              <p className="text-slate-400 dark:text-slate-500 text-sm">{user?.email}</p>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">
              {user?.role === 'admin' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
                  Administrator
                </>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5 text-slate-500" />
                  Standard User
                </>
              )}
            </div>
          </div>
          
          <div className="mt-8 border-t border-slate-100 dark:border-dark-border pt-6 space-y-4 text-xs text-slate-400 dark:text-slate-500">
            <div className="flex justify-between">
              <span>Account Type</span>
              <span className="font-semibold text-slate-600 dark:text-slate-300 capitalize">{user?.role}</span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <span className="font-semibold text-emerald-500 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
              </span>
            </div>
          </div>
        </div>

        {/* Right Columns: Edit Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Edit Profile Form */}
          <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-dark-border/60 p-6 rounded-2xl shadow-sm">
            <h3 className="font-heading text-lg font-bold border-b border-slate-100 dark:border-dark-border pb-3 mb-5 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-500" />
              Personal Details
            </h3>

            <form onSubmit={profileFormik.handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    onChange={profileFormik.handleChange}
                    onBlur={profileFormik.handleBlur}
                    value={profileFormik.values.name}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-dark-card outline-none transition-all ${
                      profileFormik.touched.name && profileFormik.errors.name
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-slate-200 dark:border-dark-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                    }`}
                  />
                  {profileFormik.touched.name && profileFormik.errors.name ? (
                    <div className="text-xs text-rose-500 font-semibold">{profileFormik.errors.name}</div>
                  ) : null}
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    onChange={profileFormik.handleChange}
                    onBlur={profileFormik.handleBlur}
                    value={profileFormik.values.email}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-dark-card outline-none transition-all ${
                      profileFormik.touched.email && profileFormik.errors.email
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-slate-200 dark:border-dark-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                    }`}
                  />
                  {profileFormik.touched.email && profileFormik.errors.email ? (
                    <div className="text-xs text-rose-500 font-semibold">{profileFormik.errors.email}</div>
                  ) : null}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/10 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-dark-border/60 p-6 rounded-2xl shadow-sm">
            <h3 className="font-heading text-lg font-bold border-b border-slate-100 dark:border-dark-border pb-3 mb-5 flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-500" />
              Security Settings
            </h3>

            <form onSubmit={passwordFormik.handleSubmit} className="space-y-4">
              {/* Current Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="••••••••"
                  onChange={passwordFormik.handleChange}
                  onBlur={passwordFormik.handleBlur}
                  value={passwordFormik.values.currentPassword}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-dark-card outline-none transition-all ${
                    passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword
                      ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-dark-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                  }`}
                />
                {passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword ? (
                  <div className="text-xs text-rose-500 font-semibold">{passwordFormik.errors.currentPassword}</div>
                ) : null}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* New Password */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="••••••••"
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    value={passwordFormik.values.newPassword}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-dark-card outline-none transition-all ${
                      passwordFormik.touched.newPassword && passwordFormik.errors.newPassword
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-slate-200 dark:border-dark-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                    }`}
                  />
                  {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword ? (
                    <div className="text-xs text-rose-500 font-semibold">{passwordFormik.errors.newPassword}</div>
                  ) : null}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    value={passwordFormik.values.confirmPassword}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-dark-card outline-none transition-all ${
                      passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-slate-200 dark:border-dark-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                    }`}
                  />
                  {passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword ? (
                    <div className="text-xs text-rose-500 font-semibold">{passwordFormik.errors.confirmPassword}</div>
                  ) : null}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/10 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
