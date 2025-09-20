// Pages/About.jsx - Balanced Pomodoro-focused version
import React from 'react';
import { Timer, Users, Zap, Star, Play, Heart, Brain, Target, Trophy, TrendingUp, Clock, Gift, Lightbulb, Shield } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background text-primary">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                <Timer size={32} className="text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" style={{ fontFamily: "Joti One" }}>
                Dorofi
              </h1>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Master the Art of Focused Work
            </h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto leading-relaxed">
              Transform your productivity with the proven Pomodoro Technique, enhanced with modern features, 
              social connection, and intelligent insights. Built for everyone who wants to get things done 
              without burning out.
            </p>
          </div>
        </div>
      </div>

      {/* What is Pomodoro Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">The Science of Productive Focus</h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            The Pomodoro Technique uses time-blocking to maximize focus while preventing burnout. 
            Dorofi makes it social, rewarding, and smarter.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-primary mb-2">25-Minute Focus Sprints</h3>
                <p className="text-secondary">
                  Work in focused bursts that align with your brain's natural attention span. 
                  Long enough to get deep work done, short enough to stay motivated.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap size={24} className="text-blue-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-primary mb-2">Strategic Breaks</h3>
                <p className="text-secondary">
                  5-minute breaks after each session, 15-30 minute breaks after 4 sessions. 
                  Your brain gets time to rest and consolidate what you've learned.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target size={24} className="text-green-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-primary mb-2">Sustainable Productivity</h3>
                <p className="text-secondary">
                  Avoid the boom-and-bust cycle of overwork and procrastination. 
                  Build consistent habits that you can maintain long-term.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 border border-primary/10">
            <h3 className="text-2xl font-bold text-primary mb-4">Why Pomodoro Works</h3>
            <p className="text-secondary mb-6">
              Developed by Francesco Cirillo in the 1980s, the Pomodoro Technique is backed by decades 
              of research on attention, motivation, and habit formation:
            </p>
            <ul className="space-y-3 text-secondary">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Reduces mental fatigue through regular breaks
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Creates urgency that combats procrastination
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Provides frequent sense of accomplishment
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Helps estimate and plan work more accurately
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Why Dorofi is Different */}
      <div className="bg-gradient-to-r from-surface/30 to-surface/10 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Traditional Pomodoro, Modern Twist</h2>
            <p className="text-lg text-secondary">We've enhanced the classic technique with features that make it more effective and engaging</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-xl border border-surface">
              <div className="w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3 text-center">Social Focus</h3>
              <p className="text-secondary text-center">
                Study with friends in virtual rooms. Turn solitary work into a shared experience 
                that keeps you accountable and motivated.
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl border border-surface">
              <div className="w-16 h-16 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={32} className="text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3 text-center">Smart Analytics</h3>
              <p className="text-secondary text-center">
                Track your focus patterns, identify your most productive times, and optimize 
                your schedule based on real data.
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl border border-surface">
              <div className="w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Trophy size={32} className="text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3 text-center">Achievement System</h3>
              <p className="text-secondary text-center">
                Earn streaks, unlock badges, compete on leaderboards. Transform your productivity 
                journey into an engaging experience.
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl border border-surface">
              <div className="w-16 h-16 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3 text-center">Customizable</h3>
              <p className="text-secondary text-center">
                Adjust timer lengths, choose background sounds, pick themes. 
                Make Dorofi work exactly the way your brain needs it to.
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl border border-surface">
              <div className="w-16 h-16 bg-pink-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain size={32} className="text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3 text-center">Neurodiversity-Friendly</h3>
              <p className="text-secondary text-center">
                Built with understanding of different brain types. Whether you have ADHD, anxiety, 
                or just need better focus, Dorofi adapts to you.
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl border border-surface">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3 text-center">Rewarding Progress</h3>
              <p className="text-secondary text-center">
                Celebrate every win, no matter how small. Build momentum through positive 
                reinforcement and visible progress tracking.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">How Dorofi Works</h2>
          <p className="text-lg text-secondary">Simple steps to transform your productivity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-surface p-6 rounded-xl border border-surface text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">1</span>
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">Choose Your Task</h3>
            <p className="text-secondary text-sm">
              Pick something you want to focus on. Could be work, study, writing, or any task requiring concentration.
            </p>
          </div>

          <div className="bg-surface p-6 rounded-xl border border-surface text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">2</span>
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">Start the Timer</h3>
            <p className="text-secondary text-sm">
              Hit start and work for 25 minutes. No distractions, no multitasking - just pure focus on your chosen task.
            </p>
          </div>

          <div className="bg-surface p-6 rounded-xl border border-surface text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">3</span>
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">Take a Break</h3>
            <p className="text-secondary text-sm">
              When the timer rings, take a 5-minute break. Step away, stretch, breathe. Your brain will thank you.
            </p>
          </div>

          <div className="bg-surface p-6 rounded-xl border border-surface text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">4</span>
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">Track & Celebrate</h3>
            <p className="text-secondary text-sm">
              Watch your progress grow, earn achievements, and build momentum. Every session is a victory.
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Features */}
      <div className="bg-gradient-to-r from-surface/30 to-surface/10 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Enhanced for Modern Life</h2>
            <p className="text-lg text-secondary">Extra features that make your productivity journey more rewarding</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-background p-6 rounded-xl border border-surface">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Gift size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">Streak Rewards</h3>
              <p className="text-secondary text-sm">
                Build daily focus streaks and unlock special badges. Perfect for maintaining motivation 
                and celebrating consistency.
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl border border-surface">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <Users size={24} className="text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">Study Rooms</h3>
              <p className="text-secondary text-sm">
                Join virtual study rooms with friends or strangers. Share the energy of focused work 
                and stay accountable together.
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl border border-surface">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp size={24} className="text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">Progress Insights</h3>
              <p className="text-secondary text-sm">
                Understand your productivity patterns with detailed analytics. Find your peak focus times 
                and optimize your schedule.
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl border border-surface">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <Trophy size={24} className="text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">Friendly Competition</h3>
              <p className="text-secondary text-sm">
                Compete with friends on leaderboards, join challenges, and celebrate each other's 
                productivity wins.
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl border border-surface">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                <Heart size={24} className="text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">Gentle Approach</h3>
              <p className="text-secondary text-sm">
                No pressure, no guilt. Built with understanding that everyone's brain works differently 
                and productivity isn't one-size-fits-all.
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl border border-surface">
              <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb size={24} className="text-pink-500" />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">Smart Suggestions</h3>
              <p className="text-secondary text-sm">
                Get personalized recommendations for break activities, focus music, and optimal 
                session timing based on your patterns.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;
