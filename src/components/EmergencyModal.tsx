import React, { useState } from 'react';
import { X, Phone, Ambulance, AlertTriangle, MapPin, CheckCircle, Clock } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const [address, setAddress] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [dispatchRequested, setDispatchRequested] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  if (!isOpen) return null;

  const handleRequestAmbulance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || !emergencyPhone.trim()) return;
    setDispatchRequested(true);
  };

  const handleCopyHospitalAddress = () => {
    navigator.clipboard.writeText('MGICare Hospitals, 700 Healthcare Boulevard, Metro Medical District');
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-rose-200 w-full max-w-xl my-8 overflow-hidden transition-all">
        {/* Header with Red Warning Accent */}
        <div className="px-6 py-4 bg-rose-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-rose-800 flex items-center justify-center text-white">
              <Ambulance className="w-5 h-5 text-rose-100" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">24/7 Emergency & Critical Trauma Hub</h3>
              <p className="text-xs text-rose-100">MGICare Level-1 Rapid Response Center</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close emergency modal"
            className="p-1.5 text-rose-200 hover:text-white rounded-lg hover:bg-rose-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Direct Emergency Call Banner */}
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-800">
              Immediate Life-Threatening Emergency? Call Hotline Now:
            </p>
            <a
              href="tel:18004192273"
              className="inline-flex items-center gap-2 text-2xl font-black text-rose-700 hover:text-rose-800 mt-1"
            >
              <Phone className="w-6 h-6 animate-pulse" />
              1800-419-CARE
            </a>
            <p className="text-xs text-rose-600 mt-1">
              Zero IVR delay · Connects directly to emergency triage physician
            </p>
          </div>

          {/* Ambulance Dispatch Form */}
          {!dispatchRequested ? (
            <form onSubmit={handleRequestAmbulance} className="space-y-3.5 border-t border-slate-100 pt-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Request Immediate Ambulance Dispatch
                </h4>
                <p className="text-xs text-slate-500">
                  Our GPS-equipped Advanced Cardiac Life Support (ACLS) ambulances are positioned across the city.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Pickup Street Address / Landmark *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 142 River Road, Oakwood District (Near Central Park)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Callback Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +1 (555) 019-3388"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Ambulance className="w-4 h-4" />
                Dispatch Nearest ACLS Ambulance
              </button>
            </form>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-center">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Ambulance Unit Dispatched!</h4>
              <p className="text-xs text-slate-600">
                Unit #MGI-EMS-04 has been mobilized to: <span className="font-semibold text-slate-900">{address}</span>
              </p>
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-800 pt-1">
                <Clock className="w-4 h-4" />
                <span>Estimated Arrival: 5–8 minutes</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Dispatch coordinator will ring {emergencyPhone} shortly. Please keep patient seated and airway clear.
              </p>
            </div>
          )}

          {/* Emergency Triage Signs Reminder */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Recognize Critical Signs (F.A.S.T Stroke & Chest Pain):</span>
            </div>
            <ul className="text-slate-600 space-y-1 list-disc list-inside">
              <li>Face drooping, Arm weakness, Slurred speech: Call immediately.</li>
              <li>Crushing central chest heaviness radiating to left shoulder or jaw.</li>
              <li>Acute loss of consciousness, sudden shortness of breath, or trauma.</li>
            </ul>
          </div>

          {/* Hospital Address for Self-Transport */}
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>700 Healthcare Blvd, Main Trauma Gate (Open 24/7)</span>
            </div>
            <button
              onClick={handleCopyHospitalAddress}
              className="text-teal-700 font-semibold hover:underline cursor-pointer"
            >
              {copiedAddress ? 'Copied!' : 'Copy Address'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
