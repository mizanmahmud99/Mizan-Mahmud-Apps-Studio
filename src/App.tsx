/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AndroidPhoneFrame } from './components/android/AndroidPhoneFrame';
import { AndroidCodeViewerModal } from './components/android/AndroidCodeViewerModal';
import { BottomNav } from './components/common/BottomNav';

// 10 Main Screens
import { HomeScreen } from './components/screens/HomeScreen';
import { SpecialtiesScreen } from './components/screens/SpecialtiesScreen';
import { FindDoctorScreen } from './components/screens/FindDoctorScreen';
import { DoctorProfileScreen } from './components/screens/DoctorProfileScreen';
import { BookingScreen } from './components/screens/BookingScreen';
import { VideoConsultationScreen } from './components/screens/VideoConsultationScreen';
import { AppointmentsScreen } from './components/screens/AppointmentsScreen';
import { MessagesScreen } from './components/screens/MessagesScreen';
import { ChatConversationScreen } from './components/screens/ChatConversationScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { NotificationsScreen } from './components/screens/NotificationsScreen';

const ScreenRouter: React.FC = () => {
  const { currentScreen } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'specialties':
        return <SpecialtiesScreen />;
      case 'doctors':
        return <FindDoctorScreen />;
      case 'doctor-profile':
        return <DoctorProfileScreen />;
      case 'booking':
        return <BookingScreen />;
      case 'video-consultation':
        return <VideoConsultationScreen />;
      case 'appointments':
        return <AppointmentsScreen />;
      case 'messages':
        return <MessagesScreen />;
      case 'chat-conversation':
        return <ChatConversationScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="flex flex-col min-h-full flex-1">
      <main className="flex-1 overflow-x-hidden flex flex-col">
        {renderScreen()}
      </main>
      <BottomNav />
      <AndroidCodeViewerModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AndroidPhoneFrame>
        <ScreenRouter />
      </AndroidPhoneFrame>
    </AppProvider>
  );
}
