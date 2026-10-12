export interface Doctor {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string;
  role: string;
  degrees: string;
  experienceYears: number;
  languages: string[];
  opdSchedule: string;
  availableDays: string[];
  timeSlots: string[];
  rating: number;
  reviewsCount: number;
  bio: string;
  specializations: string[];
  education: string[];
  consultationFee: number;
  avatarUrl?: string;
  isHeadOfDepartment?: boolean;
}

export interface Department {
  id: string;
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  headDoctorId: string;
  procedures: string[];
  facilities: string[];
  emergencyAvailable: boolean;
  floorLocation: string;
  phoneExtension: string;
}

export interface Appointment {
  id: string;
  referenceNumber: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAge: number;
  patientGender: 'male' | 'female' | 'other';
  departmentId: string;
  departmentName: string;
  doctorId: string;
  doctorName: string;
  doctorRole: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  visitType: 'first_visit' | 'follow_up' | 'second_opinion';
  symptoms: string;
  status: 'confirmed' | 'rescheduled' | 'cancelled';
  createdAt: string;
}

export interface Testimonial {
  id: string;
  patientName: string;
  patientRole: string;
  treatment: string;
  department: string;
  doctorName: string;
  rating: number;
  comment: string;
  outcome: string;
  date: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'booking' | 'emergency' | 'insurance' | 'visit';
}
