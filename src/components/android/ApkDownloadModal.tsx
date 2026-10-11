import React, { useState } from 'react';
import {
  X,
  Download,
  Smartphone,
  CheckCircle2,
  Terminal,
  ExternalLink,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { generateAndroidProjectZip } from '../../utils/exportAndroidProject';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({ isOpen, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    try {
      setIsGenerating(true);
      const blob = await generateAndroidProjectZip();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'MediCare-Android-Studio-Project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadSuccess(true);
    } catch (err) {
      console.error('Failed to generate zip:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-[#E3ECE9] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#176B62] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold leading-tight">
                MediCare Android APK & Source Package
              </h2>
              <p className="text-xs text-white/80">
                Install directly on Android or build APK in Android Studio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#203936]">
          {/* Method 1: Direct Download Pre-Compiled APK */}
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-600 text-white font-mono text-[10px] font-bold uppercase mb-1">
                  Ready to Install
                </span>
                <h3 className="font-extrabold text-sm text-[#203936] flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-700" />
                  Direct Download: medicare.apk (2.7 MB)
                </h3>
                <p className="text-[11px] text-[#7B918D] mt-0.5">
                  Signed standalone Android package. Ready to install on Android 5.0 through Android 15.
                </p>
              </div>
            </div>

            <a
              href="/medicare.apk"
              download="medicare.apk"
              className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all no-underline cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download medicare.apk File Now</span>
            </a>

            <div className="flex items-center gap-2 text-[10px] text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Signed with v1 (JAR) & v2 (Full APK Scheme) · Package: com.medicare.app</span>
            </div>
          </div>

          {/* Method 2: Instant Direct Install on Android Phone (WebAPK) */}
          <div className="bg-[#EAF5F2] rounded-2xl p-4 border border-[#176B62]/20">
            <div className="flex items-center gap-2 font-bold text-sm text-[#176B62] mb-1">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Method 2: 1-Tap Browser WebAPK Installation</span>
            </div>
            <p className="text-[#7B918D] leading-relaxed mb-3">
              On your Android smartphone (Google Chrome, Samsung Internet, or Brave), open the MediCare App URL:
            </p>
            <div className="p-2.5 rounded-xl bg-white border border-[#E3ECE9] font-mono text-[11px] text-[#176B62] break-all select-all flex items-center justify-between gap-2">
              <span>https://ais-pre-q7x2q5xyirpyqjbjkbs23a-428862008447.asia-southeast1.run.app</span>
            </div>
            <div className="mt-3 flex items-start gap-2 text-[11px] text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Tap <strong>⋮ (Menu)</strong> &gt; <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong>. Android automatically compiles a native <strong>WebAPK</strong> with app icon, splash screen, and full-screen Android container!
              </span>
            </div>
          </div>

          {/* Method 3: Download Complete Android Studio Project (.zip) to Build APK */}
          <div className="bg-white rounded-2xl p-4 border border-[#E3ECE9] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#203936]">
                  Method 3: Download Full Android Studio Source Project (.zip)
                </h3>
                <p className="text-[11px] text-[#7B918D] mt-0.5">
                  Includes Jetpack Compose, Kotlin, Gradle, Manifest, and Video Call code.
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadZip}
              disabled={isGenerating}
              className="w-full py-3 px-4 rounded-2xl bg-[#176B62] hover:bg-[#104C45] disabled:opacity-60 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>
                {isGenerating
                  ? 'Packaging Android Studio Project...'
                  : downloadSuccess
                  ? 'Downloaded! Click to Download Again (.zip)'
                  : 'Download Android Studio Project (.zip)'}
              </span>
            </button>

            {downloadSuccess && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>MediCare-Android-Studio-Project.zip</strong> downloaded! Unzip it to build your APK.
                </span>
              </div>
            )}
          </div>

          {/* Method 3: 1-Command APK Build instructions */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <Terminal className="w-4 h-4" />
              <span>How to Build the APK in 30 Seconds:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-300 leading-relaxed font-sans">
              <li>Unzip the downloaded project folder on your computer.</li>
              <li>
                Open a terminal in the folder and run:
                <pre className="mt-1 p-2 bg-slate-950 rounded-lg text-emerald-400 font-mono text-[11px] select-all">
                  ./gradlew assembleDebug
                </pre>
              </li>
              <li>
                Your APK file is instantly generated at:
                <pre className="mt-1 p-2 bg-slate-950 rounded-lg text-slate-300 font-mono text-[11px]">
                  app/build/outputs/apk/debug/app-debug.apk
                </pre>
              </li>
              <li>Transfer or send <code className="text-emerald-400">app-debug.apk</code> to your Android phone and tap install!</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-[#E3ECE9] flex items-center justify-between">
          <span className="text-[11px] text-[#7B918D]">Target: Android 14/15 (API 34/35) · Compose Material 3</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
