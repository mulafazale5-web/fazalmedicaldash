import React, { useState } from 'react';
import { Search, Calendar, Star, Award, Languages, Filter, Stethoscope } from 'lucide-react';
import { DOCTORS, DEPARTMENTS } from '../data/hospitalData';
import { Doctor } from '../types';

interface DoctorsPageProps {
  onOpenBooking: (prefill?: { departmentId?: string; doctorId?: string }) => void;
  onSelectDoctor: (doctor: Doctor) => void;
}

export const DoctorsPage: React.FC<DoctorsPageProps> = ({
  onOpenBooking,
  onSelectDoctor
}) => {
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'fee'>('rating');

  const filteredDoctors = DOCTORS.filter((doctor) => {
    const matchesDept = selectedDeptFilter === 'all' || doctor.departmentId === selectedDeptFilter;
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specializations.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doctor.languages.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesDept && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
    if (sortBy === 'fee') return a.consultationFee - b.consultationFee;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Page Title & Subtitle */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">Medical Directory</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Find a Doctor & Medical Specialist
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Browse our multidisciplinary medical faculty. Every consultant at MGICare Hospitals holds fellowship certifications, extensive surgical/clinical experience, and dedicated weekly OPD consultation hours.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by doctor name, specialty, condition, or languages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs font-medium border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="rating">Highest Patient Rating</option>
              <option value="experience">Years of Experience</option>
              <option value="fee">Consultation Fee</option>
            </select>
          </div>
        </div>

        {/* Department Filter Buttons */}
        <div>
          <div className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter by Department:</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => setSelectedDeptFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedDeptFilter === 'all'
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              All Departments ({DOCTORS.length})
            </button>
            {DEPARTMENTS.map((dept) => {
              const count = DOCTORS.filter(d => d.departmentId === dept.id).length;
              return (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDeptFilter(dept.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    selectedDeptFilter === dept.id
                      ? 'bg-teal-600 text-white font-semibold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {dept.name.split('&')[0].trim()} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-6 space-y-4">
                {/* Doctor Headlock */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-13 h-13 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center font-bold text-teal-800 text-lg">
                      {doc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-slate-900 text-base">{doc.name}</h3>
                      </div>
                      <p className="text-xs text-teal-700 font-semibold">{doc.departmentName}</p>
                      <p className="text-[11px] text-slate-500">{doc.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-amber-500 font-bold shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{doc.rating}</span>
                  </div>
                </div>

                {/* Badges / Credentials */}
                <div className="text-xs text-slate-600 space-y-1.5 pt-1 border-t border-slate-100">
                  <p className="font-medium text-slate-800">{doc.degrees}</p>
                  <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3 text-teal-600" />
                      {doc.experienceYears}+ Yrs Experience
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Languages className="w-3 h-3 text-teal-600" />
                      {doc.languages.join(', ')}
                    </span>
                  </div>
                </div>

                {/* Clinical Focus Badges */}
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                    Clinical Focus
                  </p>
                  <p className="text-xs text-slate-700 line-clamp-2">
                    {doc.specializations.join(' · ')}
                  </p>
                </div>

                {/* OPD Schedule */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-[11px] text-slate-500">OPD Timings:</span>
                    <span className="font-bold text-slate-900">${doc.consultationFee} <span className="font-normal text-slate-500 text-[10px]">Fee</span></span>
                  </div>
                  <p className="font-medium text-slate-800 mt-0.5 truncate">{doc.opdSchedule}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onSelectDoctor(doc)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-white transition-colors cursor-pointer text-center"
                >
                  View Profile
                </button>
                <button
                  type="button"
                  onClick={() => onOpenBooking({ doctorId: doc.id, departmentId: doc.departmentId })}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Book Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
          <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No doctors match your criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or clearing the selected department filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDeptFilter('all');
            }}
            className="px-4 py-2 text-xs font-semibold text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
