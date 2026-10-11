import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X, Check, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DoctorCard } from '../common/DoctorCard';
import { TopAppBar } from '../common/TopAppBar';
import { SPECIALTIES } from '../../data/sampleData';

export const FindDoctorScreen: React.FC = () => {
  const { doctors, selectedSpecialtyId, navigate } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(selectedSpecialtyId || 'all');
  const [availableTodayOnly, setAvailableTodayOnly] = useState(false);
  const [highRatingOnly, setHighRatingOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'fee-low' | 'experience'>('rating');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [maxFee, setMaxFee] = useState<number>(2000);

  // Sync if selectedSpecialtyId was passed via navigation
  React.useEffect(() => {
    if (selectedSpecialtyId) {
      setSelectedSpecialty(selectedSpecialtyId);
    }
  }, [selectedSpecialtyId]);

  const filteredDoctors = useMemo(() => {
    let result = doctors.filter((doc) => {
      // Search match
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        doc.fullName.toLowerCase().includes(query) ||
        doc.specialty.toLowerCase().includes(query) ||
        doc.hospital.toLowerCase().includes(query) ||
        doc.qualifications.toLowerCase().includes(query);

      // Specialty filter
      const matchesSpecialty =
        selectedSpecialty === 'all' || doc.specialtyId === selectedSpecialty;

      // Available today
      const matchesToday = !availableTodayOnly || doc.isAvailableToday;

      // Rating filter
      const matchesRating = !highRatingOnly || doc.rating >= 4.85;

      // Fee filter
      const matchesFee = doc.consultationFee <= maxFee;

      return matchesSearch && matchesSpecialty && matchesToday && matchesRating && matchesFee;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'fee-low') return a.consultationFee - b.consultationFee;
      if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
      return 0;
    });

    return result;
  }, [doctors, searchQuery, selectedSpecialty, availableTodayOnly, highRatingOnly, sortBy, maxFee]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty('all');
    setAvailableTodayOnly(false);
    setHighRatingOnly(false);
    setMaxFee(2000);
    setSortBy('rating');
  };

  return (
    <div className="flex flex-col min-h-full pb-8 bg-[#EAF5F2]">
      <TopAppBar
        title="Find Your Doctor"
        subtitle={`${filteredDoctors.length} specialists available`}
        rightAction={
          <button
            onClick={() => setShowFilterModal(true)}
            className="w-10 h-10 rounded-2xl bg-white shadow-xs border border-[#E3ECE9] flex items-center justify-center text-[#176B62] hover:bg-[#176B62]/5"
            aria-label="Filter doctors"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        }
      />

      {/* Search Bar */}
      <div className="px-5 pt-3 pb-1">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B918D]" />
          <input
            type="text"
            placeholder="Search by doctor name, specialty, condition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-10 rounded-2xl bg-white text-xs md:text-sm text-[#203936] placeholder-[#7B918D] border border-[#E3ECE9] shadow-xs focus:outline-hidden focus:border-[#176B62] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[#7B918D] hover:bg-slate-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Specialties Horizontal Pill Selectors */}
      <div className="px-5 mt-2 overflow-x-auto no-scrollbar flex items-center gap-2 py-1">
        <button
          onClick={() => setSelectedSpecialty('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            selectedSpecialty === 'all'
              ? 'bg-[#176B62] text-white shadow-xs'
              : 'bg-white text-[#7B918D] border border-[#E3ECE9] hover:text-[#203936]'
          }`}
        >
          All Specialties
        </button>
        {SPECIALTIES.map((spec) => (
          <button
            key={spec.id}
            onClick={() => setSelectedSpecialty(spec.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedSpecialty === spec.id
                ? 'bg-[#176B62] text-white shadow-xs'
                : 'bg-white text-[#7B918D] border border-[#E3ECE9] hover:text-[#203936]'
            }`}
          >
            {spec.name}
          </button>
        ))}
      </div>

      {/* Quick Filter & Sort Row */}
      <div className="px-5 mt-2 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setAvailableTodayOnly(!availableTodayOnly)}
            className={`px-3 py-1 rounded-full border text-[11px] font-medium transition-all ${
              availableTodayOnly
                ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                : 'bg-white border-[#E3ECE9] text-[#7B918D]'
            }`}
          >
            Available Today
          </button>
          <button
            onClick={() => setHighRatingOnly(!highRatingOnly)}
            className={`px-3 py-1 rounded-full border text-[11px] font-medium transition-all ${
              highRatingOnly
                ? 'bg-amber-100 border-amber-400 text-amber-800'
                : 'bg-white border-[#E3ECE9] text-[#7B918D]'
            }`}
          >
            4.85+ ★
          </button>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[11px] text-[#7B918D]">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-[11px] font-semibold text-[#176B62] bg-transparent border-0 focus:outline-hidden cursor-pointer"
          >
            <option value="rating">Rating</option>
            <option value="fee-low">Fee (Low)</option>
            <option value="experience">Experience</option>
          </select>
        </div>
      </div>

      {/* Doctor Cards List */}
      <div className="px-5 mt-3 space-y-3">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doc) => <DoctorCard key={doc.doctorId} doctor={doc} />)
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center border border-[#E3ECE9] mt-2">
            <div className="w-14 h-14 rounded-2xl bg-[#EAF5F2] text-[#176B62] flex items-center justify-center mx-auto mb-3">
              <Filter className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-[#203936]">No Doctors Match Your Filters</h4>
            <p className="text-xs text-[#7B918D] mt-1 max-w-xs mx-auto">
              Try adjusting your specialty or clearing search terms to see available practitioners.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-5 py-2 rounded-full bg-[#176B62] text-white text-xs font-semibold shadow-xs"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Filter Bottom Sheet / Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center p-0 md:p-4">
          <div className="bg-white rounded-t-3xl md:rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="w-10 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between pb-3 border-b border-[#E3ECE9]">
              <h3 className="text-base font-bold text-[#203936]">Doctor Search Filters</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-[#203936] block mb-2">
                  Max Consultation Fee: ৳ {maxFee}
                </label>
                <input
                  type="range"
                  min="800"
                  max="2500"
                  step="100"
                  value={maxFee}
                  onChange={(e) => setMaxFee(Number(e.target.value))}
                  className="w-full accent-[#176B62]"
                />
                <div className="flex justify-between text-[11px] text-[#7B918D] mt-1">
                  <span>৳ 800</span>
                  <span>৳ 2,500</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#203936] block mb-2">Availability</label>
                <label className="flex items-center gap-2 text-xs text-[#203936] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={availableTodayOnly}
                    onChange={(e) => setAvailableTodayOnly(e.target.checked)}
                    className="w-4 h-4 rounded-md accent-[#176B62]"
                  />
                  <span>Show only doctors available today</span>
                </label>
              </div>

              <div>
                <label className="text-xs font-bold text-[#203936] block mb-2">Rating</label>
                <label className="flex items-center gap-2 text-xs text-[#203936] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={highRatingOnly}
                    onChange={(e) => setHighRatingOnly(e.target.checked)}
                    className="w-4 h-4 rounded-md accent-[#176B62]"
                  />
                  <span>Only highly rated specialists (4.85+ ★)</span>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-[#E3ECE9]">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 rounded-full border border-[#E3ECE9] text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 py-2.5 rounded-full bg-[#176B62] text-white text-xs font-bold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
