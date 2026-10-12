import React from 'react';
import { X, Calendar, Clock, Award, Star, GraduationCap, Languages, Check, Stethoscope } from 'lucide-react';
import { Doctor } from '../types';

interface DoctorProfileModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onBookDoctor: (doctorId: string, departmentId: string) => void;
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({
  doctor,
  onClose,
  onBookDoctor
}) => {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden transition-all">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">{doctor.name}</h3>
              <p className="text-xs text-slate-400">{doctor.departmentName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close doctor details"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Doctor Key Highlights */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold text-slate-900">{doctor.name}</h4>
                {doctor.isHeadOfDepartment && (
                  <span className="text-xs font-semibold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                    Department Head
                  </span>
                )}
              </div>
              <p className="text-sm text-teal-700 font-medium">{doctor.role}</p>
              <p className="text-xs text-slate-500 mt-0.5">{doctor.degrees}</p>
            </div>

            <div className="flex sm:flex-col items-end gap-2 text-right">
              <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{doctor.rating}</span>
                <span className="text-xs text-slate-400 font-normal">({doctor.reviewsCount} reviews)</span>
              </div>
              <div className="text-xs text-slate-600 font-medium">
                ${doctor.consultationFee} <span className="text-slate-400 font-normal">Consultation Fee</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Award className="w-3.5 h-3.5 text-teal-600" />
                <span>Experience</span>
              </div>
              <p className="font-bold text-slate-900 text-sm">{doctor.experienceYears}+ Years</p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Languages className="w-3.5 h-3.5 text-teal-600" />
                <span>Languages</span>
              </div>
              <p className="font-semibold text-slate-900 text-xs truncate">
                {doctor.languages.join(', ')}
              </p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg sm:col-span-2">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>OPD Clinic Hours</span>
              </div>
              <p className="font-semibold text-slate-900 text-xs truncate">
                {doctor.opdSchedule}
              </p>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Clinical Background & Practice
            </h5>
            <p className="text-sm text-slate-700 leading-relaxed">
              {doctor.bio}
            </p>
          </div>

          {/* Specializations */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Areas of Special Focus & Procedures
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {doctor.specializations.map((spec, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Fellowships */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Medical Training & Certifications
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {doctor.education.map((edu, i) => (
                <li key={i} className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{edu}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onBookDoctor(doctor.id, doctor.departmentId);
            }}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Book Appointment with {doctor.name.split(' ')[1] || doctor.name}
          </button>
        </div>
      </div>
    </div>
  );
};
