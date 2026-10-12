import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Mail,
  LogIn,
  LogOut,
  Search,
  Filter,
  Plus,
  Calendar,
  Clock,
  Download,
  Printer,
  Trash2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  Eye,
  FileText,
  Building,
  Users,
  DollarSign
} from 'lucide-react';
import { useAuth, ADMIN_EMAIL, ADMIN_PASS } from '../context/AuthContext';
import { Appointment } from '../types';
import { DEPARTMENTS, DOCTORS } from '../data/hospitalData';
import {
  subscribeToAllAdminAppointments,
  adminUpdateAppointment,
  adminDeleteAppointment
} from '../services/appointmentService';
import { AdminBookingModal } from '../components/AdminBookingModal';
import { AdminRescheduleModal } from '../components/AdminRescheduleModal';
import { downloadICSFile } from '../utils/storage';

interface AdminPortalPageProps {
  onBackToHospital: () => void;
}

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({ onBackToHospital }) => {
  const { isAdmin, adminUser, adminLogin, adminLogout } = useAuth();

  // Login form state (empty by default for security)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Appointments state
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingApts, setLoadingApts] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'rescheduled' | 'cancelled'>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null);
  const [selectedSlip, setSelectedSlip] = useState<Appointment | null>(null);

  // Load appointments when logged in
  useEffect(() => {
    if (isAdmin) {
      setLoadingApts(true);
      const unsub = subscribeToAllAdminAppointments(
        (items) => {
          setAppointments(items);
          setLoadingApts(false);
        },
        (err) => {
          console.warn('Admin subscription fallback:', err);
          setLoadingApts(false);
        }
      );
      return () => unsub();
    }
  }, [isAdmin]);

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      await adminLogin(loginEmail, loginPassword);
    } catch (err: any) {
      setLoginError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleStatusChange = async (aptId: string, newStatus: 'confirmed' | 'rescheduled' | 'cancelled') => {
    try {
      await adminUpdateAppointment(aptId, { status: newStatus });
    } catch (e) {
      alert('Failed to update appointment status');
    }
  };

  const handleDelete = async (apt: Appointment) => {
    if (window.confirm(`Permanently remove booking ${apt.referenceNumber} for ${apt.patientName}?`)) {
      try {
        await adminDeleteAppointment(apt.id);
        if (selectedSlip?.id === apt.id) setSelectedSlip(null);
      } catch (e) {
        alert('Failed to delete appointment');
      }
    }
  };

  const handleExportCSV = () => {
    if (appointments.length === 0) return;
    const headers = [
      'Reference ID',
      'Patient Name',
      'Age',
      'Gender',
      'Phone',
      'Email',
      'Department',
      'Doctor',
      'Date',
      'Time Slot',
      'Visit Type',
      'Status',
      'Symptoms'
    ];

    const rows = filteredAppointments.map(a => [
      a.referenceNumber,
      `"${a.patientName}"`,
      a.patientAge,
      a.patientGender,
      `"${a.patientPhone}"`,
      `"${a.patientEmail}"`,
      `"${a.departmentName}"`,
      `"${a.doctorName}"`,
      a.date,
      `"${a.timeSlot}"`,
      a.visitType,
      a.status,
      `"${(a.symptoms || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `mgicare_appointments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter logic
  const filteredAppointments = appointments.filter((a) => {
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesDept = deptFilter === 'all' || a.departmentId === deptFilter;
    const matchesSearch =
      a.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.patientPhone.includes(searchQuery) ||
      a.patientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.departmentName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesDept && matchesSearch;
  });

  // KPI Calculations
  const totalBookings = appointments.length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const rescheduledCount = appointments.filter(a => a.status === 'rescheduled').length;
  const cancelledCount = appointments.filter(a => a.status === 'cancelled').length;
  const estimatedRevenue = appointments.filter(a => a.status !== 'cancelled').reduce((acc, curr) => {
    const doc = DOCTORS.find(d => d.id === curr.doctorId);
    return acc + (doc?.consultationFee || 140);
  }, 0);

  // ---------------- VIEW 1: ADMIN LOGIN SCREEN ---------------- //
  if (!isAdmin) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 bg-slate-100">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Card Header */}
          <div className="p-6 bg-slate-900 text-white text-center space-y-2">
            <div className="w-12 h-12 bg-teal-600 rounded-xl mx-auto flex items-center justify-center shadow-md">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">MGICare Administrator Portal</h2>
            <p className="text-xs text-slate-400">
              Restricted Hospital Clinical & Operations Management
            </p>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4">
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900">
              <p className="font-semibold">Authorized Admin Access</p>
              <p className="text-[11px] text-teal-800 mt-0.5">
                Use your hospital administrative credentials to manage patient bookings and OPD rosters.
              </p>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="name@mgicarehospitals.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Security Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                {loginLoading ? 'Authenticating...' : 'Sign In as Administrator'}
              </button>
            </form>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={onBackToHospital}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
              >
                ← Return to Public Hospital Website
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- VIEW 2: ADMIN MANAGEMENT DASHBOARD ---------------- //
  return (
    <div className="min-h-screen bg-slate-100/70 pb-16">
      {/* Top Admin Header Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
              <Shield className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white">
                  MGICare Hospital Operations
                </span>
                <span className="text-[10px] font-bold text-teal-400 bg-teal-950/80 border border-teal-800 px-1.5 py-0.2 rounded">
                  Admin Console
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Logged in as: <strong className="text-slate-200">{adminUser?.email || ADMIN_EMAIL}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={onBackToHospital}
              className="px-3 py-1.5 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              Public Site
            </button>
            <button
              onClick={adminLogout}
              className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 text-rose-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Bookings</span>
            <p className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums mt-1">{totalBookings}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">All Registered Visits</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">Confirmed</span>
            <p className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums mt-1">{confirmedCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Active OPD Consultations</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">Rescheduled</span>
            <p className="text-2xl font-extrabold text-amber-700 font-mono tabular-nums mt-1">{rescheduledCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Adjusted Timings</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider">Cancelled</span>
            <p className="text-2xl font-extrabold text-rose-700 font-mono tabular-nums mt-1">{cancelledCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Archived Slots</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
            <span className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider">Estimated Revenue</span>
            <p className="text-2xl font-extrabold text-teal-800 font-mono tabular-nums mt-1">
              ${estimatedRevenue.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Consultation Fees</p>
          </div>
        </div>

        {/* Action Controls & Filters */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by Reference ID (e.g. MGI-2026-8492), patient name, phone, doctor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            {/* Actions: Add New Booking + Export + Print */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Add New Booking
              </button>

              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
              >
                <Download className="w-4 h-4 text-slate-600" />
                Export CSV
              </button>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                Print List
              </button>
            </div>
          </div>

          {/* Filter Bar: Status & Department */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500">Status:</span>
              {(['all', 'confirmed', 'rescheduled', 'cancelled'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg font-medium capitalize transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500">Department:</span>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:ring-1 focus:ring-teal-600"
              >
                <option value="all">All Clinical Departments</option>
                {DEPARTMENTS.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Appointments Table (Responsive) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              Hospital Bookings Registry ({filteredAppointments.length} matching)
            </h3>
            {loadingApts && (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Syncing...
              </span>
            )}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Ref ID</th>
                  <th className="py-3 px-4">Patient Details</th>
                  <th className="py-3 px-4">Department & Doctor</th>
                  <th className="py-3 px-4">Date & Slot</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-teal-800 tabular-nums">
                        {apt.referenceNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900">{apt.patientName}</p>
                        <p className="text-slate-500 text-[11px]">{apt.patientPhone} · {apt.patientAge}y ({apt.patientGender})</p>
                        <p className="text-slate-400 text-[10px]">{apt.patientEmail}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">{apt.doctorName}</p>
                        <p className="text-teal-700 text-[11px]">{apt.departmentName}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-medium text-slate-900">
                          {new Date(apt.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="text-slate-500 text-[11px]">{apt.timeSlot}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={apt.status}
                          onChange={(e) => handleStatusChange(apt.id, e.target.value as any)}
                          className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer border ${
                            apt.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : apt.status === 'rescheduled'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="rescheduled">Rescheduled</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedSlip(apt)}
                            title="View Consultation Pass"
                            className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setRescheduleAppointment(apt)}
                            title="Reschedule Booking"
                            className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                          >
                            <Calendar className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(apt)}
                            title="Delete Record"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                      No patient appointments found matching the selected criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden divide-y divide-slate-100">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((apt) => (
                <div key={apt.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-teal-800 text-xs tabular-nums">
                      {apt.referenceNumber}
                    </span>
                    <select
                      value={apt.status}
                      onChange={(e) => handleStatusChange(apt.id, e.target.value as any)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer border ${
                        apt.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : apt.status === 'rescheduled'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="rescheduled">Rescheduled</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="text-xs space-y-0.5">
                    <p className="font-bold text-slate-900">{apt.patientName}</p>
                    <p className="text-slate-600">{apt.patientPhone} · {apt.patientAge}y</p>
                    <p className="text-teal-700 font-medium">{apt.doctorName} ({apt.departmentName})</p>
                    <p className="text-slate-500">
                      {apt.date} at {apt.timeSlot}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-50">
                    <button
                      onClick={() => setSelectedSlip(apt)}
                      className="px-2.5 py-1 text-xs border border-slate-200 rounded-md text-slate-700"
                    >
                      View Pass
                    </button>
                    <button
                      onClick={() => setRescheduleAppointment(apt)}
                      className="px-2.5 py-1 text-xs border border-slate-200 rounded-md text-amber-700"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleDelete(apt)}
                      className="px-2.5 py-1 text-xs border border-rose-200 text-rose-600 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs">
                No bookings match your filter.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin Modals */}
      <AdminBookingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {}}
      />

      <AdminRescheduleModal
        appointment={rescheduleAppointment}
        onClose={() => setRescheduleAppointment(null)}
        onSuccess={() => {}}
      />

      {/* Pass/Slip Preview Modal */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Consultation Pass (Admin Record)</h3>
                <p className="text-xs text-slate-400">{selectedSlip.referenceNumber}</p>
              </div>
              <button onClick={() => setSelectedSlip(null)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Patient:</span>
                  <span className="font-bold text-slate-900">{selectedSlip.patientName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-semibold text-slate-900">{selectedSlip.patientPhone}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Doctor:</span>
                  <span className="font-bold text-slate-900">{selectedSlip.doctorName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-semibold text-teal-800">{selectedSlip.departmentName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Scheduled:</span>
                  <span className="font-bold text-slate-900">{selectedSlip.date} at {selectedSlip.timeSlot}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold uppercase text-emerald-700">{selectedSlip.status}</span>
                </div>
                <div className="pt-1">
                  <span className="text-slate-500">Reason / Symptoms:</span>
                  <p className="text-slate-800 font-medium mt-0.5">{selectedSlip.symptoms || 'General OPD consultation'}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => downloadICSFile(selectedSlip)}
                  className="px-3 py-1.5 border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  ICS Calendar
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Pass
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
