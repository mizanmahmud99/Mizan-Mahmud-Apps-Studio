import React, { useState } from 'react';
import { Calendar, Clock, Video, Building2, ChevronRight, AlertCircle, FileText, CheckCircle2, X } from 'lucide-react';
import { Appointment } from '../../data/types';
import { useApp } from '../../context/AppContext';

interface AppointmentCardProps {
  appointment: Appointment;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const { navigate, cancelAppointment, rescheduleAppointment, currencySymbol } = useApp();
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(appointment.appointmentDate);
  const [selectedTime, setSelectedTime] = useState(appointment.startTime);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const isVideo = appointment.consultationType === 'Online Video';
  const isUpcoming = appointment.status === 'Upcoming';

  const handleJoinVideo = () => {
    navigate('video-consultation', {
      doctorId: appointment.doctorId,
      appointmentId: appointment.appointmentId,
    });
  };

  const handleConfirmReschedule = () => {
    rescheduleAppointment(appointment.appointmentId, selectedDate, selectedTime);
    setShowRescheduleModal(false);
  };

  const handleConfirmCancel = () => {
    cancelAppointment(appointment.appointmentId);
    setShowCancelConfirm(false);
  };

  const statusColors = {
    Upcoming: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Completed: 'bg-blue-50 text-blue-700 border-blue-200',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <div className="bg-white rounded-3xl p-4 shadow-xs border border-[#E3ECE9] flex flex-col gap-3">
      {/* Top row: Status, Type and Reference ID */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#E3ECE9]/70">
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
              statusColors[appointment.status]
            }`}
          >
            {appointment.status}
          </span>
          <span className="text-[11px] font-medium text-[#7B918D] flex items-center gap-1">
            {isVideo ? <Video className="w-3.5 h-3.5 text-[#176B62]" /> : <Building2 className="w-3.5 h-3.5 text-[#2F8F83]" />}
            {appointment.consultationType}
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#7B918D]">
          {appointment.appointmentId}
        </span>
      </div>

      {/* Doctor Info */}
      <div className="flex items-start gap-3">
        <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-[#EAF5F2] ring-1 ring-[#E3ECE9] shrink-0">
          <img
            src={appointment.doctorImage}
            alt={appointment.doctorName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-[#203936] truncate">
            {appointment.doctorName}
          </h4>
          <p className="text-xs text-[#176B62] font-semibold truncate">
            {appointment.doctorSpecialty}
          </p>
          <p className="text-[11px] text-[#7B918D] truncate">
            {appointment.doctorHospital}
          </p>
          {appointment.forFamilyMember && (
            <span className="inline-block mt-1 text-[10px] bg-[#EAF5F2] text-[#176B62] font-medium px-2 py-0.5 rounded-md">
              Patient: {appointment.forFamilyMember}
            </span>
          )}
        </div>
      </div>

      {/* Date & Time pill banner */}
      <div className="bg-[#EAF5F2] rounded-2xl p-2.5 flex items-center justify-between text-xs text-[#203936]">
        <div className="flex items-center gap-1.5 font-semibold">
          <Calendar className="w-3.5 h-3.5 text-[#176B62]" />
          <span>{appointment.appointmentDate}</span>
        </div>
        <div className="flex items-center gap-1.5 font-semibold">
          <Clock className="w-3.5 h-3.5 text-[#176B62]" />
          <span>{appointment.startTime}</span>
        </div>
      </div>

      {/* Problem notes or Prescription summary */}
      {appointment.problemDescription && (
        <p className="text-xs text-[#7B918D] line-clamp-2 italic bg-slate-50 p-2 rounded-xl border border-slate-100">
          "{appointment.problemDescription}"
        </p>
      )}

      {appointment.prescriptionSummary && (
        <div className="text-xs bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100 text-[#203936]">
          <div className="flex items-center gap-1 font-bold text-emerald-800 mb-0.5">
            <FileText className="w-3.5 h-3.5" />
            <span>Prescription Advice:</span>
          </div>
          <p className="text-[11px] text-slate-700">{appointment.prescriptionSummary}</p>
        </div>
      )}

      {/* Action Buttons */}
      {isUpcoming && (
        <div className="flex items-center gap-2 pt-1">
          {isVideo ? (
            <button
              onClick={handleJoinVideo}
              className="flex-1 py-2.5 px-4 rounded-full bg-[#176B62] hover:bg-[#104C45] text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <Video className="w-4 h-4" />
              Join Consultation
            </button>
          ) : (
            <button
              onClick={() => alert(`Directions to ${appointment.doctorHospital} sent to your SMS!`)}
              className="flex-1 py-2.5 px-4 rounded-full bg-[#2F8F83] text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <Building2 className="w-4 h-4" />
              View Clinic Directions
            </button>
          )}

          <button
            onClick={() => setShowRescheduleModal(true)}
            className="px-3 py-2 rounded-full border border-[#E3ECE9] text-xs font-medium text-[#203936] hover:bg-slate-50 transition-all"
          >
            Reschedule
          </button>
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="px-3 py-2 rounded-full border border-rose-200 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-all"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3ECE9]">
              <h3 className="text-base font-bold text-[#203936]">Reschedule Appointment</h3>
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#203936] block mb-1">Select New Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E3ECE9] bg-slate-50 focus:outline-hidden focus:border-[#176B62]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#203936] block mb-1">Select Time Slot</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E3ECE9] bg-slate-50 focus:outline-hidden focus:border-[#176B62]"
                >
                  <option value="09:30 AM">09:30 AM (Morning)</option>
                  <option value="10:30 AM">10:30 AM (Morning)</option>
                  <option value="11:45 AM">11:45 AM (Morning)</option>
                  <option value="02:30 PM">02:30 PM (Afternoon)</option>
                  <option value="04:00 PM">04:00 PM (Afternoon)</option>
                  <option value="06:30 PM">06:30 PM (Evening)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="flex-1 py-2.5 rounded-full border border-[#E3ECE9] text-xs font-semibold text-slate-700"
              >
                Keep Current
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="flex-1 py-2.5 rounded-full bg-[#176B62] text-white text-xs font-semibold"
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-center text-base font-bold text-[#203936]">Cancel Appointment?</h3>
            <p className="text-center text-xs text-[#7B918D] mt-1 mb-4">
              Are you sure you want to cancel your consultation with {appointment.doctorName}? A full refund will be credited to your account.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-2.5 rounded-full border border-[#E3ECE9] text-xs font-semibold text-slate-700"
              >
                No, Keep It
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 rounded-full bg-rose-600 text-white text-xs font-semibold"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
