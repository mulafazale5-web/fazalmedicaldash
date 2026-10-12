import React from 'react';
import { ShieldCheck, Award, Heart, CheckCircle2, Building, Users, Calendar, ArrowRight } from 'lucide-react';
import { ACCREDITATIONS, HOSPITAL_STATS } from '../data/hospitalData';

interface AboutPageProps {
  onOpenBooking: () => void;
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenBooking, onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-16">
      {/* 1. Header & Institutional Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">About MGICare Hospitals</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Advancing Clinical Precision with Compassionate Human Care
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Founded with the conviction that tertiary healthcare should combine world-class medical science with uncompromised human warmth, MGICare Hospitals has grown into an international destination for complex surgical, cardiac, neurological, and pediatric care.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Our campus spans over 750,000 square feet designed specifically to facilitate healing, patient safety, infection control, and rapid multi-specialty clinical collaboration.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Schedule a Consultation
            </button>
            <button
              onClick={() => onNavigate('doctors')}
              className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer flex items-center gap-2"
            >
              Meet Our Consultants
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
          <img
            src="/src/assets/images/hero_hospital_building_1791801366034.jpg"
            alt="MGICare Hospitals Main Medical Campus"
            referrerPolicy="no-referrer"
            className="w-full h-80 lg:h-96 object-cover"
          />
        </div>
      </div>

      {/* 2. Hospital Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-slate-900 text-white rounded-2xl shadow-sm">
        {HOSPITAL_STATS.map((stat, i) => (
          <div key={i} className="border-r last:border-r-0 border-slate-800 pr-4">
            <p className="text-3xl font-extrabold text-teal-400 font-mono tabular-nums">{stat.value}</p>
            <p className="text-sm font-semibold text-white mt-1">{stat.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{stat.detail}</p>
          </div>
        ))}
      </div>

      {/* 3. Accreditations & Quality Benchmarks */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">Global Standards</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Certified Clinical Governance & Accreditations
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            MGICare Hospitals adheres strictly to transparent, internationally audited patient safety protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ACCREDITATIONS.map((acc, i) => (
            <div key={i} className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="p-3 rounded-lg bg-teal-50 text-teal-700 border border-teal-100 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">{acc.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">{acc.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Leadership & Message from CMO */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-4 rounded-xl overflow-hidden bg-slate-100">
          <img
            src="/src/assets/images/medical_team_consultation_1791801401517.jpg"
            alt="MGICare Hospitals Clinical Governance Leadership"
            referrerPolicy="no-referrer"
            className="w-full h-64 lg:h-80 object-cover"
          />
        </div>

        <div className="lg:col-span-8 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">Clinical Leadership</span>
          <h3 className="text-2xl font-bold text-slate-900">
            A Message From Our Chief Medical Officer
          </h3>
          <p className="text-sm text-slate-700 italic leading-relaxed">
            "At MGICare Hospitals, our philosophy rests on a straightforward principle: clinical decisions are made purely for the patient's long-term health and dignity. By bringing together top specialists and equipping them with state-of-the-art robotic and imaging suites, we empower our care teams to deliver outcomes that restore hope and return our patients to active, fulfilling lives."
          </p>
          <div className="pt-2">
            <p className="font-bold text-slate-900 text-base">Dr. Aris Thorne, MD, FACC</p>
            <p className="text-xs text-slate-500">Chief Medical Officer & Director of Heart Institute, MGICare Hospitals</p>
          </div>
        </div>
      </div>

      {/* 5. Core Values */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">Guiding Principles</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Our Care Charter
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl border border-slate-200 space-y-2.5">
            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Patient-First Dignity</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every diagnosis is communicated transparently. Families are treated as essential partners in care, not passive spectators.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-slate-200 space-y-2.5">
            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Zero-Compromise Safety</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We benchmark infection rates, medication accuracy, and surgical sterility against leading global centers of health.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-slate-200 space-y-2.5">
            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Continuous Medical Research</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Active participation in multinational clinical trials, translating scientific breakthroughs into accessible bedside therapies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
