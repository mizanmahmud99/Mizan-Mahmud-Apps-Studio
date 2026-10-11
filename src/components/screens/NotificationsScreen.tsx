import React from 'react';
import { Bell, Calendar, Video, FileText, CheckCircle2, ChevronRight, CheckCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TopAppBar } from '../common/TopAppBar';
import { NotificationItemData } from '../../data/types';

export const NotificationsScreen: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, navigate, goBack } = useApp();

  const handleNotificationClick = (notif: NotificationItemData) => {
    markNotificationRead(notif.notificationId);
    if (notif.relatedAppointmentId) {
      navigate('appointments', { appointmentId: notif.relatedAppointmentId });
    }
  };

  const getTypeIcon = (type: NotificationItemData['type']) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-5 h-5 text-[#176B62]" />;
      case 'reminder':
        return <Video className="w-5 h-5 text-[#2F8F83]" />;
      case 'prescription':
        return <FileText className="w-5 h-5 text-cyan-700" />;
      default:
        return <Bell className="w-5 h-5 text-[#F16F6A]" />;
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-8 bg-[#EAF5F2]">
      <TopAppBar
        title="Notifications"
        showBack
        onBack={goBack}
        rightAction={
          <button
            onClick={markAllNotificationsRead}
            className="text-xs font-bold text-[#176B62] hover:text-[#104C45] px-2 py-1 flex items-center gap-1"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all read</span>
          </button>
        }
      />

      <div className="px-5 pt-3 space-y-2.5">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.notificationId}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 rounded-3xl border cursor-pointer transition-all active:scale-[0.99] flex items-start gap-3.5 ${
                notif.isRead
                  ? 'bg-white border-[#E3ECE9] opacity-85'
                  : 'bg-white border-[#176B62]/40 shadow-xs ring-1 ring-[#176B62]/10'
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-[#EAF5F2] flex items-center justify-center shrink-0">
                {getTypeIcon(notif.type)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-extrabold text-[#203936] truncate">
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-[#7B918D] shrink-0">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-xs text-[#7B918D] mt-1 leading-relaxed">
                  {notif.message}
                </p>
                {notif.relatedAppointmentId && (
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#176B62] mt-2">
                    View Appointment <ChevronRight className="w-3 h-3" />
                  </span>
                )}
              </div>

              {!notif.isRead && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#F16F6A] shrink-0 self-center" />
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center border border-[#E3ECE9]">
            <p className="text-xs text-[#7B918D]">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
};
