import React from 'react';
import { Home, Users, Calendar, MessageSquare, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Screen } from '../../data/types';

export const BottomNav: React.FC = () => {
  const { currentScreen, navigate, unreadMessagesCount } = useApp();

  const navItems: { label: string; screen: Screen; icon: React.ElementType; badge?: number }[] = [
    { label: 'Home', screen: 'home', icon: Home },
    { label: 'Doctors', screen: 'doctors', icon: Users },
    { label: 'Appointments', screen: 'appointments', icon: Calendar },
    { label: 'Messages', screen: 'messages', icon: MessageSquare, badge: unreadMessagesCount },
    { label: 'Profile', screen: 'profile', icon: User },
  ];

  // Do not show bottom nav on full-screen consultation or deep modal flows
  if (currentScreen === 'video-consultation') {
    return null;
  }

  return (
    <nav className="sticky bottom-0 z-30 w-full bg-white/95 backdrop-blur-md border-t border-[#E3ECE9] px-2 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
      <div className="grid grid-cols-5 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentScreen === item.screen ||
            (item.screen === 'doctors' && (currentScreen === 'specialties' || currentScreen === 'doctor-profile' || currentScreen === 'booking')) ||
            (item.screen === 'messages' && currentScreen === 'chat-conversation');

          return (
            <button
              key={item.screen}
              onClick={() => navigate(item.screen)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 ${
                isActive ? 'text-[#176B62]' : 'text-[#7B918D] hover:text-[#203936]'
              }`}
            >
              <div
                className={`relative px-3.5 py-1 rounded-full transition-all duration-200 ${
                  isActive ? 'bg-[#EAF5F2]' : 'bg-transparent'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-105 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#F16F6A] text-[10px] font-bold text-white flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] font-medium tracking-tight mt-0.5 transition-all ${
                  isActive ? 'font-bold text-[#176B62]' : 'text-[#7B918D]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
