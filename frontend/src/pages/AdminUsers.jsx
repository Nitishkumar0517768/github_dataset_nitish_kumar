import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, createUser, updateUser, deleteUser, clearUserError, clearUserSuccess } from '../store/userSlice';
import { showNotification } from '../store/uiSlice';
import { 
  UserPlus, 
  Trash2, 
  Edit2, 
  RefreshCw, 
  Search, 
  ShieldAlert, 
  User as UserIcon, 
  Mail, 
  Lock, 
  X,
  AlertTriangle
} from 'lucide-react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// validation schema for create user
const CreateUserSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Name too short!').required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: Yup.string().oneOf(['user', 'admin'], 'Invalid role').required('Role is required'),
});

// validation schema for update user
const UpdateUserSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Name too short!').required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  role: Yup.string().oneOf(['user', 'admin'], 'Invalid role').required('Role is required'),
});

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users, loading, error, successMessage } = useSelector((state) => state.users);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // if null, we are creating
  
  const [deleteTargetUser, setDeleteTargetUser] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Handle Toast Messages from Slice success
  useEffect(() => {
    if (successMessage) {
      dispatch(showNotification({ message: successMessage, type: 'success' }));
      dispatch(clearUserSuccess());
    }
    if (error) {
      dispatch(showNotification({ message: error, type: 'error' }));
      dispatch(clearUserError());
    }
  }, [successMessage, error, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchUsers());
  };

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (user) => {
    setDeleteTargetUser(user);
    setIsDeleteOpen(true);
  };

  // Submit create or edit
  const handleSubmitUserForm = (values, { setSubmitting, resetForm }) => {
    if (editingUser) {
      dispatch(updateUser({ id: editingUser._id, ...values }))
        .unwrap()
        .then(() => {
          setIsModalOpen(false);
          resetForm();
        })
        .catch(() => {})
        .finally(() => setSubmitting(false));
    } else {
      dispatch(createUser(values))
        .unwrap()
        .then(() => {
          setIsModalOpen(false);
          resetForm();
        })
        .catch(() => {})
        .finally(() => setSubmitting(false));
    }
  };

  // Confirm permanent user deletion
  const handleDeleteConfirm = () => {
    if (deleteTargetUser) {
      dispatch(deleteUser(deleteTargetUser._id))
        .unwrap()
        .then(() => {
          setIsDeleteOpen(false);
          setDeleteTargetUser(null);
        });
    }
  };

  // Client-side search filtering
  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.role?.toLowerCase().includes(term) ||
      u._id?.toLowerCase().includes(term)
    );
  });

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border-purple-100 dark:border-purple-900/30';
    }
    return 'bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-400 border-slate-100 dark:border-slate-800';
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-dark-border pb-5">
        <div>
          <h1 className="font-heading text-3xl font-bold">User Roster</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Inspect, register, modify permissions, and manage user accounts of the platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-brand-500 shadow-md shadow-brand-500/10"
          >
            <UserPlus className="w-4.5 h-4.5" />
            Add User
          </button>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl transition-all cursor-pointer flex items-center gap-2 border border-slate-200 dark:border-dark-border shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-md bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-slate-200/60 dark:border-dark-border/60 p-2">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search user by name, email, role or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all placeholder-slate-400 dark:placeholder-slate-500 text-slate-700 dark:text-slate-300"
        />
      </div>

      {/* Main Table Grid */}
      <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-dark-border/60 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-dark-border bg-slate-50/50 dark:bg-slate-800/10">
                <th className="px-6 py-4 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase align-middle">User ID</th>
                <th className="px-6 py-4 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase align-middle">Profile Name</th>
                <th className="px-6 py-4 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase align-middle">Email Address</th>
                <th className="px-6 py-4 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase align-middle">Role Access</th>
                <th className="px-6 py-4 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase align-middle">Registered On</th>
                <th className="px-6 py-4 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase align-middle text-right animate-pulse">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-border/40">
              {loading && users.length === 0 ? (
                // Skeletons
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4.5"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" /></td>
                    <td className="px-6 py-4.5"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32" /></td>
                    <td className="px-6 py-4.5"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-44" /></td>
                    <td className="px-6 py-4.5"><div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-16" /></td>
                    <td className="px-6 py-4.5"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-28" /></td>
                    <td className="px-6 py-4.5 text-right"><div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center align-middle">
                    <p className="text-sm text-slate-400 font-semibold">No users found matching query conditions.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition-colors group">
                    <td className="px-6 py-4.5 align-middle font-mono text-xs text-slate-400 dark:text-slate-500">
                      #{u._id}
                    </td>
                    <td className="px-6 py-4.5 align-middle font-semibold text-slate-700 dark:text-slate-200">
                      {u.name}
                    </td>
                    <td className="px-6 py-4.5 align-middle text-sm text-slate-500 dark:text-slate-400">
                      {u.email}
                    </td>
                    <td className="px-6 py-4.5 align-middle">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border capitalize ${getRoleBadge(u.role)}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 align-middle text-xs text-slate-400 dark:text-slate-500">
                      {new Date(u.createdAt || Date.now()).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4.5 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(u)}
                          className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg transition-all border border-slate-200/40 dark:border-dark-border/40 cursor-pointer"
                          title="Edit User"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {currentUser?._id !== u._id && (
                          <button
                            onClick={() => handleOpenDeleteModal(u)}
                            className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-all border border-slate-200/40 dark:border-dark-border/40 cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl shadow-2xl flex flex-col justify-between animate-fade-in duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 mb-5">
              <h2 className="text-xl font-bold font-heading text-slate-800 dark:text-slate-100">
                {editingUser ? 'Edit User Profile' : 'Add New User'}
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Set account credentials and role access configuration.
              </p>
            </div>

            <Formik
              initialValues={{
                name: editingUser?.name || '',
                email: editingUser?.email || '',
                password: '',
                role: editingUser?.role || 'user',
              }}
              validationSchema={editingUser ? UpdateUserSchema : CreateUserSchema}
              onSubmit={handleSubmitUserForm}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4">
                  
                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <UserIcon className="w-3.5 h-3.5" /> Full Name
                    </label>
                    <Field 
                      name="name"
                      type="text"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all text-slate-700 dark:text-slate-300"
                    />
                    {errors.name && touched.name && (
                      <span className="text-[10px] font-bold text-rose-500 mt-1 block">{errors.name}</span>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" /> Email Address
                    </label>
                    <Field 
                      name="email"
                      type="email"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all text-slate-700 dark:text-slate-300"
                    />
                    {errors.email && touched.email && (
                      <span className="text-[10px] font-bold text-rose-500 mt-1 block">{errors.email}</span>
                    )}
                  </div>

                  {/* Password field (only for creating) */}
                  {!editingUser && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> Password
                      </label>
                      <Field 
                        name="password"
                        type="password"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all text-slate-700 dark:text-slate-300"
                      />
                      {errors.password && touched.password && (
                        <span className="text-[10px] font-bold text-rose-500 mt-1 block">{errors.password}</span>
                      )}
                    </div>
                  )}

                  {/* Role field */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      User Role Permission
                    </label>
                    <Field 
                      as="select"
                      name="role"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all text-slate-700 dark:text-slate-300"
                    >
                      <option value="user">Standard User</option>
                      <option value="admin">Administrator</option>
                    </Field>
                    {errors.role && touched.role && (
                      <span className="text-[10px] font-bold text-rose-500 mt-1 block">{errors.role}</span>
                    )}
                  </div>

                  {/* Submit buttons */}
                  <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-dark-border/40 mt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl border border-slate-200/60 dark:border-dark-border transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-brand-500/10 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : editingUser ? 'Save Changes' : 'Create Account'}
                    </button>
                  </div>

                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && deleteTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => {
              setIsDeleteOpen(false);
              setDeleteTargetUser(null);
            }}
          />

          <div className="relative w-full max-w-md bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl shadow-2xl flex flex-col justify-between animate-fade-in duration-200">
            <button 
              onClick={() => {
                setIsDeleteOpen(false);
                setDeleteTargetUser(null);
              }}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4 mt-2">
              <div className="h-12 w-12 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-500 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-heading text-lg font-bold text-slate-800 dark:text-slate-100">Delete User Account</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                  Are you sure you want to permanently delete user <span className="font-bold text-slate-600 dark:text-slate-200">{deleteTargetUser.name}</span> (<span className="font-mono">{deleteTargetUser.email}</span>)?
                  This operation cannot be undone and will revoke all access instantly.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteOpen(false);
                  setDeleteTargetUser(null);
                }}
                className="px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl border border-slate-200/60 dark:border-dark-border transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-rose-500/10 transition-colors cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;
