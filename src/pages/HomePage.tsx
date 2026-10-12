import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Activity,
  HeartHandshake,
  Ambulance,
  ChevronRight,
  Star,
  CheckCircle2,
  ChevronDown,
  PhoneCall
} from 'lucide-react';
import { DEPARTMENTS, DOCTORS, TESTIMONIALS, FAQS, HOSPITAL_STATS } from '../data/hospitalData';
import { Doctor } from '../types';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onOpenBooking: (prefill?: { departmentId?: string; doctorId?: string }) => void;
  onOpenEmergency: () => void;
  onSelectDoctor: (doctor: Doctor) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenBooking,
  onOpenEmergency,
  onSelectDoctor
}) => {
  // Quick Booking bar state in hero
  const [quickDeptId, setQuickDeptId] = useState(DEPARTMENTS[0].id);
  const [quickDoctorId, setQuickDoctorId] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  // Filter doctors for the quick selector
  const availableDoctorsForDept = DOCTORS.filter(d => d.departmentId === quickDeptId);

  const handleQuickBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenBooking({
      departmentId: quickDeptId,
      doctorId: quickDoctorId || availableDoctorsForDept[0]?.id
    });
  };

  const getDepartmentIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-teal-600" />;
      case 'Brain': return <Brain className="w-5 h-5 text-teal-600" />;
      case 'Bone': return <Bone className="w-5 h-5 text-teal-600" />;
      case 'Baby': return <Baby className="w-5 h-5 text-teal-600" />;
      case 'Activity': return <Activity className="w-5 h-5 text-teal-600" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5 text-teal-600" />;
      case 'Ambulance': return <Ambulance className="w-5 h-5 text-teal-600" />;
      default: return <Stethoscope className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        {/* Background Image with Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_hospital_building_1791801366034.jpg"
            alt="MGICare Hospitals Medical Campus Exterior"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-12 sm:pb-20">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-300 bg-teal-950/70 border border-teal-800/80 px-3 py-1 rounded-full">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>International Standard Healthcare · JCI Accredited</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
              Advanced Clinical Excellence. Compassionate Patient Care.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              MGICare Hospitals unites world-renowned medical specialists, cutting-edge diagnostic technology, and dedicated nursing care across 8 multidisciplinary clinical departments.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onOpenBooking()}
                className="px-6 py-3.5 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white font-semibold text-sm rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-teal-400"
              >
                <Calendar className="w-4 h-4" />
                Book Doctor Appointment
              </button>

              <button
                onClick={() => onNavigate('departments')}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-semibold text-sm rounded-xl border border-white/20 transition-all cursor-pointer flex items-center gap-2"
              >
                Explore Departments
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Appointment Booking Strip embedded at hero bottom */}
          <div className="mt-12 p-4 sm:p-6 bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>Fast OPD Consultation Booking</span>
            </div>

            <form onSubmit={handleQuickBookSubmit} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Select Department</label>
                <select
                  value={quickDeptId}
                  onChange={(e) => {
                    setQuickDeptId(e.target.value);
                    const docs = DOCTORS.filter(d => d.departmentId === e.target.value);
                    setQuickDoctorId(docs[0]?.id || '');
                  }}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Select Doctor</label>
                <select
                  value={quickDoctorId}
                  onChange={(e) => setQuickDoctorId(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  {availableDoctorsForDept.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.role.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Consultation Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  defaultValue={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Find Available Slots
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. STATS KPI STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6 sm:-mt-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
          {HOSPITAL_STATS.map((stat, i) => (
            <div key={i} className="text-left border-r last:border-r-0 border-slate-100 pr-4">
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-700 tabular-nums font-mono">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 mt-0.5">
                {stat.label}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CLINICAL DEPARTMENTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">Specialized Medicine</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Centers of Clinical Excellence
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Each department is led by experienced medical directors and staffed with multiple specialized doctors equipped with state-of-the-art diagnostic facilities.
            </p>
          </div>
          <button
            onClick={() => onNavigate('departments')}
            className="text-xs sm:text-sm font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
          >
            View all 8 departments
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {DEPARTMENTS.slice(0, 8).map((dept) => {
            const docCount = DOCTORS.filter(d => d.departmentId === dept.id).length;
            return (
              <div
                key={dept.id}
                className="p-5 bg-white rounded-xl border border-slate-200 hover:border-teal-500/60 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center mb-3 group-hover:bg-teal-600 transition-colors">
                    {getDepartmentIcon(dept.iconName)}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-700 transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {dept.tagline}
                  </p>
                  <div className="mt-3 text-xs text-slate-600 flex items-center gap-2">
                    <span className="font-semibold text-teal-700">{docCount} Specialists</span>
                    <span>·</span>
                    <span>{dept.floorLocation}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      onNavigate('departments');
                    }}
                    className="text-xs text-slate-700 hover:text-teal-700 font-medium cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onOpenBooking({ departmentId: dept.id })}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
                  >
                    Book Now
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. CLINICAL EXCELLENCE & INFRASTRUCTURE BENTO GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">Infrastructure & Technology</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Setting New Benchmarks in Surgical & Diagnostic Care
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Operating Theatre (Large col-span-2) */}
          <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="p-6">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Advanced Surgical Suites</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Robotic-Assisted Precision Minimally Invasive Surgery
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                MGICare operates 14 laminar airflow hybrid operation theaters equipped with robotic arms, high-definition live intraoperative MRI, and navigational guidance that reduce blood loss and cut recovery times in half.
              </p>
            </div>
            <div className="h-64 sm:h-80 w-full overflow-hidden bg-slate-100">
              <img
                src="/src/assets/images/surgical_excellence_1791801389479.jpg"
                alt="State of the art surgery and robotic console at MGICare Hospitals"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Card 2: Multidisciplinary Care Team */}
          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="p-6">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Clinical Governance</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Multidisciplinary Tumor & Cardiac Boards
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Every complex case is reviewed collectively by surgeons, medical oncologists, radiologists, and pathologists to ensure personalized treatment protocols.
              </p>
            </div>
            <div className="h-64 sm:h-80 w-full overflow-hidden bg-slate-100">
              <img
                src="/src/assets/images/medical_team_consultation_1791801401517.jpg"
                alt="Senior doctors conducting multidisciplinary clinical review"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Second row bento */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="p-6">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Healing Environment</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Private Inpatient Recovery Suites
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Acoustically insulated private suites designed with ergonomic patient beds, family lounge seating, circadian lighting, and constant biometric telemetry.
              </p>
            </div>
            <div className="h-56 sm:h-64 w-full overflow-hidden bg-slate-100">
              <img
                src="/src/assets/images/hospital_interior_care_1791801378146.jpg"
                alt="Bright sunlit patient suite at MGICare Hospitals"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 text-white p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Emergency Dispatch Commitment</span>
              <h3 className="text-2xl font-bold text-white">
                Under 45 Minutes Door-to-Balloon Time for Heart Attacks
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                Our Level-1 emergency catheterization protocols beat the international benchmark of 90 minutes. With on-campus cardiologists and trauma surgeons on continuous 24/7 standby, life-saving intervention happens without delay.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                  <p className="text-xl font-bold text-teal-300 font-mono">38 min</p>
                  <p className="text-[11px] text-slate-300">Avg Cardiac Door-to-Balloon</p>
                </div>
                <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                  <p className="text-xl font-bold text-teal-300 font-mono">24/7</p>
                  <p className="text-[11px] text-slate-300">On-Site Neuro & Trauma ORs</p>
                </div>
                <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                  <p className="text-xl font-bold text-teal-300 font-mono">100%</p>
                  <p className="text-[11px] text-slate-300">ACLS Certified Paramedics</p>
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center gap-3">
              <button
                onClick={onOpenEmergency}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <PhoneCall className="w-4 h-4" />
                Emergency Hotline (1800-419-CARE)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED DOCTORS CAROUSEL / GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">Medical Specialists</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Meet Our Senior Clinical Consultants
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Board-certified practitioners recognized globally for clinical expertise, patient outcomes, and medical research.
            </p>
          </div>
          <button
            onClick={() => onNavigate('doctors')}
            className="text-xs sm:text-sm font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
          >
            View all 25+ doctors
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {DOCTORS.filter(d => d.isHeadOfDepartment).slice(0, 4).map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-teal-700 font-bold text-base">
                    {doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{doctor.rating}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <h3 className="font-bold text-slate-900 text-base">{doctor.name}</h3>
                  <p className="text-xs font-medium text-teal-700 mt-0.5">{doctor.role}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{doctor.degrees} · {doctor.experienceYears} Years Exp</p>
                </div>

                <div className="mt-3 text-xs text-slate-600">
                  <p className="text-[11px] text-slate-400">Next Available OPD:</p>
                  <p className="font-medium text-slate-800 truncate">{doctor.opdSchedule}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onSelectDoctor(doctor)}
                  className="flex-1 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-white transition-colors cursor-pointer"
                >
                  View Bio
                </button>
                <button
                  onClick={() => onOpenBooking({ doctorId: doctor.id, departmentId: doctor.departmentId })}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors cursor-pointer text-center"
                >
                  Book Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PATIENT STORIES & RECOVERY OUTCOMES */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">Patient Experiences</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Verifiable Patient Recoveries & Clinical Outcomes
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Every patient journey is backed by our dedicated clinical and nursing care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((item) => (
              <div key={item.id} className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.patientName}</h4>
                      <p className="text-xs text-slate-500">{item.patientRole}</p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-teal-800 font-semibold mb-2">
                    Treatment: {item.treatment} ({item.department})
                  </p>

                  <p className="text-sm text-slate-700 leading-relaxed italic">
                    "{item.comment}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {item.outcome}
                  </span>
                  <span className="text-slate-400">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">Patient Support</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Need guidance regarding appointment bookings, visits, or insurance claims?
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div key={faq.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full p-4 text-left font-semibold text-slate-900 text-sm flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
