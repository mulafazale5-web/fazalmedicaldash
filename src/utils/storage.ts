import { Appointment } from '../types';

const STORAGE_KEY = 'mgicare_appointments_v1';

export function getStoredAppointments(): Appointment[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial: Appointment[] = [
        {
          id: 'apt-sample-1',
          referenceNumber: 'MGI-2026-8492',
          patientName: 'Eleanor Vance',
          patientEmail: 'eleanor.vance@example.com',
          patientPhone: '+1 (555) 234-5678',
          patientAge: 48,
          patientGender: 'female',
          departmentId: 'orthopedics',
          departmentName: 'Orthopedics & Joint Replacement',
          doctorId: 'doc-ortho-1',
          doctorName: 'Dr. David K. Vance',
          doctorRole: 'Chairman of Orthopedic Surgery & Robotic Lead',
          date: '2026-10-18',
          timeSlot: '10:00 AM',
          visitType: 'follow_up',
          symptoms: 'Routine 6-month postoperative robotic knee evaluation and gait analysis review.',
          status: 'confirmed',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse appointments from localStorage', e);
    return [];
  }
}

export function saveAppointment(appointment: Appointment): void {
  const current = getStoredAppointments();
  const updated = [appointment, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function updateAppointment(id: string, updates: Partial<Appointment>): Appointment | null {
  const current = getStoredAppointments();
  const index = current.findIndex(a => a.id === id || a.referenceNumber === id);
  if (index === -1) return null;
  const updatedItem = { ...current[index], ...updates };
  current[index] = updatedItem;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  return updatedItem;
}

export function cancelAppointment(id: string): boolean {
  const current = getStoredAppointments();
  const target = current.find(a => a.id === id || a.referenceNumber === id);
  if (!target) return false;
  target.status = 'cancelled';
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  return true;
}

export function deleteStoredAppointment(id: string): boolean {
  const current = getStoredAppointments();
  const filtered = current.filter(a => a.id !== id && a.referenceNumber !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered.length !== current.length;
}

export function generateReferenceNumber(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `MGI-2026-${randomSuffix}`;
}

export function downloadICSFile(appointment: Appointment): void {
  const [hoursStr, minutesPart] = appointment.timeSlot.split(':');
  const [minutesStr, period] = (minutesPart || '00 AM').split(' ');
  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10) || 0;
  if (period?.toUpperCase() === 'PM' && hours < 12) hours += 12;
  if (period?.toUpperCase() === 'AM' && hours === 12) hours = 0;

  const dateClean = appointment.date.replace(/-/g, '');
  const startHourStr = String(hours).padStart(2, '0');
  const startMinStr = String(minutes).padStart(2, '0');
  const endHourStr = String((hours + 1) % 24).padStart(2, '0');

  const dtStart = `${dateClean}T${startHourStr}${startMinStr}00`;
  const dtEnd = `${dateClean}T${endHourStr}${startMinStr}00`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MGICare Hospitals//Appointment System//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${appointment.referenceNumber}@mgicare.com`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:Hospital Appointment with ${appointment.doctorName}`,
    `DESCRIPTION:Appointment at MGICare Hospitals\\nDepartment: ${appointment.departmentName}\\nDoctor: ${appointment.doctorName}\\nReference ID: ${appointment.referenceNumber}\\nPatient: ${appointment.patientName}`,
    'LOCATION:MGICare Hospitals, Main Medical Center, 700 Healthcare Blvd',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${appointment.referenceNumber}-appointment.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
