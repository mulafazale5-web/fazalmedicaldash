/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AppointmentModal } from './components/AppointmentModal';
import { DoctorProfileModal } from './components/DoctorProfileModal';
import { EmergencyModal } from './components/EmergencyModal';
import { AuthModal } from './components/AuthModal';
import { FirestoreRulesBanner } from './components/FirestoreRulesBanner';
import { HomePage } from './pages/HomePage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { AboutPage } from './pages/AboutPage';
import { MyAppointmentsPage } from './pages/MyAppointmentsPage';
import { AdminPortalPage } from './pages/AdminPortalPage';
import { Doctor } from './types';

function HospitalApp() {
  const [currentPage, setCurrentPage] = useState<string>('home');

  // Secret admin route listener (via #admin or Ctrl+Shift+A hotkey)
  React.useEffect(() => {
    if (window.location.hash === '#admin' || window.location.search.includes('admin')) {
      setCurrentPage('admin');
    }

    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentPage('admin');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret Admin Hotkey: Ctrl + Shift + A or Cmd + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setCurrentPage((prev) => (prev === 'admin' ? 'home' : 'admin'));
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingPrefill, setBookingPrefill] = useState<{
    departmentId?: string;
    doctorId?: string;
  }>({});

  // Doctor Profile View State
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Emergency Modal State
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  // Auth Modal State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authSuccessCallback, setAuthSuccessCallback] = useState<(() => void) | null>(null);

  const handleOpenBooking = (prefill?: { departmentId?: string; doctorId?: string }) => {
    setBookingPrefill(prefill || {});
    setIsBookingOpen(true);
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleBookFromDoctorProfile = (doctorId: string, departmentId: string) => {
    setSelectedDoctor(null);
    handleOpenBooking({ doctorId, departmentId });
  };

  const handleOpenAuth = (onSuccess?: () => void) => {
    if (onSuccess) setAuthSuccessCallback(() => onSuccess);
    else setAuthSuccessCallback(null);
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenBooking={handleOpenBooking}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenAuth={() => handleOpenAuth()}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenBooking={handleOpenBooking}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            onSelectDoctor={handleDoctorSelect}
          />
        )}

        {currentPage === 'departments' && (
          <DepartmentsPage
            onOpenBooking={handleOpenBooking}
            onSelectDoctor={handleDoctorSelect}
          />
        )}

        {currentPage === 'doctors' && (
          <DoctorsPage
            onOpenBooking={handleOpenBooking}
            onSelectDoctor={handleDoctorSelect}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onOpenBooking={() => handleOpenBooking()}
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'bookings' && (
          <MyAppointmentsPage
            onOpenBooking={() => handleOpenBooking()}
            onOpenAuth={() => handleOpenAuth()}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPortalPage
            onBackToHospital={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Footer (hidden on admin portal for focused workspace) */}
      {currentPage !== 'admin' && (
        <Footer
          onNavigate={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenBooking={handleOpenBooking}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
        />
      )}

      {/* Interactive Modals */}
      <AppointmentModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialDepartmentId={bookingPrefill.departmentId}
        initialDoctorId={bookingPrefill.doctorId}
        onViewMyBookings={() => {
          setCurrentPage('bookings');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onRequireAuth={() => handleOpenAuth(() => setIsBookingOpen(true))}
      />

      <DoctorProfileModal
        doctor={selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        onBookDoctor={handleBookFromDoctorProfile}
      />

      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          if (authSuccessCallback) {
            authSuccessCallback();
          }
        }}
        onAdminLogin={() => {
          setCurrentPage('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {currentPage === 'admin' && <FirestoreRulesBanner />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HospitalApp />
    </AuthProvider>
  );
}
