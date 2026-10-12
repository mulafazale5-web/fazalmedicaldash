import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Download,
  Printer,
  Shield,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Stethoscope,
  LogIn,
  UserPlus,
  Lock,
  Mail,
  Phone
} from 'lucide-react';
import { DEPARTMENTS, DOCTORS } from '../data/hospitalData';
import { Appointment, Doctor } from '../types';
import { generateReferenceNumber, downloadICSFile } from '../utils/storage';
import { createAppointmentInFirestore } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDepartmentId?: string;
  initialDoctorId?: string;
  onViewMyBookings: () => void;
  onRequireAuth?: () => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  initialDepartmentId,
  initialDoctorId,
  onViewMyBookings,
  onRequireAuth
}) => {
  const { user, userProfile, signInWithEmail, signUpWithEmail, loginWithGoogle } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAge, setPatientAge] = useState<number | ''>('');
  const [patientGender, setPatientGender] = useState<'male' | 'female' | 'other'>('female');
  const [visitType, setVisitType] = useState<'first_visit' | 'follow_up' | 'second_opinion'>('first_visit');
  const [symptoms, setSymptoms] = useState('');

  // Inline Auth State (if user is not signed in)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Auto-fill user information when available
  useEffect(() => {
    if (user) {
      if (!patientName) {
        setPatientName(userProfile?.displayName || user.displayName || '');
      }
      if (!patientEmail) {
        setPatientEmail(user.email || '');
      }
      if (!patientPhone && userProfile?.phone) {
        setPatientPhone(userProfile.phone);
      }
    }
  }, [user, userProfile]);

  // Set initial state when modal opens
  useEffect(() => {
    if (isOpen) {
      const deptId = initialDepartmentId || (initialDoctorId ? DOCTORS.find(d => d.id === initialDoctorId)?.departmentId : '') || DEPARTMENTS[0].id;
      setSelectedDeptId(deptId);

      if (initialDoctorId) {
        setSelectedDoctorId(initialDoctorId);
      } else {
        const firstDoc = DOCTORS.find(d => d.departmentId === deptId);
        setSelectedDoctorId(firstDoc ? firstDoc.id : '');
      }

      // Default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];
      setSelectedDate(dateStr);
      setSelectedTimeSlot('');
      setStep(1);
      setFormErrors({});
      setConfirmedAppointment(null);
      setAuthError(null);
    }
  }, [isOpen, initialDepartmentId, initialDoctorId]);

  // When selected department changes, update selected doctor if mismatch
  const handleDepartmentChange = (deptId: string) => {
    setSelectedDeptId(deptId);
    const availableDocs = DOCTORS.filter(d => d.departmentId === deptId);
    if (availableDocs.length > 0) {
      setSelectedDoctorId(availableDocs[0].id);
      setSelectedTimeSlot('');
    }
  };

  const currentDoctor = DOCTORS.find(d => d.id === selectedDoctorId);
  const currentDepartment = DEPARTMENTS.find(d => d.id === selectedDeptId);

  // Available dates (next 7 weekdays)
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
    const formattedDate = d.toISOString().split('T')[0];
    const displayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    return {
      dateStr: formattedDate,
      dayName,
      displayLabel
    };
  });

  const availableSlots = currentDoctor?.timeSlots || [
    '09:00 AM', '10:00 AM', '11:15 AM', '02:00 PM', '03:30 PM', '04:30 PM'
  ];

  const validateStep2 = () => {
    const errors: Record<string, string> = {};
    if (!selectedDate) errors.date = 'Please choose an appointment date';
    if (!selectedTimeSlot) errors.timeSlot = 'Please select a preferred time slot';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = () => {
    const errors: Record<string, string> = {};
    if (!patientName.trim()) errors.patientName = 'Full Name is required';
    if (!patientEmail.trim() || !patientEmail.includes('@')) errors.patientEmail = 'Valid email is required';
    if (!patientPhone.trim() || patientPhone.trim().length < 8) errors.patientPhone = 'Valid contact number is required';
    if (!patientAge || Number(patientAge) <= 0 || Number(patientAge) > 125) errors.patientAge = 'Valid age is required';
    if (!symptoms.trim()) errors.symptoms = 'Please describe symptoms or reason for visit';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInlineAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      if (authMode === 'signup') {
        if (!authName.trim()) throw new Error('Please enter your full name');
        if (authPassword.length < 6) throw new Error('Password must be at least 6 characters');
        await signUpWithEmail(authEmail, authPassword, authName, authPhone);
      } else {
        await signInWithEmail(authEmail, authPassword);
      }
    } catch (err: any) {
      let msg = err.message || 'Authentication failed. Please verify credentials.';
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password')) {
        msg = 'Invalid email or password. Please try again.';
      } else if (msg.includes('auth/email-already-in-use')) {
        msg = 'An account with this email already exists. Please sign in instead.';
      }
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleInlineGoogleLogin = async () => {
    setAuthError(null);
    setAuthLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      if (!err.message?.includes('popup-closed-by-user')) {
        setAuthError(err.message || 'Google sign-in failed. Please use email.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!validateStep3()) return;
    if (!currentDoctor || !currentDepartment) return;

    if (!user) {
      // Must authenticate before booking
      return;
    }

    setBookingLoading(true);
    try {
      const newAppointment: Appointment = {
        id: `apt-${Date.now()}`,
        referenceNumber: generateReferenceNumber(),
        patientName: patientName.trim(),
        patientEmail: patientEmail.trim(),
        patientPhone: patientPhone.trim(),
        patientAge: Number(patientAge),
        patientGender,
        departmentId: currentDepartment.id,
        departmentName: currentDepartment.name,
        doctorId: currentDoctor.id,
        doctorName: currentDoctor.name,
        doctorRole: currentDoctor.role,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        visitType,
        symptoms: symptoms.trim(),
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      // Store in Firebase Firestore
      await createAppointmentInFirestore(newAppointment, user.uid);

      setConfirmedAppointment(newAppointment);
      setStep(4);
    } catch (err) {
      console.error('Failed to create appointment:', err);
      alert('Could not save appointment to database. Please check connection and try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden transition-all">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Book Doctor Appointment</h3>
              <p className="text-xs text-slate-400">MGICare Hospitals · Verified Firebase Patient Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close appointment booking dialog"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progression Bar (only steps 1-3) */}
        {step < 4 && (
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div className={`flex items-center gap-2 ${step === 1 ? 'font-semibold text-teal-700' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step === 1 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'}`}>1</span>
              <span>Doctor & Specialty</span>
            </div>
            <span className="text-slate-300">→</span>
            <div className={`flex items-center gap-2 ${step === 2 ? 'font-semibold text-teal-700' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step === 2 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'}`}>2</span>
              <span>Date & Time</span>
            </div>
            <span className="text-slate-300">→</span>
            <div className={`flex items-center gap-2 ${step === 3 ? 'font-semibold text-teal-700' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step === 3 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'}`}>3</span>
              <span>Patient & Confirmation</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          {/* STEP 1: Select Department and Doctor */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  1. Clinical Department
                </label>
                <select
                  value={selectedDeptId}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} ({dept.floorLocation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  2. Choose Specialist / Attending Physician
                </label>
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {DOCTORS.filter(d => d.departmentId === selectedDeptId).map((doc) => {
                    const isSelected = selectedDoctorId === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoctorId(doc.id)}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50/70 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-slate-900 text-sm">{doc.name}</h4>
                              {doc.isHeadOfDepartment && (
                                <span className="text-[11px] font-medium text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded">
                                  Dept Head
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5">{doc.role} · {doc.degrees}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              Schedule: <span className="text-slate-700 font-medium">{doc.opdSchedule}</span>
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-bold text-slate-900">${doc.consultationFee}</span>
                            <p className="text-[11px] text-slate-500">Consult Fee</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  disabled={!selectedDoctorId}
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white text-sm font-semibold rounded-lg flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  Continue to Date & Time
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Date & Time Picker */}
          {step === 2 && currentDoctor && (
            <div className="space-y-5">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500">Selected Specialist:</span>
                  <p className="font-semibold text-slate-900 text-sm">{currentDoctor.name}</p>
                  <p className="text-slate-600">{currentDoctor.departmentName}</p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-teal-700 hover:underline font-medium"
                >
                  Change
                </button>
              </div>

              {/* Date selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                  Select Appointment Date
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                  {dateOptions.slice(0, 4).map((item) => (
                    <button
                      key={item.dateStr}
                      type="button"
                      onClick={() => setSelectedDate(item.dateStr)}
                      className={`p-2.5 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                        selectedDate === item.dateStr
                          ? 'border-teal-600 bg-teal-50 text-teal-900 font-semibold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <p className="text-[11px] text-slate-500">{item.dayName}</p>
                      <p className="font-medium mt-0.5">{item.displayLabel}</p>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-slate-500">Or pick custom date:</span>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>
                {formErrors.date && <p className="text-xs text-rose-600 mt-1">{formErrors.date}</p>}
              </div>

              {/* Time slot selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                  Available Consultation Slots ({selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' }) : 'Select Date'})
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors cursor-pointer text-center ${
                        selectedTimeSlot === slot
                          ? 'border-teal-600 bg-teal-600 text-white shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                {formErrors.timeSlot && <p className="text-xs text-rose-600 mt-1">{formErrors.timeSlot}</p>}
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep2()) setStep(3);
                  }}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  Continue to Patient Details
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Patient Information & Authentication Gate */}
          {step === 3 && currentDoctor && (
            <div className="space-y-4">
              {/* Doctor / Timing Recap */}
              <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center justify-between">
                <div>
                  <span className="font-semibold">{currentDoctor.name}</span> ({currentDepartment?.name})
                  <div className="text-teal-700 mt-0.5">
                    Appointment: {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at {selectedTimeSlot}
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="text-teal-800 underline font-medium cursor-pointer"
                >
                  Change Date
                </button>
              </div>

              {/* Sign In / Sign Up Gate if NOT logged in */}
              {!user ? (
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 text-teal-800">
                    <Lock className="w-4 h-4 text-teal-600" />
                    <h4 className="font-bold text-sm text-slate-900">Patient Sign In Required Before Booking</h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    Please sign in or create your account to securely store your medical consultation records and view them under "My Bookings".
                  </p>

                  {/* Mode switcher */}
                  <div className="grid grid-cols-2 p-1 bg-white border border-slate-200 rounded-xl text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('signin');
                        setAuthError(null);
                      }}
                      className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                        authMode === 'signin'
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('signup');
                        setAuthError(null);
                      }}
                      className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                        authMode === 'signup'
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Create Account
                    </button>
                  </div>

                  {authError && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {/* Google Login Button */}
                  <button
                    type="button"
                    onClick={handleInlineGoogleLogin}
                    disabled={authLoading}
                    className="w-full py-2 px-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    Continue with Google
                  </button>

                  <div className="flex items-center gap-2">
                    <div className="h-px bg-slate-200 flex-1" />
                    <span className="text-[10px] uppercase text-slate-400 font-semibold">Or with email</span>
                    <div className="h-px bg-slate-200 flex-1" />
                  </div>

                  {/* Form */}
                  <form onSubmit={handleInlineAuthSubmit} className="space-y-2.5">
                    {authMode === 'signup' && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-0.5">Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={authName}
                            onChange={(e) => setAuthName(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-600"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-0.5">Phone Number</label>
                          <input
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            value={authPhone}
                            onChange={(e) => setAuthPhone(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-600"
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-0.5">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="name@example.com"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-0.5">Password *</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-600"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {authLoading ? 'Verifying...' : authMode === 'signin' ? 'Sign In & Continue Booking' : 'Create Account & Continue Booking'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Booking as signed-in patient: <strong className="font-semibold">{userProfile?.displayName || user.displayName || user.email}</strong> ({user.email})
                    </span>
                  </div>
                </div>
              )}

              {/* Patient Details Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Eleanor Vance"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                  {formErrors.patientName && <p className="text-xs text-rose-600 mt-0.5">{formErrors.patientName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +1 (555) 019-2834"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                  {formErrors.patientPhone && <p className="text-xs text-rose-600 mt-0.5">{formErrors.patientPhone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email Address * (For Confirmation & Slip)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. eleanor@example.com"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                  {formErrors.patientEmail && <p className="text-xs text-rose-600 mt-0.5">{formErrors.patientEmail}</p>}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Age *</label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      placeholder="e.g. 42"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                    {formErrors.patientAge && <p className="text-xs text-rose-600 mt-0.5">{formErrors.patientAge}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Gender *</label>
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value as any)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Visit Type</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'first_visit', label: 'First Visit' },
                    { id: 'follow_up', label: 'Follow-Up' },
                    { id: 'second_opinion', label: 'Second Opinion' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setVisitType(t.id as any)}
                      className={`py-2 px-2.5 rounded-lg border text-center transition-colors cursor-pointer ${
                        visitType === t.id
                          ? 'border-teal-600 bg-teal-50 text-teal-800 font-semibold'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Primary Symptoms / Medical Reason *
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe reason for consultation or symptoms observed..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
                {formErrors.symptoms && <p className="text-xs text-rose-600 mt-0.5">{formErrors.symptoms}</p>}
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  disabled={!user || bookingLoading}
                  onClick={handleConfirmBooking}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2"
                >
                  {bookingLoading ? (
                    'Saving to Database...'
                  ) : !user ? (
                    'Sign In Above to Confirm'
                  ) : (
                    <>
                      Confirm & Save Appointment
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation & Slip */}
          {step === 4 && confirmedAppointment && (
            <div className="space-y-5 text-center">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">Appointment Confirmed & Stored!</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Your consultation has been securely recorded to your MGICare account in Firebase Firestore.
                </p>
              </div>

              {/* Printable Appointment Slip */}
              <div id="printable-slip" className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider">Booking Reference</span>
                    <p className="text-base font-bold text-teal-700 font-mono tabular-nums">
                      {confirmedAppointment.referenceNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider">Status</span>
                    <p className="font-semibold text-emerald-700">Confirmed in Firestore</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-500">Patient:</span>
                    <p className="font-semibold text-slate-900 text-sm">{confirmedAppointment.patientName}</p>
                    <p className="text-slate-500">{confirmedAppointment.patientPhone} · {confirmedAppointment.patientAge} yrs ({confirmedAppointment.patientGender})</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Doctor:</span>
                    <p className="font-semibold text-slate-900 text-sm">{confirmedAppointment.doctorName}</p>
                    <p className="text-slate-600">{confirmedAppointment.departmentName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-200">
                  <div>
                    <span className="text-slate-500">Consultation Date:</span>
                    <p className="font-semibold text-slate-900">
                      {new Date(confirmedAppointment.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Time Slot:</span>
                    <p className="font-semibold text-slate-900">{confirmedAppointment.timeSlot}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 text-slate-500 text-[11px]">
                  <p className="font-medium text-slate-700">Patient Instructions:</p>
                  <ul className="list-disc list-inside space-y-0.5 mt-1">
                    <li>Please report to Reception Desk at least 15 minutes before your scheduled slot.</li>
                    <li>Carry valid photo ID and past diagnostic reports / insurance documentation.</li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => downloadICSFile(confirmedAppointment)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-600" />
                  Add to Calendar (.ICS)
                </button>

                <button
                  type="button"
                  onClick={handlePrintSlip}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  Print Slip
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewMyBookings();
                  }}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  View in My Bookings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
