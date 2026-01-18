/**
 * Modern Profile Page
 * AI Platform User Dashboard
 * Tailwind CSS required
 */

import { useState } from 'react'
import {
  Mail,
  Phone,
  MapPin,
  FileText,
  Link as LinkIcon,
  Plus,
  Sparkles,
} from 'lucide-react'

const ProfilePage = () => {
  const [user] = useState({
    name: 'AIRA Nova',
    role: 'AI Platform User',
    subtitle: 'Using AI for productivity, analytics and automation',
    email: 'aira.user@aiplatform.com',
    phone: '+91 98765 43210',
    location: 'India',
    skills: 'AI Tools, Prompting, Analytics, Automation',
    languages: 'English, Tamil, Hindi',
  })

  const banners = [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
    'https://images.unsplash.com/photo-1639322537228-f710d846310a',
  ]

  return (
    <div className="p-6 space-y-6">

      {/* Banner Section */}
      <div className="relative rounded-3xl overflow-hidden h-52">
        <img
          src={banners[0]}
          alt="AI banner"
          className="w-full h-full object-cover"
        />

        {/* Stronger Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/40 flex items-center px-6">
          <h1 className="text-2xl font-bold text-white animate-shine">
            Welcome back, {user.name}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT SECTION */}
        <div className="xl:col-span-2 space-y-6">

          {/* Profile Header */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                AI
              </div>

              <div className="flex-1">
                <h2 className="text-lg font-semibold animate-shine">
                  {user.name}
                </h2>
                <p className="text-sm text-indigo-500 font-medium">
                  {user.role}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {user.subtitle}
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
              This user actively leverages AI tools for daily productivity,
              decision making, analytics insights and automation workflows.
              The platform adapts recommendations based on usage patterns.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>• Smart task prioritization</li>
              <li>• AI generated insights</li>
              <li>• Personalized automation flows</li>
            </ul>
          </div>

          {/* AI Activity */}
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

            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-500">
                <tr>
                  <th className="px-6 py-3 text-left">Module</th>
                  <th className="px-6 py-3 text-left">Last Used</th>
                  <th className="px-6 py-3 text-left">AI Credits</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-zinc-700">
                {['AI Chat', 'Analytics', 'Automation'].map((item) => (
                  <tr
                    key={item}
                    className="hover:bg-indigo-50 dark:hover:bg-zinc-900/50 transition"
                  >
                    <td className="px-6 py-4 font-medium animate-shine">
                      {item}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      Today
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      120
                    </td>
                    <td className="px-6 py-4 text-indigo-600 font-medium">
                      Active
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="space-y-6">

          <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 p-6 space-y-4">
            <DetailRow icon={Phone} label="Phone" value={user.phone} />
            <DetailRow icon={Mail} label="Email" value={user.email} />
            <DetailRow icon={MapPin} label="Languages" value={user.languages} />
            <DetailRow icon={FileText} label="Skills" value={user.skills} />
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 p-6">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              AI Usage Report
            </p>

            <button className="flex items-center gap-2 text-sm text-indigo-600 hover:underline animate-shine">
              <LinkIcon size={14} />
              Download report
            </button>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes shine {
          0% { background-position: -200% }
          100% { background-position: 200% }
        }
        .animate-shine {
          background: linear-gradient(
            90deg,
            #2563eb,
            #60a5fa,
            #2563eb
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 3s linear infinite;
        }
      `}</style>
    </div>
  )
}

/* Components */

const IconLink = ({ label }) => (
  <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-zinc-700 flex items-center justify-center text-gray-600 dark:text-gray-300 cursor-pointer">
    {label}
  </div>
)

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex gap-3">
    <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-zinc-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
      <Icon size={16} />
    </div>
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm animate-shine">
        {value}
      </p>
    </div>
  </div>
)

export default ProfilePage
