/**
 * Modern Profile Page
 * AI Platform User Dashboard
 */

import { useAuth } from "../routes/AuthContext";
import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  FileText,
  Link as LinkIcon,
  Plus,
  Sparkles,
  Bot,
  FileWarning,
  CreditCard,
} from "lucide-react";

const banners = [
  "https://images.unsplash.com/photo-1677442136019-21780ecad995",
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
  "https://images.unsplash.com/photo-1639322537228-f710d846310a",
];

/* High Priority Notifications */
const highPriorityNotifications = [
  {
    id: 1,
    title: "Chatbot Health Degraded",
    time: "5 mins ago",
    icon: Bot,
  },
  {
    id: 2,
    title: "Knowledge Base Processing Failed",
    time: "15 mins ago",
    icon: FileWarning,
  },
  {
    id: 3,
    title: "Monthly Usage Threshold Reached",
    time: "Today",
    icon: CreditCard,
  },
];

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % highPriorityNotifications.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AI";

  const ActiveIcon = highPriorityNotifications[activeIndex].icon;

  return (
    <div className="p-6 space-y-6">
      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden h-52">
        <img
          src={banners[0]}
          alt="AI banner"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/40 px-6 flex items-center">
          <div className="w-full flex justify-between items-center">
            {/* Left */}
            <h1 className="text-2xl font-semibold text-white">
              Welcome back{" "}
              <span className="animate-textShine font-semibold">
                {user?.name || "User"}
              </span>
            </h1>

            {/* Right notification ticker */}
            <div className="hidden md:flex items-center gap-3 text-white">
              <div className="w-9 h-9 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
                <ActiveIcon size={18} />
              </div>

              <div key={activeIndex} className="animate-fadeDown">
                <p className="text-sm font-medium">
                  {highPriorityNotifications[activeIndex].title}
                </p>
                <p className="text-xs text-gray-300">
                  {highPriorityNotifications[activeIndex].time}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="xl:col-span-2 space-y-6">
          {/* Profile Header */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 p-6">
            <div className="flex items-start gap-4">
              <div className="relative w-16 h-16 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xl font-semibold shadow-md">
                {initials}
                <span className="absolute inset-0 rounded-xl animate-avatarGlow pointer-events-none" />
              </div>

              <div className="flex-1">
                <h2 className="text-lg font-semibold animate-textShine">
                  {user?.name}
                </h2>
                <p className="text-sm text-indigo-500 font-medium">
                  AI Platform User
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Leveraging AI for productivity, analytics and automation
                </p>
              </div>

              <div className="flex gap-2">
                <IconLink label="D" />
                <IconLink label="B" />
                <IconLink label="L" />
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 p-6">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
              <Sparkles className="text-indigo-500" size={16} />
              About AI Usage
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              You actively use AI powered tools to improve decision making,
              automate workflows, and gain meaningful insights from data.
            </p>
          </div>

          {/* Activity */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-700 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                AI Activity Overview
              </h3>

              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-indigo-600/10 text-indigo-600 hover:bg-indigo-600/20 transition">
                <Plus size={14} />
                New Task
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 p-6 space-y-4">
            <DetailRow icon={Phone} label="Phone" value={user?.phoneNumber || "N/A"} />
            <DetailRow icon={Mail} label="Email" value={user?.email || "N/A"} />
            <DetailRow icon={MapPin} label="Location" value="India" />
            <DetailRow icon={FileText} label="Organization" value={user?.organizationName || "N/A"} />
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes textShine {
            0% { background-position: -200%; }
            100% { background-position: 200%; }
          }

          .animate-textShine {
            background: linear-gradient(90deg, #2563eb, #93c5fd, #2563eb);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: textShine 3s linear infinite;
          }

          @keyframes fadeDown {
            0% { opacity: 0; transform: translateY(-6px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          .animate-fadeDown {
            animation: fadeDown 0.6s ease-out;
          }

          .animate-avatarGlow {
            box-shadow: 0 0 18px rgba(99,102,241,0.45);
            animation: avatarPulse 3s ease-in-out infinite;
          }

          @keyframes avatarPulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
        `}
      </style>
    </div>
  );
};

/* Components */

const IconLink = ({ label }) => (
  <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-zinc-700 flex items-center justify-center text-gray-600 dark:text-gray-300 cursor-pointer hover:scale-105 transition">
    {label}
  </div>
);

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex gap-3">
    <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-zinc-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
      <Icon size={16} />
    </div>
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm animate-textShine">{value}</p>
    </div>
  </div>
);

export default ProfilePage;
