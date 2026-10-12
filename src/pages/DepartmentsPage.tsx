import React, { useState } from 'react';
import {
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Activity,
  HeartHandshake,
  Ambulance,
  Stethoscope,
  Calendar,
  Star,
  MapPin,
  Phone,
  CheckCircle,
  Search,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { DEPARTMENTS, DOCTORS } from '../data/hospitalData';
import { Department, Doctor } from '../types';

interface DepartmentsPageProps {
  onOpenBooking: (prefill?: { departmentId?: string; doctorId?: string }) => void;
  onSelectDoctor: (doctor: Doctor) => void;
}

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({
  onOpenBooking,
  onSelectDoctor
}) => {
  const [activeDepartmentId, setActiveDepartmentId] = useState<string>(DEPARTMENTS[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const getDepartmentIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartPulse': return <HeartPulse className="w-5 h-5" />;
      case 'Brain': return <Brain className="w-5 h-5" />;
      case 'Bone': return <Bone className="w-5 h-5" />;
      case 'Baby': return <Baby className="w-5 h-5" />;
      case 'Activity': return <Activity className="w-5 h-5" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5" />;
      case 'Ambulance': return <Ambulance className="w-5 h-5" />;
      default: return <Stethoscope className="w-5 h-5" />;
    }
  };

  const filteredDepartments = DEPARTMENTS.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.procedures.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedDept = DEPARTMENTS.find(d => d.id === activeDepartmentId) || DEPARTMENTS[0];
  const assignedDoctors = DOCTORS.filter(d => d.departmentId === selectedDept.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">Clinical Specializations</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Hospital Departments & Medical Centers
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          MGICare Hospitals maintains 8 specialized departments. Each clinical center features a dedicated multidisciplinary faculty of senior consultants, fellows, and acute intervention teams.
        </p>
      </div>

      {/* Search & Selector Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search procedures, organs, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
          />
        </div>

        {/* Quick count indicator */}
        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="text-slate-900 font-semibold">{filteredDepartments.length}</span> departments · 25+ board-certified doctors
        </div>
      </div>

      {/* Main Split Layout: Sidebar of Departments + Active Department Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Nav */}
        <div className="lg:col-span-4 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 px-2 mb-2">
            Select Department
          </p>
          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredDepartments.map((dept) => {
              const isSelected = activeDepartmentId === dept.id;
              const docCount = DOCTORS.filter(d => d.departmentId === dept.id).length;
              return (
                <button
                  key={dept.id}
                  onClick={() => setActiveDepartmentId(dept.id)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/80 text-teal-950 font-semibold shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-teal-700'}`}>
                      {getDepartmentIcon(dept.iconName)}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold leading-tight">{dept.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{docCount} Assigned Specialists</p>
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-teal-700' : 'text-slate-300'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Department Details Panel */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Card */}
          <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-2 rounded-lg bg-teal-600 text-white">
                    {getDepartmentIcon(selectedDept.iconName)}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {selectedDept.name}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-teal-700 font-medium">
                  {selectedDept.tagline}
                </p>
              </div>

              <button
                onClick={() => onOpenBooking({ departmentId: selectedDept.id })}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <Calendar className="w-4 h-4" />
                Book in this Department
              </button>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Clinical Scope & Overview
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {selectedDept.description}
              </p>
            </div>

            {/* Quick Metadata: Location, Contact & Emergency */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                <div>
                  <span className="text-slate-500">Location:</span>
                  <p className="font-semibold text-slate-800">{selectedDept.floorLocation}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-600 shrink-0" />
                <div>
                  <span className="text-slate-500">Department Phone:</span>
                  <p className="font-semibold text-slate-800">{selectedDept.phoneExtension}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                <div>
                  <span className="text-slate-500">Emergency Protocol:</span>
                  <p className="font-semibold text-slate-800">
                    {selectedDept.emergencyAvailable ? '24/7 Rapid Triage Active' : 'Scheduled OPD Clinic'}
                  </p>
                </div>
              </div>
            </div>

            {/* Procedures & Facilities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Routine & Advanced Procedures
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {selectedDept.procedures.map((proc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                      <span>{proc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Specialized Infrastructure & Labs
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {selectedDept.facilities.map((fac, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                      <span>{fac}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Doctors Section for This Department */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-teal-600" />
                  Physicians & Specialists in {selectedDept.name} ({assignedDoctors.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Book direct OPD consultations with our attending specialists.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignedDoctors.map((doc) => (
                <div
                  key={doc.id}
                  className="p-5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-teal-700 text-sm">
                          {doc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">{doc.name}</h4>
                            {doc.isHeadOfDepartment && (
                              <span className="text-[10px] font-semibold text-teal-800 bg-teal-100 px-1.5 py-0.5 rounded">
                                Head
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-teal-700 font-medium">{doc.role}</p>
                          <p className="text-[11px] text-slate-500">{doc.degrees}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-amber-500 font-bold shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{doc.rating}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-1">
                      <div className="text-slate-600">
                        <span className="text-slate-400">Experience: </span>
                        <span className="font-medium text-slate-800">{doc.experienceYears} Years</span>
                        <span className="text-slate-300 mx-1.5">·</span>
                        <span className="text-slate-400">Consultation Fee: </span>
                        <span className="font-semibold text-slate-900">${doc.consultationFee}</span>
                      </div>
                      <div className="text-slate-600">
                        <span className="text-slate-400">OPD Days: </span>
                        <span className="font-medium text-slate-800">{doc.opdSchedule}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => onSelectDoctor(doc)}
                      className="flex-1 py-1.5 px-3 text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => onOpenBooking({ doctorId: doc.id, departmentId: doc.departmentId })}
                      className="flex-1 py-1.5 px-3 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors cursor-pointer"
                    >
                      Book Slot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
