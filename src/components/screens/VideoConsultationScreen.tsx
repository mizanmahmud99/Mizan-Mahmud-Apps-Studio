import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  Volume2,
  VolumeX,
  MessageSquare,
  SwitchCamera,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Activity,
  Send,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const VideoConsultationScreen: React.FC = () => {
  const { doctors, selectedDoctorId, appointments, selectedAppointmentId, navigate } = useApp();

  const doctor = doctors.find((d) => d.doctorId === selectedDoctorId) || doctors[0];
  const appointment = appointments.find((a) => a.appointmentId === selectedAppointmentId);

  // Call states
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(132); // starts at 02:12 for realistic feeling
  const [isCallActive, setIsCallActive] = useState(true);
  const [showInCallChat, setShowInCallChat] = useState(false);
  const [inCallMessages, setInCallMessages] = useState<string[]>([
    'Dr. Anjali joined the consultation room.',
    'Hello Mizan! Can you hear and see me clearly?',
  ]);
  const [chatInput, setChatInput] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'ended'>('connected');

  // Local camera stream reference
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: any;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  // Try accessing actual webcam for patient PiP self-view, fallback gracefully if not allowed
  useEffect(() => {
    let stream: MediaStream | null = null;
    const enableCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            setHasCameraPermission(true);
          }
        }
      } catch (err) {
        // User denied or sandbox environment; fallback to animated patient avatar
        setHasCameraPermission(false);
      }
    };

    if (isCallActive && !isVideoOff) {
      enableCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCallActive, isVideoOff]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setConnectionStatus('ended');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setInCallMessages((prev) => [...prev, `You: ${chatInput.trim()}`]);
    setChatInput('');
  };

  if (connectionStatus === 'ended') {
    return (
      <div className="flex flex-col min-h-full p-5 bg-[#EAF5F2] items-center justify-center text-center">
        <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-[#E3ECE9] shadow-lg animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
          </div>

          <h2 className="text-xl font-extrabold text-[#203936]">
            Consultation Completed
          </h2>
          <p className="text-xs text-[#7B918D] mt-1">
            Duration: {formatDuration(callDuration)} with {doctor.fullName}
          </p>

          <div className="my-4 p-4 bg-[#EAF5F2] rounded-2xl text-left space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#176B62]">
              <FileText className="w-4 h-4" />
              <span>Digital Prescription Summary</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Dr. {doctor.fullName} has generated your electronic prescription and lifestyle guidance notes.
            </p>
            <div className="pt-2 border-t border-[#E3ECE9] text-[11px] text-[#7B918D]">
              Prescription Ref: RX-{Math.floor(100000 + Math.random() * 900000)}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => navigate('appointments')}
              className="w-full py-3 rounded-2xl bg-[#176B62] text-white text-xs font-bold shadow-sm"
            >
              View Consultation Summary
            </button>
            <button
              onClick={() => navigate('home')}
              className="w-full py-2.5 text-xs text-[#7B918D] hover:text-[#203936] font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[640px] bg-slate-950 flex flex-col justify-between overflow-hidden text-white select-none">
      {/* Background: Doctor's Video View */}
      <div className="absolute inset-0 z-0">
        <img
          src={doctor.profileImageUrl}
          alt={doctor.fullName}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover brightness-[0.9] scale-105 filter blur-[0.5px]"
        />
        {/* Subtle cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60 pointer-events-none" />
      </div>

      {/* Top Floating App Bar */}
      <div className="relative z-10 p-4 pt-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider">
              {formatDuration(callDuration)}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-xs">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-medium">HD 1080p</span>
          </div>
        </div>

        {/* Doctor Info Chip */}
        <div className="text-right">
          <h2 className="text-sm font-bold text-white drop-shadow-md">
            {doctor.fullName}
          </h2>
          <p className="text-[11px] text-white/80 font-medium">
            {doctor.specialty}
          </p>
        </div>
      </div>

      {/* Floating Picture-in-Picture (Patient Self-View) */}
      <div className="absolute top-20 right-4 z-20 w-28 h-38 sm:w-32 sm:h-44 rounded-2xl overflow-hidden bg-slate-900 border-2 border-white/30 shadow-2xl">
        {isVideoOff ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400 p-2 text-center">
            <User className="w-8 h-8 mb-1" />
            <span className="text-[10px] font-semibold">Camera Off</span>
          </div>
        ) : hasCameraPermission ? (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />
        ) : (
          <div className="relative w-full h-full">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
              alt="You"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/60 text-[9px] font-bold">
              You (HD)
            </div>
          </div>
        )}
      </div>

      {/* Floating In-Call Chat Overlay (if toggled) */}
      {showInCallChat && (
        <div className="absolute bottom-28 left-4 right-4 z-30 max-w-sm mx-auto bg-black/80 backdrop-blur-md rounded-3xl p-4 border border-white/10 shadow-2xl animate-in slide-in-from-bottom-6">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-bold text-white">Consultation Chat</span>
            <button
              onClick={() => setShowInCallChat(false)}
              className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/10"
            >
              <X className="w-4 h-4 text-white/70" />
            </button>
          </div>

          <div className="max-h-36 overflow-y-auto space-y-2 py-2 text-xs">
            {inCallMessages.map((msg, idx) => (
              <div key={idx} className="bg-white/10 rounded-xl p-2 text-white/90">
                {msg}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="Send message to doctor..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-white/20 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/50 focus:outline-hidden"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-[#176B62] text-white hover:bg-[#104C45]"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Bottom Video Call Controls Toolbar */}
      <div className="relative z-10 p-5 pb-8 flex flex-col items-center">
        {/* Main Controls Row */}
        <div className="flex items-center gap-3.5 bg-black/50 backdrop-blur-md p-3 rounded-full border border-white/15 shadow-2xl">
          {/* Microphone Mute */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isMuted ? 'bg-rose-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Video Toggle */}
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isVideoOff ? 'bg-rose-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            aria-label={isVideoOff ? 'Turn on video' : 'Turn off video'}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
          </button>

          {/* Speaker Toggle */}
          <button
            onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isSpeakerMuted ? 'bg-rose-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            aria-label={isSpeakerMuted ? 'Unmute speaker' : 'Mute speaker'}
          >
            {isSpeakerMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* In-Call Chat */}
          <button
            onClick={() => setShowInCallChat(!showInCallChat)}
            className="w-12 h-12 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-all"
            aria-label="Toggle chat"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* End Call Button */}
          <button
            onClick={handleEndCall}
            className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
            aria-label="End consultation"
          >
            <PhoneOff className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
