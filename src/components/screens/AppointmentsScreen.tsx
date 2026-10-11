import React, { useState } from 'react';
import { Calendar, Plus, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TopAppBar } from '../common/TopAppBar';
import { AppointmentCard } from '../common/AppointmentCard';
import { AppointmentStatus } from '../../data/types';

export const AppointmentsScreen: React.FC = () => {
  const { appointments, navigate } = useApp();
  const [activeTab, setActiveTab] = useState<AppointmentStatus>('Upcoming');

  const filteredAppointments = appointments.filter((a) => a.status === activeTab);

  const counts = {
    Upcoming: appointments.filter((a) => a.status === 'Upcoming').length,
    Completed: appointments.filter((a) => a.status === 'Completed').length,
    Cancelled: appointments.filter((a) => a.status === 'Cancelled').length,
  };

  return (
    <div className="flex flex-col min-h-full pb-8 bg-[#EAF5F2]">
      <TopAppBar
        title="My Appointments"
        subtitle="Manage consultations & health records"
        rightAction={
          <button
            onClick={() => navigate('doctors')}
            className="w-10 h-10 rounded-2xl bg-[#176B62] text-white flex items-center justify-center hover:bg-[#104C45] shadow-xs active:scale-95 transition-all"
            aria-label="Book new appointment"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        }
      />

      {/* Segmented Filter Tabs: Upcoming, Completed, Cancelled */}
      <div className="px-5 pt-3">
        <div className="grid grid-cols-3 p-1 rounded-2xl bg-white border border-[#E3ECE9] text-xs">
          {(['Upcoming', 'Completed', 'Cancelled'] as AppointmentStatus[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === tab
                  ? 'bg-[#176B62] text-white shadow-xs'
                  : 'text-[#7B918D] hover:text-[#203936]'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#7B918D]'
                }`}
              >
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Appointment Cards Feed */}
      <div className="px-5 mt-4 space-y-3">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((app) => (
            <AppointmentCard key={app.appointmentId} appointment={app} />
          ))
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center border border-[#E3ECE9] mt-2">
            <div className="w-14 h-14 rounded-2xl bg-[#EAF5F2] text-[#176B62] flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-[#203936]">
              No {activeTab} Appointments
            </h4>
            <p className="text-xs text-[#7B918D] mt-1 max-w-xs mx-auto">
              {activeTab === 'Upcoming'
                ? 'You have no scheduled doctor visits or video sessions right now.'
                : `No ${activeTab.toLowerCase()} records found.`}
            </p>
            {activeTab === 'Upcoming' && (
              <button
                onClick={() => navigate('doctors')}
                className="mt-4 px-5 py-2 rounded-full bg-[#176B62] text-white text-xs font-semibold shadow-xs"
              >
                Find & Book a Doctor
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
