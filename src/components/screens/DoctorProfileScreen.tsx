import React, { useState } from 'react';
import {
  Star,
  MapPin,
  Calendar,
  Clock,
  Award,
  Globe,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Share2,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TopAppBar } from '../common/TopAppBar';
import { TimeSlot } from '../../data/types';

export const DoctorProfileScreen: React.FC = () => {
  const { doctors, selectedDoctorId, navigate, goBack, currencySymbol } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'qualifications' | 'reviews' | 'availability'>('overview');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-11');
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const doctor = doctors.find((d) => d.doctorId === selectedDoctorId) || doctors[0];

  const currentDaySlots =
    doctor.availableSlots.find((s) => s.date === selectedDate)?.slots ||
    doctor.availableSlots[0]?.slots ||
    [];

  const handleBookNow = () => {
    navigate('booking', { doctorId: doctor.doctorId });
  };

  const handleStartChat = () => {
    navigate('chat-conversation', { doctorId: doctor.doctorId, conversationId: `conv_${doctor.doctorId}` });
  };

  return (
    <div className="flex flex-col min-h-full pb-24 bg-[#EAF5F2]">
      <TopAppBar
        title="Doctor Profile"
        showBack
        onBack={goBack}
        rightAction={
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#176B62] hover:bg-[#176B62]/10 transition-colors"
              aria-label="Add to favorites"
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? 'fill-[#F16F6A] text-[#F16F6A]' : 'text-[#176B62]'}`}
              />
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: doctor.fullName, url: window.location.href });
                } else {
                  alert(`Doctor profile link copied for ${doctor.fullName}!`);
                }
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#176B62] hover:bg-[#176B62]/10 transition-colors"
              aria-label="Share doctor"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        }
      />

      {/* Doctor Hero Card */}
      <div className="px-5 pt-3">
        <div className="bg-white rounded-3xl p-5 border border-[#E3ECE9] shadow-xs">
          <div className="flex items-start gap-4">
            <div className="relative w-24 h-24 rounded-3xl overflow-hidden bg-[#EAF5F2] ring-2 ring-[#EAF5F2] shrink-0">
              <img
                src={doctor.profileImageUrl}
                alt={doctor.fullName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#176B62] bg-[#EAF5F2] px-2.5 py-0.5 rounded-full mb-1">
                <span>{doctor.specialty}</span>
              </div>
              <h2 className="text-lg font-extrabold text-[#203936] leading-tight">
                {doctor.fullName}
              </h2>
              <p className="text-xs text-[#7B918D] mt-0.5">
                {doctor.qualifications}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-[#7B918D] mt-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2F8F83] shrink-0" />
                <span className="truncate">{doctor.hospital}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#E3ECE9]">
            <div className="text-center p-2 rounded-2xl bg-[#EAF5F2]/50">
              <div className="flex items-center justify-center text-amber-500 font-extrabold text-sm gap-1">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-500" />
                <span>{doctor.rating.toFixed(1)}</span>
              </div>
              <span className="text-[10px] text-[#7B918D] mt-0.5 block">{doctor.reviewCount} Reviews</span>
            </div>

            <div className="text-center p-2 rounded-2xl bg-[#EAF5F2]/50">
              <span className="text-sm font-extrabold text-[#176B62]">
                {doctor.experienceYears}+ yrs
              </span>
              <span className="text-[10px] text-[#7B918D] mt-0.5 block">Experience</span>
            </div>

            <div className="text-center p-2 rounded-2xl bg-[#EAF5F2]/50">
              <span className="text-sm font-extrabold text-[#176B62]">
                {currencySymbol} {doctor.consultationFee.toLocaleString()}
              </span>
              <span className="text-[10px] text-[#7B918D] mt-0.5 block">Consultation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Overview, Qualifications, Reviews, Availability) */}
      <div className="px-5 mt-4">
        <div className="grid grid-cols-4 p-1 rounded-2xl bg-white border border-[#E3ECE9] text-xs">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'qualifications', label: 'Credentials' },
            { id: 'reviews', label: 'Reviews' },
            { id: 'availability', label: 'Slots' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 rounded-xl font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#176B62] text-white shadow-xs'
                  : 'text-[#7B918D] hover:text-[#203936]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="px-5 mt-3">
        {activeTab === 'overview' && (
          <div className="space-y-3">
            {/* Biography */}
            <div className="bg-white rounded-3xl p-5 border border-[#E3ECE9]">
              <h3 className="text-sm font-extrabold text-[#203936] mb-2">About Doctor</h3>
              <p className="text-xs text-[#7B918D] leading-relaxed">
                {doctor.biography}
              </p>

              <div className="mt-4 pt-3 border-t border-[#E3ECE9] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#203936]">Languages:</span>
                <span className="text-[#176B62] font-medium">{doctor.languages.join(', ')}</span>
              </div>
            </div>

            {/* Clinic Info */}
            <div className="bg-white rounded-3xl p-5 border border-[#E3ECE9]">
              <h3 className="text-sm font-extrabold text-[#203936] mb-2">Affiliated Center</h3>
              <p className="text-xs font-bold text-[#203936]">{doctor.hospital}</p>
              <p className="text-xs text-[#7B918D] mt-0.5">Primary consultation department & tele-clinic suite</p>
              <div className="flex items-center gap-2 mt-3 text-xs text-[#176B62]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Bangladesh Medical & Dental Council (BMDC) practitioner</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'qualifications' && (
          <div className="bg-white rounded-3xl p-5 border border-[#E3ECE9] space-y-4">
            <h3 className="text-sm font-extrabold text-[#203936]">Certifications & Education</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EAF5F2] text-[#176B62] flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#203936]">{doctor.qualifications}</h4>
                  <p className="text-[11px] text-[#7B918D]">Post-Graduate Fellowship & Specialized Residency</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EAF5F2] text-[#176B62] flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#203936]">Global Healthcare Standards</h4>
                  <p className="text-[11px] text-[#7B918D]">Accredited Telemedicine & Clinical Diagnostics</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl p-5 border border-[#E3ECE9] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E3ECE9]">
              <h3 className="text-sm font-extrabold text-[#203936]">Patient Reviews</h3>
              <span className="text-xs font-bold text-amber-500">★ {doctor.rating} ({doctor.reviewCount})</span>
            </div>

            {doctor.reviews.length > 0 ? (
              <div className="space-y-3">
                {doctor.reviews.map((rev) => (
                  <div key={rev.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#203936]">{rev.patientName}</span>
                      <span className="text-[10px] text-[#7B918D]">{rev.date}</span>
                    </div>
                    <div className="flex text-amber-400 text-xs mb-1.5">
                      {'★'.repeat(rev.rating)}
                    </div>
                    <p className="text-xs text-[#7B918D] leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#7B918D] py-4 text-center">
                All 5-star ratings verified from completed tele-consultations.
              </p>
            )}
          </div>
        )}

        {activeTab === 'availability' && (
          <div className="bg-white rounded-3xl p-5 border border-[#E3ECE9] space-y-4">
            <h3 className="text-sm font-extrabold text-[#203936]">Select Date</h3>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {doctor.availableSlots.map((dSlot) => {
                const isSelected = selectedDate === dSlot.date;
                return (
                  <button
                    key={dSlot.date}
                    onClick={() => {
                      setSelectedDate(dSlot.date);
                      setSelectedSlotId(null);
                    }}
                    className={`p-3 rounded-2xl text-center min-w-[80px] border transition-all ${
                      isSelected
                        ? 'bg-[#176B62] border-[#176B62] text-white shadow-xs'
                        : 'bg-slate-50 border-[#E3ECE9] text-[#203936] hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold block opacity-80">
                      {new Date(dSlot.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className="text-sm font-extrabold mt-0.5 block">
                      {dSlot.date.split('-')[2]}
                    </span>
                  </button>
                );
              })}
            </div>

            <h3 className="text-sm font-extrabold text-[#203936] pt-2">Available Time Slots</h3>
            <div className="grid grid-cols-2 gap-2">
              {currentDaySlots.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                return (
                  <button
                    key={slot.id}
                    disabled={!slot.isAvailable}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`p-2.5 rounded-2xl text-xs font-semibold border flex items-center justify-between transition-all ${
                      !slot.isAvailable
                        ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                        : isSelected
                        ? 'bg-[#176B62] border-[#176B62] text-white'
                        : 'bg-white border-[#E3ECE9] text-[#203936] hover:border-[#176B62]'
                    }`}
                  >
                    <span>{slot.time}</span>
                    <span className="text-[10px] opacity-75">{slot.period}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-[#E3ECE9] z-40 flex items-center gap-3">
        <button
          onClick={handleStartChat}
          className="w-12 h-12 rounded-2xl border border-[#176B62] text-[#176B62] hover:bg-[#EAF5F2] flex items-center justify-center shrink-0 active:scale-95 transition-all"
          title="Message doctor"
        >
          <MessageSquare className="w-5 h-5 stroke-[2.2]" />
        </button>

        <button
          onClick={handleBookNow}
          className="flex-1 h-12 rounded-2xl bg-[#176B62] hover:bg-[#104C45] text-white text-sm font-bold shadow-md shadow-[#176B62]/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <Calendar className="w-4 h-4" />
          Book Appointment · {currencySymbol} {doctor.consultationFee.toLocaleString()}
        </button>
      </div>
    </div>
  );
};
