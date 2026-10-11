import React, { useState } from 'react';
import { Search, MessageSquare, Check, CheckCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TopAppBar } from '../common/TopAppBar';

export const MessagesScreen: React.FC = () => {
  const { conversations, navigate } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter((c) =>
    c.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.doctorSpecialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectConversation = (conversationId: string, doctorId: string) => {
    navigate('chat-conversation', { conversationId, doctorId });
  };

  return (
    <div className="flex flex-col min-h-full pb-8 bg-[#EAF5F2]">
      <TopAppBar
        title="Messages"
        subtitle="Consultation chats & follow-ups"
      />

      {/* Search Messages */}
      <div className="px-5 pt-3 pb-1">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B918D]" />
          <input
            type="text"
            placeholder="Search messages or doctors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white text-xs md:text-sm text-[#203936] placeholder-[#7B918D] border border-[#E3ECE9] shadow-xs focus:outline-hidden focus:border-[#176B62] transition-all"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="px-5 mt-3 space-y-2.5">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conv) => (
            <button
              key={conv.conversationId}
              onClick={() => handleSelectConversation(conv.conversationId, conv.doctorId)}
              className="w-full bg-white rounded-3xl p-4 border border-[#E3ECE9] hover:border-[#2F8F83] text-left flex items-start gap-3.5 shadow-xs transition-all duration-200 active:scale-[0.99]"
            >
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-[#EAF5F2] ring-1 ring-[#E3ECE9] shrink-0">
                <img
                  src={conv.doctorImage}
                  alt={conv.doctorName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-sm font-bold text-[#203936] truncate">
                    {conv.doctorName}
                  </h4>
                  <span className="text-[11px] text-[#7B918D] shrink-0">
                    {conv.lastMessageTimestamp}
                  </span>
                </div>

                <span className="text-[11px] font-semibold text-[#176B62] block mb-0.5">
                  {conv.doctorSpecialty}
                </span>

                <p className="text-xs text-[#7B918D] truncate line-clamp-1">
                  {conv.lastMessage}
                </p>
              </div>

              {conv.unreadCount > 0 && (
                <div className="shrink-0 w-5 h-5 rounded-full bg-[#F16F6A] text-white text-[10px] font-bold flex items-center justify-center self-center shadow-xs">
                  {conv.unreadCount}
                </div>
              )}
            </button>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center border border-[#E3ECE9]">
            <div className="w-14 h-14 rounded-2xl bg-[#EAF5F2] text-[#176B62] flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-[#203936]">No Conversations Found</h4>
            <p className="text-xs text-[#7B918D] mt-1">
              Start a new consultation or send an inquiry to your specialist.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
