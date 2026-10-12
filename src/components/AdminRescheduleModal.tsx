import React, { useState } from 'react';
import { X, Calendar, Clock, RefreshCw } from 'lucide-react';
import { Appointment } from '../types';
import { DOCTORS } from '../data/hospitalData';
import { adminUpdateAppointment } from '../services/appointmentService';

interface AdminRescheduleModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminRescheduleModal: React.FC<AdminRescheduleModalProps> = ({
  appointment,
  onClose,
  onSuccess
}) => {
  if (!appointment) return null;

  const [date, setDate] = useState(appointment.date);
  const [timeSlot, setTimeSlot] = useState(appointment.timeSlot);
  const [loading, setLoading] = useState(false);

  const doctor = DOCTORS.find(d => d.id === appointment.doctorId);
  const availableSlots = doctor?.timeSlots || ['09:00 AM', '10:00 AM', '11:15 AM', '02:00 PM', '03:30 PM', '04:30 PM'];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminUpdateAppointment(appointment.id, {
        date,
        timeSlot,
        status: 'rescheduled'
      });
      onSuccess();
      onClose();
    } catch (e) {
      alert('Failed to reschedule appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-white">Reschedule Appointment</h3>
            <p className="text-xs text-slate-400">{appointment.referenceNumber} · {appointment.patientName}</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <p className="text-slate-500">Attending Doctor:</p>
            <p className="font-semibold text-slate-900 text-sm">{appointment.doctorName}</p>
            <p className="text-slate-500">{appointment.departmentName}</p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">New Consultation Date</label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">New Time Slot</label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-600"
            >
              {availableSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Save Reschedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
