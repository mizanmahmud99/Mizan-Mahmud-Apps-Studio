import React, { useState } from 'react';
import {
  Search,
  Bell,
  Calendar,
  Video,
  FileText,
  Users2,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Heart,
  Clock,
  PhoneCall,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SPECIALTIES } from '../../data/sampleData';
import { DoctorCard } from '../common/DoctorCard';
import { SpecialtyItem } from '../common/SpecialtyItem';

export const HomeScreen: React.FC = () => {
  const { user, doctors, appointments, navigate, currencySymbol, unreadNotificationsCount } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const popularDoctors = doctors.filter((d) => d.isPopular);
  const nextUpcoming = appointments.find((a) => a.status === 'Upcoming');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate('doctors', { query: searchTerm.trim() });
    } else {
      navigate('doctors');
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-8 bg-[#EAF5F2]">
      {/* Top Header Zone: Greeting & User Avatar & Notif */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('profile')}
            className="relative w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-[#176B62]/20 hover:ring-[#176B62] transition-all shrink-0 bg-white"
          >
            <img
              src={user.profileImageUrl}
              alt={user.fullName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </button>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#7B918D] font-medium">
              <span>Good day 👋</span>
            </div>
            <h2 className="text-lg font-extrabold text-[#203936] leading-tight">
              {user.fullName}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('notifications')}
            className="relative w-11 h-11 rounded-2xl bg-white shadow-xs border border-[#E3ECE9] flex items-center justify-center text-[#176B62] hover:bg-[#176B62]/5 active:scale-95 transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 stroke-[2]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#F16F6A] ring-2 ring-white" />
            )}
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="px-5 mt-3">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B918D]" />
          <input
            type="text"
            placeholder="Search doctors, specialties, clinics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white text-xs md:text-sm text-[#203936] placeholder-[#7B918D] border border-[#E3ECE9] shadow-xs focus:outline-hidden focus:border-[#176B62] focus:ring-2 focus:ring-[#176B62]/10 transition-all"
          />
        </form>
      </div>

      {/* Active Upcoming Appointment Banner if exists */}
      {nextUpcoming && (
        <div className="px-5 mt-4">
          <div className="bg-gradient-to-r from-[#176B62] to-[#2F8F83] text-white rounded-3xl p-4 shadow-md flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/80">
                <Clock className="w-3.5 h-3.5" />
                <span>Next Consultation · {nextUpcoming.appointmentDate} at {nextUpcoming.startTime}</span>
              </div>
              <h3 className="text-sm font-bold truncate mt-1">
                {nextUpcoming.doctorName}
              </h3>
              <p className="text-xs text-white/80 truncate">
                {nextUpcoming.doctorSpecialty} · {nextUpcoming.consultationType}
              </p>
            </div>
            {nextUpcoming.consultationType === 'Online Video' ? (
              <button
                onClick={() => navigate('video-consultation', { appointmentId: nextUpcoming.appointmentId, doctorId: nextUpcoming.doctorId })}
                className="shrink-0 px-3.5 py-2 rounded-xl bg-white text-[#176B62] hover:bg-emerald-50 text-xs font-bold shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5" />
                Join
              </button>
            ) : (
              <button
                onClick={() => navigate('appointments')}
                className="shrink-0 px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold"
              >
                View
              </button>
            )}
          </div>
        </div>
      )}

      {/* Promotional Banner */}
      <div className="px-5 mt-4">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1B786E] to-[#12534C] text-white rounded-3xl p-5 shadow-sm">
          <div className="relative z-10 max-w-[70%]">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold tracking-wide uppercase mb-2">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Special Health Pass
            </div>
            <h3 className="text-base font-extrabold leading-tight">
              Early Detection Saves Lives
            </h3>
            <p className="text-xs text-white/80 mt-1 leading-relaxed">
              Book certified specialists with video telemedicine & home care support.
            </p>
            <button
              onClick={() => navigate('doctors')}
              className="mt-3.5 px-4 py-2 rounded-full bg-white text-[#176B62] hover:bg-emerald-50 text-xs font-extrabold shadow-sm active:scale-95 transition-all inline-flex items-center gap-1.5"
            >
              Consult Doctor
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="absolute -right-3 -bottom-4 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute right-4 bottom-3 opacity-90">
            <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-xs">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Matrix */}
      <div className="px-5 mt-5">
        <div className="grid grid-cols-4 gap-2.5">
          <button
            onClick={() => navigate('doctors')}
            className="flex flex-col items-center p-3 rounded-2xl bg-white border border-[#E3ECE9] shadow-2xs hover:border-[#2F8F83] active:scale-95 transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#EAF5F2] text-[#176B62] group-hover:bg-[#176B62] group-hover:text-white flex items-center justify-center transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#203936] mt-2 text-center leading-tight">
              Book Doctor
            </span>
          </button>

          <button
            onClick={() => {
              // Direct video consultation with available doctor
              navigate('doctor-profile', { doctorId: 'doc_1' });
            }}
            className="flex flex-col items-center p-3 rounded-2xl bg-white border border-[#E3ECE9] shadow-2xs hover:border-[#2F8F83] active:scale-95 transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#2F8F83] group-hover:bg-[#2F8F83] group-hover:text-white flex items-center justify-center transition-colors">
              <Video className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#203936] mt-2 text-center leading-tight">
              Tele-Call
            </span>
          </button>

          <button
            onClick={() => navigate('appointments')}
            className="flex flex-col items-center p-3 rounded-2xl bg-white border border-[#E3ECE9] shadow-2xs hover:border-[#2F8F83] active:scale-95 transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-800 group-hover:bg-cyan-700 group-hover:text-white flex items-center justify-center transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#203936] mt-2 text-center leading-tight">
              Records
            </span>
          </button>

          <button
            onClick={() => navigate('profile')}
            className="flex flex-col items-center p-3 rounded-2xl bg-white border border-[#E3ECE9] shadow-2xs hover:border-[#2F8F83] active:scale-95 transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-800 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center transition-colors">
              <Users2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#203936] mt-2 text-center leading-tight">
              Family
            </span>
          </button>
        </div>
      </div>

      {/* Medical Specialties Section */}
      <div className="mt-6">
        <div className="px-5 flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-extrabold text-[#203936] tracking-tight">
              Medical Specialties
            </h3>
            <p className="text-xs text-[#7B918D]">Find specialists by department</p>
          </div>
          <button
            onClick={() => navigate('specialties')}
            className="text-xs font-bold text-[#176B62] hover:text-[#104C45] flex items-center gap-0.5 active:translate-x-0.5 transition-transform"
          >
            See All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal scroll of specialties */}
        <div className="flex gap-3 px-5 overflow-x-auto no-scrollbar pb-1">
          {SPECIALTIES.slice(0, 8).map((specialty) => (
            <SpecialtyItem key={specialty.id} specialty={specialty} compact />
          ))}
        </div>
      </div>

      {/* Popular Doctors Section */}
      <div className="mt-6">
        <div className="px-5 flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-extrabold text-[#203936] tracking-tight">
              Popular Doctors
            </h3>
            <p className="text-xs text-[#7B918D]">Top rated verified healthcare professionals</p>
          </div>
          <button
            onClick={() => navigate('doctors')}
            className="text-xs font-bold text-[#176B62] hover:text-[#104C45] flex items-center gap-0.5 active:translate-x-0.5 transition-transform"
          >
            See All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal Doctor Cards carousel */}
        <div className="flex gap-4 px-5 overflow-x-auto no-scrollbar pb-2">
          {popularDoctors.map((doc) => (
            <DoctorCard key={doc.doctorId} doctor={doc} horizontal />
          ))}
        </div>
      </div>

      {/* Emergency & 24/7 Helpline Card */}
      <div className="px-5 mt-6">
        <div className="bg-white rounded-3xl p-4 border border-[#E3ECE9] shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#F16F6A] flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#203936]">24/7 Medical Emergency</h4>
              <p className="text-[11px] text-[#7B918D]">Need urgent attention? Call emergency desk.</p>
            </div>
          </div>
          <a
            href="tel:999"
            className="px-3.5 py-2 rounded-full bg-[#F16F6A] text-white text-xs font-bold shrink-0 hover:bg-rose-600 transition-colors"
          >
            Call 999
          </a>
        </div>
      </div>
    </div>
  );
};
