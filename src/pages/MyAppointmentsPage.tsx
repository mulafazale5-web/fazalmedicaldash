import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Search,
  Download,
  Printer,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  User,
  Plus,
  RefreshCw,
  Phone,
  LogIn,
  Cloud
} from 'lucide-react';
import { Appointment } from '../types';
import { getStoredAppointments, cancelAppointment as cancelLocalAppointment, downloadICSFile } from '../utils/storage';
import { subscribeToUserAppointments, cancelAppointmentInFirestore } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';

interface MyAppointmentsPageProps {
  onOpenBooking: () => void;
  onOpenAuth?: () => void;
}

export const MyAppointmentsPage: React.FC<MyAppointmentsPageProps> = ({ onOpenBooking, onOpenAuth }) => {
  const { user, userProfile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [selectedSlipAppointment, setSelectedSlipAppointment] = useState<Appointment | null>(null);
  const [loadingCloud, setLoadingCloud] = useState(false);

  useEffect(() => {
    if (user) {
      setLoadingCloud(true);
      // Subscribe to real-time Firestore appointments
      const unsubscribe = subscribeToUserAppointments(
        user.uid,
        (firestoreAppointments) => {
          setAppointments(firestoreAppointments);
          setLoadingCloud(false);
        },
        (error) => {
          console.warn('Firestore subscription fallback to local cache:', error);
          // Fallback to local storage if network or permissions fail
          const localList = getStoredAppointments();
          setAppointments(localList);
          setLoadingCloud(false);
        }
      );

      return () => unsubscribe();
    } else {
      // For unauthenticated visitors, show local cache
      const list = getStoredAppointments();
      setAppointments(list);
      setLoadingCloud(false);
    }
  }, [user]);

  const handleCancelClick = async (apt: Appointment) => {
    if (window.confirm(`Are you sure you want to cancel appointment ${apt.referenceNumber} with ${apt.doctorName}?`)) {
      if (user) {
        await cancelAppointmentInFirestore(apt.id);
      } else {
        cancelLocalAppointment(apt.id);
        const list = getStoredAppointments();
        setAppointments(list);
      }
      if (selectedSlipAppointment?.id === apt.id) {
        setSelectedSlipAppointment({ ...selectedSlipAppointment, status: 'cancelled' });
      }
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'confirmed' && apt.status === 'confirmed') ||
      (activeTab === 'cancelled' && apt.status === 'cancelled');

    const matchesSearch =
      apt.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientPhone.includes(searchQuery) ||
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.departmentName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">Patient Self-Service</span>
            {user && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded-full">
                <Cloud className="w-3 h-3 text-teal-600" />
                Firebase Synced
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            My Appointments & Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {user
              ? `Signed in as ${userProfile?.displayName || user.email}. Here are your cloud-synced consultations.`
              : 'Look up, download appointment vouchers, sync with your calendar, or manage your hospital visits.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {!user && onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogIn className="w-4 h-4 text-teal-600" />
              Sign In to Sync
            </button>
          )}

          <button
            onClick={onOpenBooking}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Book New Appointment
          </button>
        </div>
      </div>

      {/* Lookup Bar & Status Filter */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search by Reference Number or Phone */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Reference ID (e.g. MGI-2026-8492), phone, patient, or doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          {/* Refresh */}
          <button
            onClick={() => {
              if (user) {
                // Subscription refreshes automatically
              } else {
                setAppointments(getStoredAppointments());
              }
            }}
            title="Refresh appointments list"
            className="p-2.5 text-slate-600 hover:text-slate-900 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${loadingCloud ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          {(['all', 'confirmed', 'cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredAppointments.map((apt) => {
            const isConfirmed = apt.status === 'confirmed';
            return (
              <div
                key={apt.id}
                className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top Bar with Reference and Status */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Booking Reference</span>
                      <p className="font-bold text-teal-800 font-mono text-sm sm:text-base tabular-nums">
                        {apt.referenceNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      {isConfirmed ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Confirmed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                          <XCircle className="w-3.5 h-3.5" />
                          Cancelled
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Doctor & Patient Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 text-xs">
                    <div>
                      <span className="text-slate-400">Doctor & Department</span>
                      <p className="font-bold text-slate-900 text-sm mt-0.5">{apt.doctorName}</p>
                      <p className="text-teal-700 font-medium">{apt.departmentName}</p>
                    </div>

                    <div>
                      <span className="text-slate-400">Patient Details</span>
                      <p className="font-semibold text-slate-900 mt-0.5">{apt.patientName}</p>
                      <p className="text-slate-500">{apt.patientPhone} · {apt.patientAge} yrs</p>
                    </div>
                  </div>

                  {/* Schedule Details */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mt-3 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-800">
                      <Calendar className="w-4 h-4 text-teal-600" />
                      <span className="font-semibold">
                        {new Date(apt.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <Clock className="w-4 h-4 text-teal-600" />
                      <span>{apt.timeSlot}</span>
                    </div>
                  </div>

                  {/* Reason */}
                  {apt.symptoms && (
                    <div className="mt-2 text-xs text-slate-600">
                      <span className="text-slate-400">Reason: </span>
                      <span>{apt.symptoms}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadICSFile(apt)}
                      title="Download calendar event file"
                      className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center gap-1.5 cursor-pointer font-medium"
                    >
                      <Download className="w-3.5 h-3.5 text-teal-600" />
                      Calendar (.ics)
                    </button>
                    <button
                      onClick={() => setSelectedSlipAppointment(apt)}
                      className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center gap-1.5 cursor-pointer font-medium"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-600" />
                      View Slip
                    </button>
                  </div>

                  {isConfirmed && (
                    <button
                      onClick={() => handleCancelClick(apt)}
                      className="py-1.5 px-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg font-medium cursor-pointer transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No appointments found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {user
              ? "You don't have any appointments booked yet under your account."
              : "No appointments matching your criteria. Sign in to retrieve your account's bookings or schedule a new one."}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            {!user && onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Sign In to Account
              </button>
            )}
            <button
              onClick={onOpenBooking}
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors cursor-pointer shadow-sm inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Book an Appointment Now
            </button>
          </div>
        </div>
      )}

      {/* Slip Modal View */}
      {selectedSlipAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg my-8 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">MGICare Consultation Pass</h3>
                <p className="text-xs text-slate-400">{selectedSlipAppointment.referenceNumber}</p>
              </div>
              <button
                onClick={() => setSelectedSlipAppointment(null)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Patient Name:</span>
                  <span className="font-bold text-slate-900">{selectedSlipAppointment.patientName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Attending Doctor:</span>
                  <span className="font-bold text-slate-900">{selectedSlipAppointment.doctorName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-semibold text-teal-800">{selectedSlipAppointment.departmentName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Appointment Date:</span>
                  <span className="font-bold text-slate-900">
                    {new Date(selectedSlipAppointment.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Time Slot:</span>
                  <span className="font-bold text-slate-900">{selectedSlipAppointment.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className={selectedSlipAppointment.status === 'confirmed' ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                    {selectedSlipAppointment.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => downloadICSFile(selectedSlipAppointment)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  ICS File
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 cursor-pointer flex items-center gap-1.5"
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
