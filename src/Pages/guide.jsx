// Pages/Guide.jsx - Simplified Guide for Dorofi
import React, { useState } from 'react';
import { Timer, Users, BarChart3, Settings, Play, ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Guide = () => {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState('timer');

  const Section = ({ id, title, icon: Icon, children }) => {
    const isExpanded = expandedSection === id;
    
    return (
      <div className="bg-surface rounded-xl border border-surface mb-4">
        <button
          onClick={() => setExpandedSection(isExpanded ? null : id)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-background transition-colors"
        >
          <div className="flex items-center gap-3">
            <Icon size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-primary">{title}</h2>
          </div>
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
        
        {isExpanded && (
          <div className="px-5 pb-5 border-t border-surface/30 pt-4">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">
        

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <Timer size={40} className="text-primary" />
            <h1 className="text-3xl font-bold text-primary">How to Use Dorofi</h1>
          </div>
          <p className="text-secondary">A simple guide to boost your focus and productivity</p>
        </div>

        {/* Quick Start */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-primary mb-4">Quick Start</h2>
          <div className="space-y-3 text-secondary">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-background text-sm font-bold">1</div>
              <p>Click the play button to start a 25-minute focus session</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-background text-sm font-bold">2</div>
              <p>Work without distractions until the timer rings</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-background text-sm font-bold">3</div>
              <p>Take a 5-minute break and repeat!</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <Section id="timer" title="Focus Timer" icon={Timer}>
          <div className="space-y-3 text-secondary">
            <p><strong>What it does:</strong> Helps you focus in 25-minute sessions using the Pomodoro Technique</p>
            <p><strong>Controls:</strong> Play to start, pause to take a break, reset to restart</p>
            <p><strong>Breaks:</strong> After each session, you get a 5-minute break. After 4 sessions, you get a longer 15-minute break</p>
            <p><strong>Customize:</strong> Click the settings icon to change timer lengths and notification sounds</p>
          </div>
        </Section>

        <Section id="friends" title="Friends & Competition" icon={Users}>
          <div className="space-y-3 text-secondary">
            <p><strong>Add friends:</strong> Go to Friends page and search by username</p>
            <p><strong>Leaderboards:</strong> Compete with friends on daily, weekly, and all-time focus time</p>
            <p><strong>What you see:</strong> Friends' stats, current streaks, and who's focusing right now</p>
          </div>
        </Section>

        <Section id="stats" title="Stats & Progress" icon={BarChart3}>
          <div className="space-y-3 text-secondary">
            <p><strong>Your profile:</strong> See your total focus time, sessions completed, and current streak</p>
            <p><strong>Weekly goals:</strong> Set and track your weekly focus time targets</p>
            <p><strong>Achievements:</strong> Unlock badges as you hit milestones</p>
          </div>
        </Section>

        <Section id="settings" title="Settings" icon={Settings}>
          <div className="space-y-3 text-secondary">
            <p><strong>Timer lengths:</strong> Customize work and break durations</p>
            <p><strong>Daily Goals:</strong> Set and achieve daily goals</p>
            <p><strong>Auto-start:</strong> Automatically start breaks and work sessions</p>
            <p><strong>Notifications:</strong> Choose browser notifications and completion sounds</p>
            <p><strong>Profile:</strong> Update your display name and weekly goals</p>
          </div>
        </Section>

        {/* Tips */}
        <div className="bg-surface rounded-xl border border-surface p-6 mt-8">
          <h2 className="text-xl font-bold text-primary mb-4">Tips for Success</h2>
          <ul className="space-y-2 text-secondary">
            <li>• Focus on building a daily streak rather than long sessions</li>
            <li>• Turn off distractions before starting each session</li>
            <li>• Use the breaks - step away from your screen!</li>
            <li>• Set a realistic weekly goal and stick to it</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-primary text-background rounded-lg hover:bg-accent transition-colors font-medium inline-flex items-center gap-2"
          >
            <Play size={18} />
            Start Your First Session
          </button>
        </div>

      </div>
    </div>
  );
};

export default Guide;
