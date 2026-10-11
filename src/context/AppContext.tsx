import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Screen,
  Doctor,
  Appointment,
  Conversation,
  Message,
  NotificationItemData,
  User,
  FamilyMember,
} from '../data/types';
import {
  DOCTORS,
  INITIAL_APPOINTMENTS,
  INITIAL_CONVERSATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_USER,
  INITIAL_FAMILY_MEMBERS,
} from '../data/sampleData';

interface AppContextType {
  currentScreen: Screen;
  screenHistory: Screen[];
  navigate: (screen: Screen, params?: { doctorId?: string; specialtyId?: string; appointmentId?: string; conversationId?: string; query?: string }) => void;
  goBack: () => boolean;
  selectedDoctorId: string | null;
  selectedSpecialtyId: string | null;
  selectedAppointmentId: string | null;
  selectedConversationId: string | null;
  doctors: Doctor[];
  appointments: Appointment[];
  conversations: Conversation[];
  notifications: NotificationItemData[];
  user: User;
  familyMembers: FamilyMember[];
  currencySymbol: string;
  setCurrencySymbol: (symbol: string) => void;
  bookAppointment: (booking: {
    doctorId: string;
    appointmentDate: string;
    startTime: string;
    consultationType: 'Online Video' | 'In-Person Visit';
    forFamilyMember?: string;
    problemDescription?: string;
  }) => Appointment;
  cancelAppointment: (appointmentId: string) => void;
  rescheduleAppointment: (appointmentId: string, newDate: string, newTime: string) => void;
  sendMessage: (conversationId: string, text: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void;
  updateUser: (updated: Partial<User>) => void;
  phoneFrameEnabled: boolean;
  setPhoneFrameEnabled: (enabled: boolean) => void;
  codeExportOpen: boolean;
  setCodeExportOpen: (open: boolean) => void;
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [screenHistory, setScreenHistory] = useState<Screen[]>(['home']);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>('doc_1');
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>('MED-2026-9812');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>('conv_1');

  // Persistence in localStorage if available
  const [doctors] = useState<Doctor[]>(DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('medicare_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('medicare_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });
  const [notifications, setNotifications] = useState<NotificationItemData[]>(() => {
    const saved = localStorage.getItem('medicare_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('medicare_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    const saved = localStorage.getItem('medicare_family');
    return saved ? JSON.parse(saved) : INITIAL_FAMILY_MEMBERS;
  });

  const [currencySymbol, setCurrencySymbol] = useState<string>('৳');
  const [phoneFrameEnabled, setPhoneFrameEnabled] = useState<boolean>(true);
  const [codeExportOpen, setCodeExportOpen] = useState<boolean>(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('medicare_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('medicare_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('medicare_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('medicare_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('medicare_family', JSON.stringify(familyMembers));
  }, [familyMembers]);

  const navigate = (
    screen: Screen,
    params?: { doctorId?: string; specialtyId?: string; appointmentId?: string; conversationId?: string }
  ) => {
    if (params?.doctorId) setSelectedDoctorId(params.doctorId);
    if (params?.specialtyId !== undefined) setSelectedSpecialtyId(params.specialtyId);
    if (params?.appointmentId) setSelectedAppointmentId(params.appointmentId);
    if (params?.conversationId) setSelectedConversationId(params.conversationId);

    if (screen !== currentScreen) {
      setScreenHistory((prev) => [...prev, screen]);
      setCurrentScreen(screen);
    }
  };

  const goBack = (): boolean => {
    if (screenHistory.length > 1) {
      const newHistory = [...screenHistory];
      newHistory.pop(); // remove current
      const prevScreen = newHistory[newHistory.length - 1];
      setScreenHistory(newHistory);
      setCurrentScreen(prevScreen);
      return true;
    }
    return false;
  };

  const bookAppointment = ({
    doctorId,
    appointmentDate,
    startTime,
    consultationType,
    forFamilyMember,
    problemDescription,
  }: {
    doctorId: string;
    appointmentDate: string;
    startTime: string;
    consultationType: 'Online Video' | 'In-Person Visit';
    forFamilyMember?: string;
    problemDescription?: string;
  }): Appointment => {
    const doctor = doctors.find((d) => d.doctorId === doctorId) || doctors[0];
    const refNumber = Math.floor(1000 + Math.random() * 9000);
    const newAppointment: Appointment = {
      appointmentId: `MED-2026-${refNumber}`,
      patientId: user.userId,
      patientName: user.fullName,
      forFamilyMember,
      doctorId: doctor.doctorId,
      doctorName: doctor.fullName,
      doctorSpecialty: doctor.specialty,
      doctorImage: doctor.profileImageUrl,
      doctorHospital: doctor.hospital,
      appointmentDate,
      startTime,
      consultationType,
      status: 'Upcoming',
      consultationFee: doctor.consultationFee,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      problemDescription: problemDescription || 'General health consultation',
      meetingUrl: `https://meet.medicare.app/room/med-${refNumber}`,
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    // Also trigger confirmation notification
    const newNotif: NotificationItemData = {
      notificationId: `notif_${Date.now()}`,
      userId: user.userId,
      title: 'Appointment Booked Successfully',
      message: `${consultationType} with ${doctor.fullName} on ${appointmentDate} at ${startTime}.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'appointment',
      relatedAppointmentId: newAppointment.appointmentId,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Also ensure conversation exists
    let existingConv = conversations.find((c) => c.doctorId === doctor.doctorId);
    if (!existingConv) {
      const newConv: Conversation = {
        conversationId: `conv_${doctor.doctorId}`,
        doctorId: doctor.doctorId,
        doctorName: doctor.fullName,
        doctorSpecialty: doctor.specialty,
        doctorImage: doctor.profileImageUrl,
        lastMessage: `Appointment booked for ${appointmentDate} at ${startTime}`,
        lastMessageTimestamp: 'Just now',
        unreadCount: 0,
        messages: [
          {
            messageId: `msg_${Date.now()}`,
            conversationId: `conv_${doctor.doctorId}`,
            senderId: 'system',
            senderName: 'MediCare System',
            messageText: `Appointment confirmed for ${appointmentDate} at ${startTime} (${consultationType}). Reference: ${newAppointment.appointmentId}`,
            timestamp: 'Just now',
            isRead: true,
            isDoctor: false,
          },
        ],
      };
      setConversations((prev) => [newConv, ...prev]);
    }

    return newAppointment;
  };

  const cancelAppointment = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((app) => (app.appointmentId === appointmentId ? { ...app, status: 'Cancelled' as const } : app))
    );
  };

  const rescheduleAppointment = (appointmentId: string, newDate: string, newTime: string) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.appointmentId === appointmentId
          ? { ...app, appointmentDate: newDate, startTime: newTime, status: 'Upcoming' as const }
          : app
      )
    );
  };

  const sendMessage = (conversationId: string, text: string) => {
    const userMsg: Message = {
      messageId: `msg_${Date.now()}`,
      conversationId,
      senderId: user.userId,
      senderName: user.fullName,
      messageText: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
      isDoctor: false,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.conversationId === conversationId) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTimestamp: 'Just now',
            messages: [...c.messages, userMsg],
          };
        }
        return c;
      })
    );

    // Simulated doctor response after 1.5s
    setTimeout(() => {
      const docResponses = [
        'Thank you for the update. Please keep taking your prescribed fluids and monitor your readings.',
        'I have reviewed your message. We will look into this thoroughly during your consultation.',
        'Understood. If symptoms persist or get severe, feel free to request an urgent priority slot.',
      ];
      const doctorReply: Message = {
        messageId: `msg_reply_${Date.now()}`,
        conversationId,
        senderId: 'doc_auto',
        senderName: 'Doctor',
        messageText: docResponses[Math.floor(Math.random() * docResponses.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
        isDoctor: true,
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.conversationId === conversationId) {
            return {
              ...c,
              lastMessage: doctorReply.messageText,
              lastMessageTimestamp: 'Just now',
              unreadCount: c.unreadCount + 1,
              messages: [...c.messages, doctorReply],
            };
          }
          return c;
        })
      );
    }, 1200);
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.notificationId === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const addFamilyMember = (member: Omit<FamilyMember, 'id'>) => {
    const newMember: FamilyMember = {
      ...member,
      id: `fam_${Date.now()}`,
    };
    setFamilyMembers((prev) => [...prev, newMember]);
  };

  const updateUser = (updated: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        screenHistory,
        navigate,
        goBack,
        selectedDoctorId,
        selectedSpecialtyId,
        selectedAppointmentId,
        selectedConversationId,
        doctors,
        appointments,
        conversations,
        notifications,
        user,
        familyMembers,
        currencySymbol,
        setCurrencySymbol,
        bookAppointment,
        cancelAppointment,
        rescheduleAppointment,
        sendMessage,
        markNotificationRead,
        markAllNotificationsRead,
        addFamilyMember,
        updateUser,
        phoneFrameEnabled,
        setPhoneFrameEnabled,
        codeExportOpen,
        setCodeExportOpen,
        unreadNotificationsCount,
        unreadMessagesCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
