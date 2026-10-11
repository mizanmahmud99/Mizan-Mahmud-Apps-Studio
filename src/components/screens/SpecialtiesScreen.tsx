import React, { useState } from 'react';
import { Search, ChevronLeft } from 'lucide-react';
import { SPECIALTIES } from '../../data/sampleData';
import { SpecialtyItem } from '../common/SpecialtyItem';
import { TopAppBar } from '../common/TopAppBar';
import { useApp } from '../../context/AppContext';

export const SpecialtiesScreen: React.FC = () => {
  const { goBack } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSpecialties = SPECIALTIES.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-full pb-8 bg-[#EAF5F2]">
      <TopAppBar
        title="Medical Specialties"
        subtitle={`${SPECIALTIES.length} departments available`}
        showBack
        onBack={goBack}
      />

      {/* Search Bar */}
      <div className="px-5 pt-3 pb-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B918D]" />
          <input
            type="text"
            placeholder="Search medical departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white text-xs md:text-sm text-[#203936] placeholder-[#7B918D] border border-[#E3ECE9] shadow-xs focus:outline-hidden focus:border-[#176B62] transition-all"
          />
        </div>
      </div>

      {/* Specialties Grid */}
      <div className="px-5 mt-3 space-y-3">
        {filteredSpecialties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredSpecialties.map((specialty) => (
              <SpecialtyItem key={specialty.id} specialty={specialty} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl p-6 border border-[#E3ECE9]">
            <p className="text-sm font-bold text-[#203936]">No specialties found</p>
            <p className="text-xs text-[#7B918D] mt-1">Try another keyword like Cardiology or Skin</p>
          </div>
        )}
      </div>
    </div>
  );
};
