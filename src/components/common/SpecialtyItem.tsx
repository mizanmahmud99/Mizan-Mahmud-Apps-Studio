import React from 'react';
import {
  HeartPulse,
  Brain,
  Baby,
  Bone,
  Sparkles,
  Activity,
  Eye,
  Smile,
  Stethoscope,
  ShieldCheck,
  Flame,
  Ear,
  LucideIcon,
} from 'lucide-react';
import { Specialty } from '../../data/types';
import { useApp } from '../../context/AppContext';

const iconMap: Record<string, LucideIcon> = {
  HeartPulse,
  Brain,
  Baby,
  Bone,
  Sparkles,
  Activity,
  Eye,
  Smile,
  Stethoscope,
  ShieldCheck,
  Flame,
  Ear,
};

interface SpecialtyItemProps {
  specialty: Specialty;
  compact?: boolean;
}

export const SpecialtyItem: React.FC<SpecialtyItemProps> = ({ specialty, compact = false }) => {
  const { navigate } = useApp();
  const IconComponent = iconMap[specialty.iconName] || Stethoscope;

  const handleClick = () => {
    navigate('doctors', { specialtyId: specialty.id });
  };

  if (compact) {
    return (
      <button
        onClick={handleClick}
        className="flex flex-col items-center gap-2 group w-20 shrink-0 text-center focus:outline-hidden"
      >
        <div className="w-16 h-16 rounded-2xl bg-white shadow-xs border border-[#E3ECE9] flex items-center justify-center text-[#176B62] group-hover:bg-[#176B62] group-hover:text-white group-active:scale-95 transition-all duration-200">
          <IconComponent className="w-7 h-7 stroke-[1.8]" />
        </div>
        <span className="text-xs font-semibold text-[#203936] group-hover:text-[#176B62] truncate w-full">
          {specialty.name}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="bg-white rounded-3xl p-4 border border-[#E3ECE9] hover:border-[#2F8F83] text-left flex items-center gap-3.5 shadow-xs hover:shadow-sm transition-all duration-200 active:scale-[0.98] group"
    >
      <div className="w-14 h-14 rounded-2xl bg-[#EAF5F2] flex items-center justify-center text-[#176B62] group-hover:bg-[#176B62] group-hover:text-white transition-colors duration-200 shrink-0">
        <IconComponent className="w-7 h-7 stroke-[1.8]" />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-bold text-[#203936] truncate group-hover:text-[#176B62]">
          {specialty.name}
        </h4>
        <p className="text-xs text-[#7B918D] truncate mt-0.5">
          {specialty.description}
        </p>
        <span className="text-[11px] font-semibold text-[#2F8F83] mt-1 inline-block">
          {specialty.doctorCount} Doctors
        </span>
      </div>
    </button>
  );
};
