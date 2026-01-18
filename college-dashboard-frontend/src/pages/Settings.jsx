/**
 * Settings Page
 * AI Platform Dashboard
 */

import { useState } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    orgName: 'Acme AI Labs',
    timezone: 'UTC',
    language: 'English',
    notifications: true,
    activityAlerts: true,
    autoRetrain: false,
  });

  const toggle = (key) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="p-5 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
          Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage organization, preferences, and security settings
        </p>
      </div>

      {/* Organization */}
      <Section title="Organization">
        <Input
          label="Organization Name"
          value={settings.orgName}
          onChange={(v) => setSettings({ ...settings, orgName: v })}
        />

        <Select
          label="Timezone"
          value={settings.timezone}
          options={['UTC', 'IST', 'EST', 'PST']}
          onChange={(v) => setSettings({ ...settings, timezone: v })}
        />

        <Select
          label="Language"
          value={settings.language}
          options={['English', 'Spanish', 'German']}
          onChange={(v) => setSettings({ ...settings, language: v })}
        />
      </Section>

      {/* AI Preferences */}
      <Section title="AI Preferences">
        <Toggle
          label="Auto Retrain Knowledge Base"
          description="Automatically retrain chatbots when documents change"
          enabled={settings.autoRetrain}
          onToggle={() => toggle('autoRetrain')}
        />
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <Toggle
          label="System Notifications"
          description="Receive alerts for system events"
          enabled={settings.notifications}
          onToggle={() => toggle('notifications')}
        />

        <Toggle
          label="Activity Alerts"
          description="Get notified when workflows or extractions run"
          enabled={settings.activityAlerts}
          onToggle={() => toggle('activityAlerts')}
        />
      </Section>

      {/* Security */}
      <Section title="Security">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Change Password
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Update your account password
            </p>
          </div>

          <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 dark:hover:bg-indigo-500 transition">
            Update Password
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Two-Factor Authentication
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Add an extra layer of security
            </p>
          </div>

          <button className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-zinc-600 transition">
            Enable
          </button>
        </div>
      </Section>

      {/* Save */}
      <div className="flex justify-end">
        <button className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 dark:hover:bg-indigo-500 transition">
          Save Changes
        </button>
      </div>
    </div>
  );
};

/* ---------- UI COMPONENTS ---------- */

const Section = ({ title, children }) => (
  <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700 transition-theme space-y-6">
    <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
      {title}
    </h2>
    {children}
  </div>
);

const Input = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
      {label}
    </label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-zinc-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);

const Select = ({ label, value, options, onChange }) => (
  <div>
    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {options.map((o) => (
        <option
          key={o}
          className="bg-white dark:bg-zinc-900"
        >
          {o}
        </option>
      ))}
    </select>
  </div>
);

const Toggle = ({ label, description, enabled, onToggle }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>

    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition ${
        enabled
          ? 'bg-indigo-600'
          : 'bg-gray-300 dark:bg-zinc-600'
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
          enabled ? 'translate-x-5' : ''
        }`}
      />
    </button>
  </div>
);

export default Settings;
