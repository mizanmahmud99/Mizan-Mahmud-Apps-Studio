import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Heart,
  Users,
  Shield,
  Bell,
  Coins,
  LogOut,
  Edit2,
  Plus,
  Check,
  X,
  FileText,
  Activity,
  Code2,
  Trash2,
  Smartphone,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TopAppBar } from '../common/TopAppBar';
import { FamilyMember } from '../../data/types';
import { ApkDownloadModal } from '../android/ApkDownloadModal';

export const ProfileScreen: React.FC = () => {
  const {
    user,
    updateUser,
    familyMembers,
    addFamilyMember,
    currencySymbol,
    setCurrencySymbol,
    setCodeExportOpen,
  } = useApp();

  const [showApkModal, setShowApkModal] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState(user.fullName);
  const [emailInput, setEmailInput] = useState(user.email);
  const [phoneInput, setPhoneInput] = useState(user.phoneNumber);
  const [bloodGroupInput, setBloodGroupInput] = useState(user.bloodGroup);

  // Add Family Member Modal
  const [showAddFamilyModal, setShowAddFamilyModal] = useState(false);
  const [newFamName, setNewFamName] = useState('');
  const [newFamRelation, setNewFamRelation] = useState<'Spouse' | 'Child' | 'Parent' | 'Sibling' | 'Other'>('Child');
  const [newFamAge, setNewFamAge] = useState<number>(8);
  const [newFamBlood, setNewFamBlood] = useState('O+');

  const handleSaveProfile = () => {
    updateUser({
      fullName: nameInput,
      email: emailInput,
      phoneNumber: phoneInput,
      bloodGroup: bloodGroupInput,
    });
    setIsEditingProfile(false);
  };

  const handleAddFamilyMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFamName.trim()) return;
    addFamilyMember({
      fullName: newFamName.trim(),
      relationship: newFamRelation,
      age: Number(newFamAge),
      gender: 'Male',
      bloodGroup: newFamBlood,
    });
    setNewFamName('');
    setShowAddFamilyModal(false);
  };

  return (
    <div className="flex flex-col min-h-full pb-12 bg-[#EAF5F2]">
      <TopAppBar
        title="My Profile"
        subtitle="Account & family health manager"
        rightAction={
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="w-10 h-10 rounded-2xl bg-white shadow-xs border border-[#E3ECE9] flex items-center justify-center text-[#176B62] hover:bg-[#176B62]/5"
            title="Edit profile"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        }
      />

      {/* User Header Profile Card */}
      <div className="px-5 pt-3">
        <div className="bg-white rounded-3xl p-5 border border-[#E3ECE9] shadow-xs">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-3xl overflow-hidden bg-[#EAF5F2] ring-2 ring-[#176B62]/20 shrink-0">
              <img
                src={user.profileImageUrl}
                alt={user.fullName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-base font-extrabold text-[#203936] truncate">
                {user.fullName}
              </h2>
              <p className="text-xs text-[#7B918D] truncate mt-0.5">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#EAF5F2] text-[#176B62] text-[11px] font-bold">
                  Blood Group: {user.bloodGroup}
                </span>
                <span className="text-xs text-[#7B918D]">·</span>
                <span className="text-[11px] text-[#7B918D] font-medium">Age 34</span>
              </div>
            </div>
          </div>

          {/* Quick Health Vitals Strip */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#E3ECE9]">
            <div className="p-2 text-center rounded-2xl bg-[#EAF5F2]/50">
              <span className="text-[10px] text-[#7B918D] block">Weight</span>
              <span className="text-xs font-bold text-[#203936] mt-0.5 block">72 kg</span>
            </div>
            <div className="p-2 text-center rounded-2xl bg-[#EAF5F2]/50">
              <span className="text-[10px] text-[#7B918D] block">Height</span>
              <span className="text-xs font-bold text-[#203936] mt-0.5 block">176 cm</span>
            </div>
            <div className="p-2 text-center rounded-2xl bg-[#EAF5F2]/50">
              <span className="text-[10px] text-[#7B918D] block">Blood Pressure</span>
              <span className="text-xs font-bold text-[#176B62] mt-0.5 block">120/80</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Edit Form (if toggled) */}
      {isEditingProfile && (
        <div className="px-5 mt-4">
          <div className="bg-white rounded-3xl p-5 border border-[#176B62] shadow-sm space-y-3 animate-in fade-in">
            <h3 className="text-xs font-extrabold text-[#176B62] uppercase tracking-wider">
              Edit Personal Information
            </h3>

            <div>
              <label className="text-[11px] font-bold text-[#203936] block mb-1">Full Name</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#E3ECE9] bg-slate-50"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#203936] block mb-1">Email</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#E3ECE9] bg-slate-50"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#203936] block mb-1">Phone Number</label>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#E3ECE9] bg-slate-50"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#203936] block mb-1">Blood Group</label>
              <select
                value={bloodGroupInput}
                onChange={(e) => setBloodGroupInput(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#E3ECE9] bg-slate-50"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setIsEditingProfile(false)}
                className="flex-1 py-2 rounded-xl border border-[#E3ECE9] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 py-2 rounded-xl bg-[#176B62] text-white text-xs font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Family Member Management Section */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-extrabold text-[#203936]">Family Members</h3>
            <p className="text-xs text-[#7B918D]">Book doctor consultations for family</p>
          </div>
          <button
            onClick={() => setShowAddFamilyModal(true)}
            className="px-3 py-1.5 rounded-full bg-[#176B62] text-white text-xs font-bold flex items-center gap-1 active:scale-95 transition-all shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Member
          </button>
        </div>

        <div className="space-y-2.5">
          {familyMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl p-3.5 border border-[#E3ECE9] flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF5F2] text-[#176B62] flex items-center justify-center font-bold text-xs">
                  {member.relationship[0]}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#203936]">{member.fullName}</h4>
                  <p className="text-[11px] text-[#7B918D]">
                    {member.relationship} · {member.age} yrs · Blood: {member.bloodGroup}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[#176B62] bg-[#EAF5F2] px-2.5 py-1 rounded-full">
                Active
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences & Settings */}
      <div className="px-5 mt-5">
        <h3 className="text-xs font-extrabold text-[#203936] uppercase tracking-wider mb-2">
          Application Settings
        </h3>

        <div className="bg-white rounded-3xl border border-[#E3ECE9] divide-y divide-[#E3ECE9]/70 overflow-hidden text-xs">
          {/* Currency Preference */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#176B62] flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#203936] block">Default Currency</span>
                <span className="text-[11px] text-[#7B918D]">Shown in consultation fees</span>
              </div>
            </div>
            <select
              value={currencySymbol}
              onChange={(e) => setCurrencySymbol(e.target.value)}
              className="p-1.5 rounded-xl border border-[#E3ECE9] bg-slate-50 font-bold text-[#176B62]"
            >
              <option value="৳">৳ (BDT - Taka)</option>
              <option value="$">$ (USD - Dollar)</option>
              <option value="₹">₹ (INR - Rupee)</option>
              <option value="€">€ (EUR - Euro)</option>
            </select>
          </div>

          {/* Download APK & Android Studio Project */}
          <button
            onClick={() => setShowApkModal(true)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#203936] block">Download Android APK / Project</span>
                <span className="text-[11px] text-[#7B918D]">Instant WebAPK install or Studio .zip package</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-white bg-emerald-600 px-2 py-0.5 rounded-md">
              Get APK
            </span>
          </button>

          {/* Android Kotlin Code & Architecture Inspector */}
          <button
            onClick={() => setCodeExportOpen(true)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#176B62] flex items-center justify-center">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#203936] block">Android Architecture & Code</span>
                <span className="text-[11px] text-[#7B918D]">Jetpack Compose, MVVM & Firebase</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-white bg-[#176B62] px-2 py-0.5 rounded-md">
              View
            </span>
          </button>

          {/* Privacy & Health Data Policy */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-800 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#203936] block">Privacy & HIPAA Security</span>
                <span className="text-[11px] text-[#7B918D]">256-bit encrypted medical logs</span>
              </div>
            </div>
            <span className="text-[11px] text-emerald-600 font-bold">Enabled</span>
          </div>
        </div>
      </div>

      {/* Add Family Member Modal */}
      {showAddFamilyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3ECE9]">
              <h3 className="text-base font-bold text-[#203936]">Add Family Member</h3>
              <button
                onClick={() => setShowAddFamilyModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleAddFamilyMemberSubmit} className="py-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#203936] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nusrat Mahmud"
                  value={newFamName}
                  onChange={(e) => setNewFamName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E3ECE9] bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-[#203936] block mb-1">Relationship</label>
                  <select
                    value={newFamRelation}
                    onChange={(e) => setNewFamRelation(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#E3ECE9] bg-slate-50"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#203936] block mb-1">Age</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={newFamAge}
                    onChange={(e) => setNewFamAge(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#E3ECE9] bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#203936] block mb-1">Blood Group</label>
                <select
                  value={newFamBlood}
                  onChange={(e) => setNewFamBlood(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E3ECE9] bg-slate-50"
                >
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="O+">O+</option>
                  <option value="AB+">AB+</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFamilyModal(false)}
                  className="flex-1 py-2.5 rounded-full border border-[#E3ECE9] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#176B62] text-white text-xs font-semibold"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APK & Project Download Modal */}
      <ApkDownloadModal
        isOpen={showApkModal}
        onClose={() => setShowApkModal(false)}
      />
    </div>
  );
};
