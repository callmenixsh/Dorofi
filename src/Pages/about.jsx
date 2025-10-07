// Pages/About.jsx - Improved with reduced clutter and proper theming
import React from 'react';
import { Timer, Users, Clock, Target, Trophy, TrendingUp, Heart, Zap } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                <Timer size={32} className="text-background" />
              </div>
              <h1 className="text-5xl font-bold text-primary" style={{ fontFamily: "Joti One" }}>
                Dorofi
              </h1>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Master Focused Work with Friends
            </h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto leading-relaxed">
              Transform your productivity with the proven Pomodoro Technique, enhanced with 
              social connection and intelligent insights. Focus better, together.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        
        {/* What is Pomodoro Section */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">The Science of Productive Focus</h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto">
              Work in 25-minute focused sprints, take strategic breaks, build sustainable habits.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">25-Minute Focus Sprints</h3>
                  <p className="text-secondary">
                    Work in focused bursts that align with your brain's natural attention span.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap size={24} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">Strategic Breaks</h3>
                  <p className="text-secondary">
                    5-minute breaks after each session. Your brain gets time to rest and recharge.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">Sustainable Productivity</h3>
                  <p className="text-secondary">
                    Avoid burnout through consistent, manageable work sessions.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-8 border border-surface">
              <h3 className="text-2xl font-bold text-primary mb-4">Why Pomodoro Works</h3>
              <p className="text-secondary mb-6">
                Developed by Francesco Cirillo, backed by decades of research on attention and motivation:
              </p>
              <ul className="space-y-3 text-secondary">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Reduces mental fatigue through regular breaks
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Creates urgency that combats procrastination
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Provides frequent sense of accomplishment
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Why Dorofi is Different */}
        <div className="py-16 border-t border-surface">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Traditional Pomodoro, Modern Twist</h2>
            <p className="text-lg text-secondary">Enhanced with features that make it more effective and engaging</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-surface p-6 rounded-xl border border-surface">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                <Users size={24} className="text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Social Focus</h3>
              <p className="text-secondary">
                Study with friends in virtual rooms. Turn solitary work into a shared experience.
              </p>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-surface">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Smart Analytics</h3>
              <p className="text-secondary">
                Track your focus patterns and optimize your schedule based on real data.
              </p>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-surface">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                <Trophy size={24} className="text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Achievement System</h3>
              <p className="text-secondary">
                Earn streaks, unlock badges, compete on leaderboards. Make productivity rewarding.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="py-16 border-t border-surface">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">How Dorofi Works</h2>
            <p className="text-lg text-secondary">Simple steps to transform your productivity</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-background font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">Choose Your Task</h3>
              <p className="text-secondary text-sm">
                Pick something you want to focus on - work, study, or any task requiring concentration.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-background font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">Start the Timer</h3>
              <p className="text-secondary text-sm">
                Hit start and work for 25 minutes. No distractions, just pure focus.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-background font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">Take a Break</h3>
              <p className="text-secondary text-sm">
                When the timer rings, take a 5-minute break. Step away, stretch, breathe.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-background font-bold text-xl">4</span>
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">Track & Celebrate</h3>
              <p className="text-secondary text-sm">
                Watch your progress grow, earn achievements, and build momentum.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="py-16 border-t border-surface">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Built with Care</h2>
            <p className="text-lg text-secondary">Our approach to productivity</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart size={24} className="text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-primary mb-2">Gentle Approach</h3>
                <p className="text-secondary">
                  No pressure, no guilt. Understanding that everyone's brain works differently.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-primary mb-2">Community Focused</h3>
                <p className="text-secondary">
                  Connect with friends, share achievements, and support each other's growth.
                </p>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default About;
