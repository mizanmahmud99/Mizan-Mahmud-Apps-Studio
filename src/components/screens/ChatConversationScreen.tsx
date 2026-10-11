import React, { useState, useRef, useEffect } from 'react';
import { Send, Video, Phone, Check, CheckCheck, Paperclip, MoreVertical, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TopAppBar } from '../common/TopAppBar';

export const ChatConversationScreen: React.FC = () => {
  const {
    conversations,
    selectedConversationId,
    selectedDoctorId,
    doctors,
    sendMessage,
    navigate,
    goBack,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Find conversation
  const conv = conversations.find(
    (c) => c.conversationId === selectedConversationId || c.doctorId === selectedDoctorId
  ) || conversations[0];

  const doctor = doctors.find((d) => d.doctorId === conv.doctorId) || doctors[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conv.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(conv.conversationId, inputText.trim());
    setInputText('');
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(conv.conversationId, prompt);
  };

  return (
    <div className="flex flex-col h-full bg-[#EAF5F2]">
      {/* Custom Chat Top Bar with Doctor Info & Call Actions */}
      <TopAppBar
        title={doctor.fullName}
        subtitle={`${doctor.specialty} · Active now`}
        showBack
        onBack={goBack}
        rightAction={
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                navigate('video-consultation', {
                  doctorId: doctor.doctorId,
                })
              }
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#176B62] hover:bg-[#176B62]/10 transition-colors"
              title="Start Video Call"
            >
              <Video className="w-5 h-5" />
            </button>
            <button
              onClick={() => alert(`Connecting voice consultation with ${doctor.fullName}...`)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#176B62] hover:bg-[#176B62]/10 transition-colors"
              title="Voice Call"
            >
              <Phone className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-2">
        <div className="text-center my-2">
          <span className="text-[10px] font-semibold text-[#7B918D] bg-white px-3 py-1 rounded-full border border-[#E3ECE9]">
            End-to-End Encrypted Telemedicine Chat
          </span>
        </div>

        {conv.messages.map((msg) => {
          const isUser = !msg.isDoctor;
          return (
            <div
              key={msg.messageId}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-3xl px-4 py-2.5 text-xs shadow-2xs leading-relaxed ${
                  isUser
                    ? 'bg-[#176B62] text-white rounded-br-xs'
                    : 'bg-white text-[#203936] border border-[#E3ECE9] rounded-bl-xs'
                }`}
              >
                {msg.messageText}
              </div>
              <div className="flex items-center gap-1 mt-1 px-1">
                <span className="text-[10px] text-[#7B918D]">{msg.timestamp}</span>
                {isUser && <CheckCheck className="w-3 h-3 text-[#176B62]" />}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Health Prompts Chips */}
      <div className="px-4 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => handleQuickPrompt('Here is my morning blood pressure reading: 120/80 mmHg')}
          className="px-3 py-1 rounded-full bg-white border border-[#E3ECE9] text-[11px] font-medium text-[#176B62] hover:bg-[#EAF5F2] whitespace-nowrap shrink-0 flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3 text-amber-500" />
          Report vitals
        </button>
        <button
          onClick={() => handleQuickPrompt('Could you please advise on how to take the prescribed tablets?')}
          className="px-3 py-1 rounded-full bg-white border border-[#E3ECE9] text-[11px] font-medium text-[#176B62] hover:bg-[#EAF5F2] whitespace-nowrap shrink-0"
        >
          Dosage advice
        </button>
        <button
          onClick={() => handleQuickPrompt('When should I schedule our next follow-up consultation?')}
          className="px-3 py-1 rounded-full bg-white border border-[#E3ECE9] text-[11px] font-medium text-[#176B62] hover:bg-[#EAF5F2] whitespace-nowrap shrink-0"
        >
          Next follow-up?
        </button>
      </div>

      {/* Message Input Bar */}
      <div className="p-3 bg-white border-t border-[#E3ECE9]">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => alert('Document attachment (Lab Report / Image) picker opened.')}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#7B918D] hover:bg-slate-100 transition-colors"
            title="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            placeholder="Type a message to doctor..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 h-11 px-4 rounded-2xl bg-slate-50 border border-[#E3ECE9] text-xs text-[#203936] placeholder-[#7B918D] focus:outline-hidden focus:border-[#176B62]"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-11 h-11 rounded-2xl bg-[#176B62] hover:bg-[#104C45] disabled:opacity-50 text-white flex items-center justify-center shadow-xs active:scale-95 transition-all"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
