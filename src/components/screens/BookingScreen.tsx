import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  Building2,
  CheckCircle2,
  User,
  Users,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TopAppBar } from '../common/TopAppBar';
import { Appointment } from '../../data/types';

export const BookingScreen: React.FC = () => {
  const {
    doctors,
    selectedDoctorId,
    user,
    familyMembers,
    bookAppointment,
    navigate,
    goBack,
    currencySymbol,
  } = useApp();

  const doctor = doctors.find((d) => d.doctorId === selectedDoctorId) || doctors[0];

  const [consultationType, setConsultationType] = useState<'Online Video' | 'In-Person Visit'>('Online Video');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-11');
  const [selectedTime, setSelectedTime] = useState<string>('10:30 AM');
  const [patientChoice, setPatientChoice] = useState<string>('self'); // 'self' or family member ID
  const [symptomsNote, setSymptomsNote] = useState<string>('');
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableDates = [
    { date: '2026-10-11', label: 'Tomorrow', day: 'Sun' },
    { date: '2026-10-12', label: 'Oct 12', day: 'Mon' },
    { date: '2026-10-13', label: 'Oct 13', day: 'Tue' },
    { date: '2026-10-14', label: 'Oct 14', day: 'Wed' },
  ];

  const timeSlots = [
    { time: '09:30 AM', period: 'Morning' },
    { time: '10:30 AM', period: 'Morning' },
    { time: '11:45 AM', period: 'Morning' },
    { time: '02:30 PM', period: 'Afternoon' },
    { time: '04:00 PM', period: 'Afternoon' },
    { time: '06:30 PM', period: 'Evening' },
  ];

  const fee = doctor.consultationFee;
  const platformFee = 50;
  const totalAmount = fee + platformFee;

  const handleConfirmBooking = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      let patientLabel = undefined;
      if (patientChoice !== 'self') {
        const fam = familyMembers.find((f) => f.id === patientChoice);
        if (fam) {
          patientLabel = `${fam.fullName} (${fam.relationship})`;
        }
      }

      const newApp = bookAppointment({
        doctorId: doctor.doctorId,
        appointmentDate: selectedDate,
        startTime: selectedTime,
        consultationType,
        forFamilyMember: patientLabel,
        problemDescription: symptomsNote,
      });

      setIsSubmitting(false);
      setConfirmedBooking(newApp);
    }, 600);
  };

  // If booking is confirmed, show confirmation screen
  if (confirmedBooking) {
    return (
      <div className="flex flex-col min-h-full p-5 bg-[#EAF5F2] items-center justify-center text-center">
        <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-[#E3ECE9] shadow-lg animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
          </div>

          <h2 className="text-xl font-extrabold text-[#203936]">
            Appointment Confirmed!
          </h2>
          <p className="text-xs text-[#7B918D] mt-1">
            Your appointment has been registered in MediCare.
          </p>

          <div className="my-4 p-3.5 bg-[#EAF5F2] rounded-2xl text-left space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[#7B918D]">Reference ID</span>
              <span className="font-mono font-bold text-[#176B62]">{confirmedBooking.appointmentId}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#7B918D]">Doctor</span>
              <span className="font-bold text-[#203936]">{confirmedBooking.doctorName}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#7B918D]">Date & Time</span>
              <span className="font-bold text-[#203936]">{confirmedBooking.appointmentDate} · {confirmedBooking.startTime}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#7B918D]">Consultation</span>
              <span className="font-bold text-[#176B62]">{confirmedBooking.consultationType}</span>
            </div>
            {confirmedBooking.forFamilyMember && (
              <div className="flex justify-between text-xs">
                <span className="text-[#7B918D]">Patient</span>
                <span className="font-bold text-[#203936]">{confirmedBooking.forFamilyMember}</span>
              </div>
            )}
            <div className="pt-2 border-t border-[#E3ECE9] flex justify-between text-xs font-bold">
              <span className="text-[#203936]">Total Paid</span>
              <span className="text-[#176B62]">{currencySymbol} {totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {confirmedBooking.consultationType === 'Online Video' && (
              <button
                onClick={() =>
                  navigate('video-consultation', {
                    appointmentId: confirmedBooking.appointmentId,
                    doctorId: confirmedBooking.doctorId,
                  })
                }
                className="w-full py-3 rounded-2xl bg-[#176B62] hover:bg-[#104C45] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <Video className="w-4 h-4" />
                Join Video Waiting Room
              </button>
            )}

            <button
              onClick={() => navigate('appointments')}
              className="w-full py-3 rounded-2xl border border-[#E3ECE9] text-[#203936] hover:bg-slate-50 text-xs font-bold"
            >
              View My Appointments
            </button>

            <button
              onClick={() => navigate('home')}
              className="w-full py-2.5 text-xs text-[#7B918D] hover:text-[#203936] font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full pb-28 bg-[#EAF5F2]">
      <TopAppBar title="Book Appointment" showBack onBack={goBack} />

      {/* Selected Doctor Summary Card */}
      <div className="px-5 pt-3">
        <div className="bg-white rounded-3xl p-4 border border-[#E3ECE9] shadow-xs flex items-center gap-3.5">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[#EAF5F2] ring-1 ring-[#E3ECE9] shrink-0">
            <img
              src={doctor.profileImageUrl}
              alt={doctor.fullName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-[#176B62]">
              {doctor.specialty}
            </span>
            <h3 className="text-sm font-bold text-[#203936] truncate">
              {doctor.fullName}
            </h3>
            <p className="text-xs text-[#7B918D] truncate">
              {doctor.hospital}
            </p>
          </div>
        </div>
      </div>

      {/* Consultation Type Selector */}
      <div className="px-5 mt-4">
        <h3 className="text-xs font-extrabold text-[#203936] uppercase tracking-wider mb-2">
          Consultation Type
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => setConsultationType('Online Video')}
            className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
              consultationType === 'Online Video'
                ? 'bg-white border-[#176B62] ring-2 ring-[#176B62]/20 shadow-xs'
                : 'bg-white/60 border-[#E3ECE9] text-[#7B918D] hover:bg-white'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                consultationType === 'Online Video'
                  ? 'bg-[#176B62] text-white'
                  : 'bg-[#EAF5F2] text-[#176B62]'
              }`}
            >
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#203936]">Online Video</h4>
              <p className="text-[10px] text-[#7B918D] mt-0.5">High definition tele-call</p>
            </div>
          </button>

          <button
            onClick={() => setConsultationType('In-Person Visit')}
            className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
              consultationType === 'In-Person Visit'
                ? 'bg-white border-[#176B62] ring-2 ring-[#176B62]/20 shadow-xs'
                : 'bg-white/60 border-[#E3ECE9] text-[#7B918D] hover:bg-white'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                consultationType === 'In-Person Visit'
                  ? 'bg-[#176B62] text-white'
                  : 'bg-[#EAF5F2] text-[#176B62]'
              }`}
            >
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#203936]">In-Person</h4>
              <p className="text-[10px] text-[#7B918D] mt-0.5">Direct hospital chamber</p>
            </div>
          </button>
        </div>
      </div>

      {/* Select Date */}
      <div className="px-5 mt-4">
        <h3 className="text-xs font-extrabold text-[#203936] uppercase tracking-wider mb-2">
          Select Appointment Date
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {availableDates.map((d) => (
            <button
              key={d.date}
              onClick={() => setSelectedDate(d.date)}
              className={`p-3 rounded-2xl text-center border transition-all ${
                selectedDate === d.date
                  ? 'bg-[#176B62] border-[#176B62] text-white shadow-xs'
                  : 'bg-white border-[#E3ECE9] text-[#203936] hover:border-[#176B62]'
              }`}
            >
              <span className="text-[10px] block opacity-80">{d.day}</span>
              <span className="text-xs font-bold block mt-0.5">{d.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Select Time Slot */}
      <div className="px-5 mt-4">
        <h3 className="text-xs font-extrabold text-[#203936] uppercase tracking-wider mb-2">
          Available Time Slots
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map((slot) => (
            <button
              key={slot.time}
              onClick={() => setSelectedTime(slot.time)}
              className={`py-2.5 px-2 rounded-2xl text-xs font-semibold border text-center transition-all ${
                selectedTime === slot.time
                  ? 'bg-[#176B62] border-[#176B62] text-white shadow-xs'
                  : 'bg-white border-[#E3ECE9] text-[#203936] hover:border-[#176B62]'
              }`}
            >
              {slot.time}
            </button>
          ))}
        </div>
      </div>

      {/* Who is this consultation for? */}
      <div className="px-5 mt-4">
        <h3 className="text-xs font-extrabold text-[#203936] uppercase tracking-wider mb-2">
          Patient Information
        </h3>
        <div className="space-y-2">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E3ECE9] cursor-pointer">
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-[#176B62]" />
              <span className="text-xs font-bold text-[#203936]">Myself ({user.fullName})</span>
            </div>
            <input
              type="radio"
              name="patientChoice"
              checked={patientChoice === 'self'}
              onChange={() => setPatientChoice('self')}
              className="accent-[#176B62]"
            />
          </label>

          {familyMembers.map((fam) => (
            <label
              key={fam.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E3ECE9] cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-[#2F8F83]" />
                <span className="text-xs font-bold text-[#203936]">
                  {fam.fullName} ({fam.relationship}, {fam.age} yrs)
                </span>
              </div>
              <input
                type="radio"
                name="patientChoice"
                checked={patientChoice === fam.id}
                onChange={() => setPatientChoice(fam.id)}
                className="accent-[#176B62]"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Symptoms / Chief Complaint */}
      <div className="px-5 mt-4">
        <h3 className="text-xs font-extrabold text-[#203936] uppercase tracking-wider mb-2">
          Symptoms / Reason for Consultation
        </h3>
        <textarea
          rows={2}
          value={symptomsNote}
          onChange={(e) => setSymptomsNote(e.target.value)}
          placeholder="Briefly describe your symptoms or medications (e.g. fever for 2 days, chest tightness)..."
          className="w-full text-xs p-3 rounded-2xl bg-white border border-[#E3ECE9] text-[#203936] placeholder-[#7B918D] focus:outline-hidden focus:border-[#176B62]"
        />
      </div>

      {/* Fee Breakdown */}
      <div className="px-5 mt-4">
        <div className="bg-white rounded-3xl p-4 border border-[#E3ECE9] space-y-2 text-xs">
          <div className="flex justify-between text-[#7B918D]">
            <span>Doctor Consultation Fee</span>
            <span>{currencySymbol} {fee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[#7B918D]">
            <span>Digital Platform & HD Video Telemetry Fee</span>
            <span>{currencySymbol} {platformFee}</span>
          </div>
          <div className="pt-2 border-t border-[#E3ECE9] flex justify-between font-extrabold text-[#203936] text-sm">
            <span>Total Payable</span>
            <span className="text-[#176B62]">{currencySymbol} {totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Sticky Booking Confirmation Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-[#E3ECE9] z-40">
        <button
          disabled={isSubmitting}
          onClick={handleConfirmBooking}
          className="w-full h-12 rounded-2xl bg-[#176B62] hover:bg-[#104C45] disabled:opacity-60 text-white text-sm font-bold shadow-md shadow-[#176B62]/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          {isSubmitting ? (
            <span>Securing Appointment...</span>
          ) : (
            <>
              <span>Confirm & Pay {currencySymbol} {totalAmount.toLocaleString()}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
