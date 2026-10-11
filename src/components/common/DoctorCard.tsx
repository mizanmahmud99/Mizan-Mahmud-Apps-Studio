import React from 'react';
import { Star, Clock, MapPin, Calendar, Video, CheckCircle2 } from 'lucide-react';
import { Doctor } from '../../data/types';
import { useApp } from '../../context/AppContext';

interface DoctorCardProps {
  doctor: Doctor;
  horizontal?: boolean;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, horizontal = false }) => {
  const { navigate, currencySymbol } = useApp();

  const handleCardClick = () => {
    navigate('doctor-profile', { doctorId: doctor.doctorId });
  };

  const handleBookClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('booking', { doctorId: doctor.doctorId });
  };

  if (horizontal) {
    return (
      <div
        onClick={handleCardClick}
        className="w-[280px] shrink-0 bg-white rounded-3xl p-4 shadow-sm border border-[#E3ECE9] hover:border-[#2F8F83]/40 cursor-pointer transition-all duration-200 active:scale-[0.99] flex flex-col justify-between"
      >
        <div>
          <div className="flex items-start gap-3">
            <div className="relative w-16 h-16 shrink-0 rounded-2xl overflow-hidden bg-[#EAF5F2] ring-2 ring-[#EAF5F2]">
              <img
                src={doctor.profileImageUrl}
                alt={doctor.fullName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {doctor.isAvailableToday && (
                <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" title="Available Today" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-[#176B62]">
                <span>{doctor.specialty}</span>
              </div>
              <h3 className="text-sm font-bold text-[#203936] truncate leading-snug">
                {doctor.fullName}
              </h3>
              <p className="text-[11px] text-[#7B918D] truncate">
                {doctor.hospital}
              </p>

              <div className="flex items-center gap-2 mt-1 text-xs">
                <span className="flex items-center text-amber-500 font-semibold gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                  {doctor.rating.toFixed(1)}
                </span>
                <span className="text-[#7B918D] text-[11px]">({doctor.reviewCount})</span>
                <span className="text-[#E3ECE9]">·</span>
                <span className="text-[#7B918D] text-[11px]">{doctor.experienceYears}y exp</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-[#E3ECE9]/70 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#7B918D] uppercase tracking-wider block">Consultation</span>
            <span className="text-sm font-bold text-[#176B62]">
              {currencySymbol} {doctor.consultationFee.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleBookClick}
            className="px-3.5 py-1.5 rounded-full bg-[#176B62] hover:bg-[#104C45] text-white text-xs font-semibold shadow-sm active:scale-95 transition-all"
          >
            Book Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-3xl p-4 shadow-sm border border-[#E3ECE9] hover:border-[#2F8F83]/40 cursor-pointer transition-all duration-200 active:scale-[0.99] flex flex-col gap-3"
    >
      <div className="flex items-start gap-3.5">
        <div className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-[#EAF5F2] ring-2 ring-[#EAF5F2]">
          <img
            src={doctor.profileImageUrl}
            alt={doctor.fullName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          {doctor.isAvailableToday && (
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs font-semibold text-[#176B62] bg-[#EAF5F2] px-2 py-0.5 rounded-md">
              {doctor.specialty}
            </span>
            <div className="flex items-center text-amber-500 font-bold text-xs gap-0.5 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
              <span>{doctor.rating.toFixed(1)}</span>
              <span className="text-[#7B918D] font-normal text-[11px]">({doctor.reviewCount})</span>
            </div>
          </div>

          <h3 className="text-base font-bold text-[#203936] truncate mt-1">
            {doctor.fullName}
          </h3>

          <p className="text-xs text-[#7B918D] truncate">
            {doctor.qualifications}
          </p>

          <div className="flex items-center gap-3 mt-1.5 text-xs text-[#7B918D]">
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 shrink-0 text-[#2F8F83]" />
              <span className="truncate">{doctor.hospital}</span>
            </span>
            <span className="shrink-0">{doctor.experienceYears}y exp</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2.5 border-t border-[#E3ECE9]/70">
        <div>
          <span className="text-[11px] text-[#7B918D] block">Consultation Fee</span>
          <span className="text-base font-extrabold text-[#176B62]">
            {currencySymbol} {doctor.consultationFee.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCardClick}
            className="px-3 py-1.5 rounded-full border border-[#E3ECE9] hover:bg-[#EAF5F2] text-[#203936] text-xs font-medium transition-all"
          >
            Profile
          </button>
          <button
            onClick={handleBookClick}
            className="px-4 py-1.5 rounded-full bg-[#176B62] hover:bg-[#104C45] text-white text-xs font-semibold shadow-sm active:scale-95 transition-all"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};
