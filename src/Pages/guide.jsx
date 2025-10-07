// Pages/Guide.jsx - Comprehensive feature guide for Dorofi
import React, { useState } from 'react';
import { Timer, Users, BarChart3, Settings, Trophy, Play, Pause, RotateCcw, Clock, Target, Flame, Star, ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Guide = () => {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState('getting-started');

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const Section = ({ id, title, icon: Icon, children, defaultExpanded = false }) => {
    const isExpanded = expandedSection === id || defaultExpanded;
    
    return (
      <div className="bg-surface rounded-xl border border-surface mb-6">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-background transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon size={20} className="text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-primary">{title}</h2>
          </div>
          {isExpanded ? <ChevronDown size={20} className="text-secondary" /> : <ChevronRight size={20} className="text-secondary" />}
        </button>
        
        {isExpanded && (
          <div className="px-6 pb-6 border-t border-surface/30">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-16">
        
        {/* Back Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
              <Timer size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-primary">Dorofi Guide</h1>
          </div>
          <p className="text-xl text-secondary max-w-2xl mx-auto">
            Master every feature and boost your productivity with this complete guide
          </p>
        </div>

        {/* Quick Start */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 border border-surface mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4 text-center">Quick Start</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mb-2">1</div>
              <p className="text-sm text-secondary">Set your task</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mb-2">2</div>
              <p className="text-sm text-secondary">Start 25min timer</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mb-2">3</div>
              <p className="text-sm text-secondary">Take 5min break</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mb-2">4</div>
              <p className="text-sm text-secondary">Track progress</p>
            </div>
          </div>
        </div>

        {/* Feature Sections */}
        <Section id="getting-started" title="Getting Started" icon={Play} defaultExpanded>
          <div className="pt-4 space-y-4">
            <h3 className="text-lg font-semibold text-primary">What is the Pomodoro Technique?</h3>
            <p className="text-secondary">
              The Pomodoro Technique breaks work into 25-minute focused sessions followed by short breaks. 
              This helps maintain concentration while preventing burnout.
            </p>
            
            <h3 className="text-lg font-semibold text-primary mt-6">Your First Session</h3>
            <ol className="list-decimal list-inside space-y-2 text-secondary">
              <li>Go to the Timer page (home screen)</li>
              <li>Click "Add Task" to set what you'll work on (optional but recommended)</li>
              <li>Click the play button to start your 25-minute focus session</li>
              <li>Work without distractions until the timer rings</li>
              <li>Take a 5-minute break when prompted</li>
              <li>Repeat for better focus and productivity!</li>
            </ol>
          </div>
        </Section>

        <Section id="timer-features" title="Focus Timer" icon={Timer}>
          <div className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3">Timer Controls</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Play size={16} className="text-green-500" />
                    <span className="text-secondary">Start/Resume timer</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Pause size={16} className="text-yellow-500" />
                    <span className="text-secondary">Pause current session</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <RotateCcw size={16} className="text-red-500" />
                    <span className="text-secondary">Reset timer</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3">Session Types</h3>
                <div className="space-y-2 text-secondary text-sm">
                  <p><strong>Focus:</strong> 25 minutes of concentrated work</p>
                  <p><strong>Short Break:</strong> 5 minutes of rest</p>
                  <p><strong>Long Break:</strong> 15-30 minutes after 4 focus sessions</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-primary mt-6">Customization</h3>
            <p className="text-secondary">
              Click the settings icon to customize timer lengths, enable auto-start breaks, 
              choose notification sounds, and adjust other preferences to match your workflow.
            </p>
          </div>
        </Section>

        <Section id="tasks-feature" title="Task Management" icon={Target}>
          <div className="pt-4 space-y-4">
            <h3 className="text-lg font-semibold text-primary">Adding Tasks</h3>
            <p className="text-secondary">
              Click "Add Task" to create a specific goal for your focus session. This helps maintain 
              clarity about what you're working on and makes your sessions more intentional.
            </p>
            
            <h3 className="text-lg font-semibold text-primary mt-6">Task Features</h3>
            <ul className="list-disc list-inside space-y-1 text-secondary text-sm">
              <li>Set task names and descriptions</li>
              <li>Track which tasks you completed during sessions</li>
              <li>View task history and completion statistics</li>
              <li>Organize tasks by priority or category</li>
            </ul>
          </div>
        </Section>

        <Section id="friends-feature" title="Friends & Social" icon={Users}>
          <div className="pt-4 space-y-4">
            <h3 className="text-lg font-semibold text-primary">Adding Friends</h3>
            <p className="text-secondary">
              Connect with friends using usernames. Go to Friends page, click "Add Friend", 
              and enter their unique username to send a request.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3">Friend Features</h3>
                <ul className="list-disc list-inside space-y-1 text-secondary text-sm">
                  <li>View friends' focus statistics</li>
                  <li>Send and receive friend requests</li>
                  <li>See who's currently focusing</li>
                  <li>Compare progress and achievements</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3">Leaderboards</h3>
                <ul className="list-disc list-inside space-y-1 text-secondary text-sm">
                  <li>Daily focus time competitions</li>
                  <li>Weekly productivity challenges</li>
                  <li>All-time dedication rankings</li>
                  <li>Streak achievements</li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        <Section id="leaderboard-feature" title="Leaderboards & Competition" icon={Trophy}>
          <div className="pt-4 space-y-4">
            <h3 className="text-lg font-semibold text-primary">Three Leaderboard Types</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-background p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-primary" />
                  <h4 className="font-semibold text-primary">Today</h4>
                </div>
                <p className="text-secondary text-sm mb-2">Daily focus time + current streak</p>
                <p className="text-xs text-secondary">Resets daily at midnight</p>
              </div>
              
              <div className="bg-background p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={16} className="text-accent" />
                  <h4 className="font-semibold text-primary">This Week</h4>
                </div>
                <p className="text-secondary text-sm mb-2">Weekly focus time + goal progress</p>
                <p className="text-xs text-secondary">Resets every Monday</p>
              </div>
              
              <div className="bg-background p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star size={16} className="text-purple-500" />
                  <h4 className="font-semibold text-primary">All Time</h4>
                </div>
                <p className="text-secondary text-sm mb-2">Total focus time + longest streak</p>
                <p className="text-xs text-secondary">Permanent achievements</p>
              </div>
            </div>
            
          </div>
        </Section>

        <Section id="profile-stats" title="Profile & Analytics" icon={BarChart3}>
          <div className="pt-4 space-y-4">
            <h3 className="text-lg font-semibold text-primary">Your Profile</h3>
            <p className="text-secondary">
              View your complete productivity profile including focus statistics, achievements, 
              activity calendar, and progress over time. Track your improvement and maintain motivation.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3">Statistics Tracked</h3>
                <ul className="list-disc list-inside space-y-1 text-secondary text-sm">
                  <li>Total focus time and sessions</li>
                  <li>Daily and weekly progress</li>
                  <li>Current and longest streaks</li>
                  <li>Weekly goal completion</li>
                  <li>Average session length</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3">Visual Analytics</h3>
                <ul className="list-disc list-inside space-y-1 text-secondary text-sm">
                  <li>Activity calendar with daily progress</li>
                  <li>Weekly progress charts</li>
                  <li>Achievement badges and milestones</li>
                  <li>Goal completion visualization</li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        <Section id="settings-customization" title="Settings & Customization" icon={Settings}>
          <div className="pt-4 space-y-4">
            <h3 className="text-lg font-semibold text-primary">Timer Settings</h3>
            <ul className="list-disc list-inside space-y-2 text-secondary">
              <li><strong>Focus Duration:</strong> Customize work session length (default: 25 minutes)</li>
              <li><strong>Break Duration:</strong> Set short and long break lengths</li>
              <li><strong>Auto-Start:</strong> Automatically start breaks and sessions</li>
              <li><strong>Notifications:</strong> Choose sound alerts and browser notifications</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-primary mt-6">Profile Settings</h3>
            <ul className="list-disc list-inside space-y-2 text-secondary">
              <li><strong>Display Name:</strong> How you appear to friends</li>
              <li><strong>Weekly Goals:</strong> Set your target focus hours per week</li>
              <li><strong>Privacy:</strong> Control what friends can see</li>
              <li><strong>Friend Code:</strong> Share your unique code with others</li>
            </ul>
          </div>
        </Section>

        <Section id="study-rooms" title="Study Rooms (Coming Soon)" icon={Users}>
          <div className="pt-4 space-y-4">
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-primary mb-3">Virtual Study Spaces</h3>
              <p className="text-secondary mb-4">
                Join friends in virtual study rooms for synchronized focus sessions, 
                shared ambient sounds, and collaborative productivity.
              </p>
              
              <h4 className="font-semibold text-primary mb-2">Planned Features:</h4>
              <ul className="list-disc list-inside space-y-1 text-secondary text-sm">
                <li>Synchronized Pomodoro timers with friends</li>
                <li>Shared ambient soundscapes</li>
                <li>Gentle communication tools</li>
                <li>Group achievements and challenges</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Tips & Best Practices */}
        <div className="bg-surface rounded-xl border border-surface p-6 mt-8">
          <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
            <Flame size={24} className="text-orange-500" />
            Pro Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-primary mb-2">Build Consistency</h3>
              <ul className="list-disc list-inside space-y-1 text-secondary text-sm">
                <li>Focus on daily streaks over long sessions</li>
                <li>Set realistic weekly goals</li>
                <li>Use the same time slots each day</li>
                <li>Track your most productive hours</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-primary mb-2">Maximize Focus</h3>
              <ul className="list-disc list-inside space-y-1 text-secondary text-sm">
                <li>Turn off non-essential notifications</li>
                <li>Prepare your workspace before starting</li>
                <li>Use specific, actionable task names</li>
                <li>Take real breaks away from screens</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Get Started CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-8 border border-surface">
            <h2 className="text-2xl font-bold text-primary mb-4">Ready to Start Focusing?</h2>
            <p className="text-secondary mb-6">
              You now know everything about Dorofi. Time to put it into practice!
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors font-medium"
            >
              Start Your First Session
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Guide;
