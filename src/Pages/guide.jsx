import React, { useState } from 'react';
import { Timer, Users, BarChart3, Settings, Play, Keyboard, Headphones, ChevronDown, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const tabs = [
  { id: 'timer', label: 'Timer', icon: Timer },
  { id: 'social', label: 'Friends & Rooms', icon: Users },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
  { id: 'extras', label: 'Sounds & Keys', icon: Headphones },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const Guide = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('timer');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-primary mb-2">How to Use Dorofi</h1>
          <p className="text-secondary">Everything you need to know, nothing you don't.</p>
        </div>

        {/* Quick Start */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-primary mb-4">Quick Start</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: '1', text: 'Press play to start a 25-minute focus session' },
              { step: '2', text: 'Work without distractions until the timer rings' },
              { step: '3', text: 'Take a 5-minute break, then repeat' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-start gap-3">
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-surface text-xs font-bold flex-shrink-0 mt-0.5">{step}</div>
                <p className="text-secondary text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === id
                  ? 'bg-primary text-surface'
                  : 'text-secondary hover:bg-surface hover:text-primary'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-surface rounded-xl border border-surface p-6">

          {activeTab === 'timer' && (
            <div className="space-y-5">
              <SectionTitle icon={Timer} title="Focus Timer" />
              <Info label="Start" text="Click the play button. A 25-minute countdown begins." />
              <Info label="Pause" text="Click pause if you need to step away. Resume where you left off." />
              <Info label="Reset" text="Click reset to restart the current session from the beginning." />
              <Info label="Breaks" text="After each 25-minute session, a 5-minute break starts. After 4 sessions, you get a 15-minute long break." />
              <Info label="Customize" text="Click the gear icon to change work/break durations and notification sounds." />
              <div className="bg-background rounded-lg p-4 mt-4">
                <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                  <Keyboard size={14} /> Keyboard Shortcuts
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-secondary">
                  <span><kbd className="px-1.5 py-0.5 bg-surface rounded text-xs font-mono">Space</kbd> Play / Pause</span>
                  <span><kbd className="px-1.5 py-0.5 bg-surface rounded text-xs font-mono">R</kbd> Reset timer</span>
                  <span><kbd className="px-1.5 py-0.5 bg-surface rounded text-xs font-mono">F</kbd> Focus mode</span>
                  <span><kbd className="px-1.5 py-0.5 bg-surface rounded text-xs font-mono">S</kbd> Toggle settings</span>
                  <span><kbd className="px-1.5 py-0.5 bg-surface rounded text-xs font-mono">N</kbd> New task</span>
                  <span><kbd className="px-1.5 py-0.5 bg-surface rounded text-xs font-mono">Tab</kbd> Cycle sessions</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-5">
              <SectionTitle icon={Users} title="Friends & Competition" />
              <Info label="Add friends" text="Go to the Friends page and search by their exact username." />
              <Info label="Leaderboard" text="Compete with friends on daily, weekly, and all-time focus time rankings." />
              <Info label="Requests" text="Send and accept friend requests from the Requests tab." />
              <Info label="See activity" text="View any friend's profile to see their stats, streaks, and achievements." />

              <div className="border-t border-surface/50 pt-5">
                <SectionTitle icon={Users} title="Study Rooms" />
                <Info label="Browse rooms" text="Go to the Rooms page to see active study rooms you can join." />
                <Info label="Create a room" text="Start your own room and share the link with friends." />
                <Info label="Inside a room" text="You'll see a shared timer, who's in the room, and live focus status of everyone." />
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-5">
              <SectionTitle icon={BarChart3} title="Stats & Progress" />
              <Info label="Profile" text="Your profile shows total focus time, sessions completed, and current streak." />
              <Info label="Weekly goals" text="Set a weekly focus time target and track your progress toward it." />
              <Info label="Activity calendar" text="A heatmap showing which days you focused — visually see your consistency." />
              <Info label="Streaks" text="Daily streaks track consecutive days of focus. Missing a day resets it." />

              <div className="border-t border-surface/50 pt-5">
                <SectionTitle icon={Trophy} title="Achievements" />
                <Info label="Unlock badges" text="Earn achievements by hitting milestones — first session, 10 hours, 100 sessions, and more." />
                <Info label="Track progress" text="View all available achievements and your progress toward each one on your profile." />
              </div>
            </div>
          )}

          {activeTab === 'extras' && (
            <div className="space-y-5">
              <SectionTitle icon={Headphones} title="Focus Sounds" />
              <Info label="Music player" text="The persistent music player at the bottom plays lofi/chill tracks to help you focus." />
              <Info label="White noise" text="Toggle ambient sounds — rain, ocean waves, underwater, or bird chirps — from the player settings." />
              <Info label="Volume" text="Separate volume sliders for music and white noise so you can mix your perfect focus environment." />

              <div className="border-t border-surface/50 pt-5">
                <SectionTitle icon={Keyboard} title="All Keyboard Shortcuts" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {[
                    ['Space', 'Play / Pause timer'],
                    ['R', 'Reset timer'],
                    ['S', 'Open timer settings'],
                    ['N', 'Open task list'],
                    ['F', 'Toggle focus mode (fullscreen)'],
                    ['Tab', 'Cycle between timer sessions'],
                    ['1–4', 'Switch to session 1 through 4'],
                    ['M', 'Toggle music player'],
                    ['/', 'Open this help modal'],
                  ].map(([key, desc]) => (
                    <div key={key} className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-background rounded text-xs font-mono text-primary min-w-[2rem] text-center">{key}</kbd>
                      <span className="text-secondary">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-5">
              <SectionTitle icon={Settings} title="Settings" />
              <Info label="Timer durations" text="Customize work session, short break, and long break lengths to fit your workflow." />
              <Info label="Daily goals" text="Set a daily focus time target to keep yourself accountable." />
              <Info label="Auto-start" text="Automatically start the next session or break without clicking play." />
              <Info label="Notifications" text="Enable browser notifications to get alerted when sessions or breaks end." />
              <Info label="Sounds" text="Choose which sound plays when a session completes." />
              <Info label="Profile" text="Update your display name and weekly goals from your profile page." />
              <Info label="Themes" text="Switch between Celestial, Ocean, Flame, and Void themes. Each has light and dark modes." />
            </div>
          )}

        </div>

        {/* Tips */}
        <div className="mt-8 bg-surface rounded-xl border border-surface p-6">
          <h3 className="font-semibold text-primary mb-3">Tips for actually building the habit</h3>
          <ul className="space-y-2 text-secondary text-sm">
            <li className="flex gap-2"><span className="text-primary">→</span> Focus on the daily streak, not long sessions. Consistency beats duration.</li>
            <li className="flex gap-2"><span className="text-primary">→</span> Close distracting tabs before hitting play. The timer only works if you commit.</li>
            <li className="flex gap-2"><span className="text-primary">→</span> Actually take your breaks. Step away from the screen.</li>
            <li className="flex gap-2"><span className="text-primary">→</span> Set a realistic weekly goal and track it. Adjust as you go.</li>
            <li className="flex gap-2"><span className="text-primary">→</span> Use study rooms for accountability — it's harder to quit when friends are watching.</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-surface transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Play size={18} />
            Start Your First Session
          </button>
        </div>

      </div>
    </div>
  );
};

const SectionTitle = ({ icon: Icon, title }) => (
  <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
    <Icon size={18} className="text-accent" />
    {title}
  </h3>
);

const Info = ({ label, text }) => (
  <div className="flex gap-3">
    <span className="text-primary text-sm font-semibold min-w-[5.5rem] flex-shrink-0">{label}</span>
    <span className="text-secondary text-sm">{text}</span>
  </div>
);

export default Guide;
