import React from 'react';
import { ArrowLeft, Bell, Search, MoreVertical } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TopAppBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  subtitle?: string;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title,
  showBack,
  onBack,
  rightAction,
  subtitle,
}) => {
  const { goBack, navigate, unreadNotificationsCount } = useApp();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      goBack();
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#EAF5F2]/95 backdrop-blur-md border-b border-[#E3ECE9]">
      <div className="flex items-center gap-3 min-w-0">
        {showBack && (
          <button
            onClick={handleBack}
            className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center text-[#176B62] hover:bg-[#176B62]/10 active:scale-95 transition-all"
            aria-label="Navigate back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
        )}
        <div className="min-w-0">
          {title && (
            <h1 className="text-base font-bold text-[#203936] truncate leading-tight tracking-tight">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xs text-[#7B918D] truncate mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {rightAction !== undefined ? (
          rightAction
        ) : (
          <button
            onClick={() => navigate('notifications')}
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#176B62] hover:bg-[#176B62]/10 active:scale-95 transition-all"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F16F6A] ring-2 ring-white animate-pulse" />
            )}
          </button>
        )}
      </div>
    </header>
  );
};
