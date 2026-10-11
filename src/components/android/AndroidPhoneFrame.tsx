import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Maximize2,
  Minimize2,
  Code2,
  Wifi,
  Battery,
  ChevronLeft,
  Coins,
  Sparkles,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ApkDownloadModal } from './ApkDownloadModal';

interface AndroidPhoneFrameProps {
  children: React.ReactNode;
}

export const AndroidPhoneFrame: React.FC<AndroidPhoneFrameProps> = ({ children }) => {
  const {
    phoneFrameEnabled,
    setPhoneFrameEnabled,
    setCodeExportOpen,
    currencySymbol,
    setCurrencySymbol,
    goBack,
    screenHistory,
    currentScreen,
  } = useApp();

  const [apkModalOpen, setApkModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('10:24');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#DDEAE5] text-[#203936] flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 lg:p-8 antialiased">
      {/* Studio Workbench Header Toolbar */}
      <header className="w-full max-w-4xl mb-4 bg-white/85 backdrop-blur-md rounded-2xl p-3 border border-[#E3ECE9] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#176B62] text-white flex items-center justify-center font-extrabold shadow-xs text-lg">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold text-[#203936] tracking-tight">
                MediCare
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF5F2] text-[#176B62] border border-[#176B62]/20">
                Android Jetpack Compose
              </span>
            </div>
            <p className="text-[11px] text-[#7B918D]">
              Healthcare & Doctor Video Tele-Consultation Application
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Currency Toggle */}
          <button
            onClick={() => setCurrencySymbol(currencySymbol === '৳' ? '$' : '৳')}
            className="h-9 px-3 rounded-xl bg-white border border-[#E3ECE9] hover:bg-[#EAF5F2] text-xs font-bold text-[#176B62] flex items-center gap-1.5 transition-all shadow-2xs"
            title="Toggle Currency"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>{currencySymbol}</span>
          </button>

          {/* Get Android APK / Download Project */}
          <button
            onClick={() => setApkModalOpen(true)}
            className="h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
            title="Download APK / Source Project"
          >
            <Smartphone className="w-4 h-4" />
            <span>Get APK / Project</span>
          </button>

          {/* Android Code & Architecture Export */}
          <button
            onClick={() => setCodeExportOpen(true)}
            className="h-9 px-3.5 rounded-xl bg-[#176B62] hover:bg-[#104C45] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
          >
            <Code2 className="w-4 h-4" />
            <span className="hidden sm:inline">Compose Code</span>
          </button>

          {/* View Mode Toggle: Phone Frame vs Wide */}
          <button
            onClick={() => setPhoneFrameEnabled(!phoneFrameEnabled)}
            className="h-9 px-3 rounded-xl bg-white border border-[#E3ECE9] hover:bg-[#EAF5F2] text-xs font-bold text-[#203936] flex items-center gap-1.5 transition-all shadow-2xs"
            title={phoneFrameEnabled ? 'Switch to Full Screen View' : 'Switch to Phone Mockup View'}
          >
            {phoneFrameEnabled ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-[#176B62]" />
                <span className="hidden sm:inline">Wide View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-[#176B62]" />
                <span className="hidden sm:inline">Phone Frame</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="w-full flex justify-center items-start">
        {phoneFrameEnabled ? (
          /* Realistic Modern Android Phone Bezel */
          <div className="relative w-full max-w-[420px] rounded-[44px] bg-slate-900 p-3 shadow-[0_25px_60px_-15px_rgba(23,107,98,0.35),0_10px_20px_-8px_rgba(0,0,0,0.2)] border-[4px] border-slate-800 transition-all">
            {/* Phone Outer Screen Container */}
            <div className="relative w-full h-[840px] max-h-[88vh] rounded-[38px] overflow-hidden bg-[#EAF5F2] flex flex-col shadow-inner">
              {/* Android Status Bar */}
              <div className="h-9 px-6 bg-[#EAF5F2] flex items-center justify-between text-[#203936] text-[11px] font-bold shrink-0 select-none z-30">
                <span>{currentTime}</span>

                {/* Centered Punch-Hole Camera */}
                <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-700 shadow-inner -ml-2" />

                <div className="flex items-center gap-1.5 text-[#203936]">
                  <span className="text-[10px] tracking-tighter">5G</span>
                  <Wifi className="w-3.5 h-3.5" />
                  <Battery className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Scrollable Screen Body */}
              <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
                {children}
              </div>

              {/* Android Navigation Gesture Bar */}
              <div className="h-5 bg-white/95 backdrop-blur-md flex items-center justify-center shrink-0 z-30">
                <div
                  onClick={goBack}
                  className="w-32 h-1 bg-slate-400/80 hover:bg-slate-700 rounded-full cursor-pointer transition-colors active:scale-95"
                  title="Android Navigation Bar (Tap to go back)"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Wide Viewport Container */
          <div className="w-full max-w-4xl rounded-3xl overflow-hidden bg-[#EAF5F2] shadow-xl border border-[#E3ECE9] min-h-[800px] flex flex-col">
            {children}
          </div>
        )}
      </div>

      {/* Footer Notes */}
      <footer className="w-full max-w-md text-center mt-5 text-[11px] text-[#7B918D]">
        MediCare Android Healthcare App · Jetpack Compose Material 3 Design
      </footer>

      {/* APK & Project Source Download Modal */}
      <ApkDownloadModal
        isOpen={apkModalOpen}
        onClose={() => setApkModalOpen(false)}
      />
    </div>
  );
};
