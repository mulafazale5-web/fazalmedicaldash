import React, { useState } from 'react';
import { Phone, Clock, Menu, X, PlusCircle, User, LogIn, LogOut, CheckCircle, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenBooking: (prefill?: { departmentId?: string; doctorId?: string }) => void;
  onOpenEmergency: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenBooking,
  onOpenEmergency,
  onOpenAuth
}) => {
  const { user, userProfile, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'departments', label: 'Departments' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'about', label: 'About Us' },
    { id: 'bookings', label: 'My Bookings' }
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Emergency Utility Strip */}
      <div className="bg-slate-900 text-white text-xs px-4 sm:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1.5 font-medium text-slate-200">
              <Phone className="w-3.5 h-3.5 text-rose-400" />
              Emergency Hotline: <a href="tel:18004192273" className="text-white hover:text-rose-300 font-semibold underline underline-offset-2">1800-419-CARE</a>
            </span>
            <span className="hidden md:inline text-slate-500" aria-hidden="true">·</span>
            <span className="hidden md:flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              24/7 Level-1 Trauma & Critical Care Center
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenEmergency}
              className="text-rose-300 hover:text-rose-200 font-medium underline underline-offset-2 transition-colors cursor-pointer"
            >
              Rapid Ambulance Request
            </button>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <span className="text-slate-400">JCI & NABH Accredited</span>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 group focus-visible:outline-2 focus-visible:outline-teal-600 rounded-md"
        >
          <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm group-hover:bg-teal-700 transition-colors">
            <PlusCircle className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
              MGICare Hospitals
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`transition-colors whitespace-nowrap shrink-0 relative py-1 hover:text-teal-700 cursor-pointer ${
                currentPage === link.id
                  ? 'text-teal-700 font-semibold'
                  : 'text-slate-600'
              }`}
            >
              {link.label}
              {currentPage === link.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Action & User Status */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-xs font-medium text-slate-700"
              >
                <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                  {(userProfile?.displayName || user.email || 'P')[0].toUpperCase()}
                </div>
                <span className="max-w-[110px] truncate font-semibold">
                  {userProfile?.displayName || user.email?.split('@')[0]}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 p-2 text-xs space-y-1 z-50">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-900 truncate">{userProfile?.displayName || 'Patient'}</p>
                    <p className="text-slate-500 truncate text-[11px]">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      handleNavClick('bookings');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    My Appointments
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        handleNavClick('admin');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-teal-50 text-teal-800 font-medium flex items-center gap-2 cursor-pointer"
                    >
                      <Shield className="w-3.5 h-3.5 text-teal-600" />
                      Hospital Admin Portal
                    </button>
                  )}
                  <button
                    onClick={async () => {
                      setUserMenuOpen(false);
                      await logout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-teal-600" />
                Sign In
              </button>
            </div>
          )}

          <button
            onClick={() => onOpenBooking()}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-teal-600"
          >
            Book Appointment
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex sm:hidden items-center gap-2">
          {!user ? (
            <button
              onClick={onOpenAuth}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 rounded-md"
            >
              Sign In
            </button>
          ) : (
            <button
              onClick={() => handleNavClick('bookings')}
              className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center"
            >
              {(userProfile?.displayName || user.email || 'P')[0].toUpperCase()}
            </button>
          )}
          <button
            onClick={() => onOpenBooking()}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md whitespace-nowrap shrink-0"
          >
            Book
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 shadow-lg">
          {user && (
            <div className="p-3 bg-teal-50 rounded-lg border border-teal-100 mb-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">{userProfile?.displayName || 'Patient'}</p>
                <p className="text-[11px] text-slate-500">{user.email}</p>
              </div>
              <button
                onClick={async () => {
                  setMobileMenuOpen(false);
                  await logout();
                }}
                className="text-xs text-rose-600 font-semibold"
              >
                Sign Out
              </button>
            </div>
          )}
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`block w-full text-left px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                currentPage === link.id
                  ? 'bg-teal-50 text-teal-800 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full py-2.5 px-4 text-center text-sm font-semibold text-teal-800 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 flex items-center justify-center gap-1.5"
              >
                <Shield className="w-4 h-4 text-teal-600" />
                Hospital Admin Portal
              </button>
            )}
            {!user && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 px-4 text-center text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Patient Sign In / Sign Up
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-2.5 px-4 text-center text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
            >
              Book an Appointment
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
