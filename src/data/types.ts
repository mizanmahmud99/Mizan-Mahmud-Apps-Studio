export type Screen =
  | 'home'
  | 'specialties'
  | 'doctors'
  | 'doctor-profile'
  | 'booking'
  | 'video-consultation'
  | 'appointments'
  | 'messages'
  | 'chat-conversation'
  | 'profile'
  | 'notifications';

export interface User {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profileImageUrl: string;
  dateOfBirth: string;
  bloodGroup: string;
  address: string;
  gender: 'Male' | 'Female' | 'Other';
}

export interface FamilyMember {
  id: string;
  fullName: string;
  relationship: 'Spouse' | 'Child' | 'Parent' | 'Sibling' | 'Other';
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  period: 'Morning' | 'Afternoon' | 'Evening';
  isAvailable: boolean;
}

export interface Review {
  id: string;
  patientName: string;
  patientAvatar?: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Doctor {
  doctorId: string;
  fullName: string;
  specialty: string;
  specialtyId: string;
  qualifications: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  consultationFee: number; // in default currency (৳)
  profileImageUrl: string;
  biography: string;
  hospital: string;
  languages: string[];
  isAvailableToday: boolean;
  isPopular: boolean;
  reviews: Review[];
  availableSlots: {
    date: string; // YYYY-MM-DD
    slots: TimeSlot[];
  }[];
}

export type ConsultationType = 'Online Video' | 'In-Person Visit';
export type AppointmentStatus = 'Upcoming' | 'Completed' | 'Cancelled';

export interface Appointment {
  appointmentId: string;
  patientId: string;
  patientName: string;
  forFamilyMember?: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  doctorHospital: string;
  appointmentDate: string; // YYYY-MM-DD
  startTime: string; // e.g. "10:30 AM"
  consultationType: ConsultationType;
  status: AppointmentStatus;
  consultationFee: number;
  createdAt: string;
  problemDescription?: string;
  meetingUrl?: string;
  prescriptionSummary?: string;
}

export interface Message {
  messageId: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  messageText: string;
  timestamp: string;
  isRead: boolean;
  isDoctor: boolean;
}

export interface Conversation {
  conversationId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  messages: Message[];
}

export type NotificationType = 'appointment' | 'reminder' | 'prescription' | 'system';

export interface NotificationItemData {
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: NotificationType;
  relatedAppointmentId?: string;
}

export interface Specialty {
  id: string;
  name: string;
  iconName: string;
  doctorCount: number;
  description: string;
}
