import React from 'react';
import { PlusCircle, MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';
import { DEPARTMENTS } from '../data/hospitalData';

interface FooterProps {
  onNavigate: (page: string) => void;
  onOpenBooking: (prefill?: { departmentId?: string; doctorId?: string }) => void;
  onOpenEmergency: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenBooking,
  onOpenEmergency
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Top Banner inside footer */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-teal-900/60 text-teal-300 border border-teal-700/40 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Emergency Care 24/7</p>
              <p className="text-lg font-bold text-white">1800-419-CARE</p>
              <p className="text-xs text-slate-400">Direct connection to emergency trauma & ambulance dispatch</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-teal-900/60 text-teal-300 border border-teal-700/40 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">OPD Consultation Hours</p>
              <p className="text-sm font-semibold text-white">Mon – Sat: 08:00 AM – 08:00 PM</p>
              <p className="text-xs text-slate-400">Sunday: Specialized Clinics 09:00 AM – 02:00 PM</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-teal-900/60 text-teal-300 border border-teal-700/40 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Main Hospital Campus</p>
              <p className="text-sm font-semibold text-white">700 Healthcare Boulevard</p>
              <p className="text-xs text-slate-400">Medical District, Metro City · Free Patient Parking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <PlusCircle className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                MGICare Hospitals
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Dedicated to clinical excellence, evidence-based patient safety, and compassionate tertiary healthcare. Empowering healing through world-class medical specialists and advanced medical technology.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-teal-400">
                <ShieldCheck className="w-4 h-4" /> JCI Gold Seal Certified
              </span>
              <span>·</span>
              <span>NABH Accredited</span>
              <span>·</span>
              <span>CAP Laboratory</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide mb-4">Hospital Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('departments')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Clinical Departments
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('doctors')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Find a Doctor
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About MGICare
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('bookings')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Manage Appointments
                </button>
              </li>
            </ul>
          </div>

          {/* Key Departments */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide mb-4">Centers of Care</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {DEPARTMENTS.slice(0, 5).map((dept) => (
                <li key={dept.id}>
                  <button
                    onClick={() => {
                      onNavigate('departments');
                    }}
                    className="hover:text-teal-300 transition-colors text-left truncate max-w-[200px] cursor-pointer"
                  >
                    {dept.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Patient Action & Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide mb-4">Patient Portal</h4>
            <div className="space-y-3">
              <button
                onClick={() => onOpenBooking()}
                className="w-full py-2 px-3 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg text-center transition-colors cursor-pointer"
              >
                Book Appointment Online
              </button>
              <button
                onClick={onOpenEmergency}
                className="w-full py-2 px-3 text-xs font-semibold text-rose-300 bg-rose-950/60 border border-rose-800/60 hover:bg-rose-900/60 rounded-lg text-center transition-colors cursor-pointer"
              >
                Emergency Assistance
              </button>
              <div className="pt-2 text-xs text-slate-400 space-y-1">
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  support@mgicarehospitals.com
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  General Desk: +1 (800) 419-CARE
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="cursor-default select-none">
            © {new Date().getFullYear()} MGICare Hospitals & Research Institute. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Patient Bill of Rights</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Clinical Ethics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
