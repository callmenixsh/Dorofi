// Pages/Rooms.jsx - Coming Soon page with your theme
import React from 'react';
import { Users, Timer, Headphones, MessageCircle, Star, Clock, Heart, Zap } from 'lucide-react';

const Rooms = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-16">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
              <Users size={32} className="text-background" />
            </div>
            <h1 className="text-4xl font-bold text-primary">Study Rooms</h1>
          </div>
          <p className="text-xl text-secondary max-w-2xl mx-auto">
            Focus together with friends in virtual study spaces. Coming soon to make your Pomodoro sessions even more productive!
          </p>
        </div>

        {/* Coming Soon Banner */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 border border-surface mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
            <Clock size={16} className="text-primary animate-pulse" />
            <span className="text-primary font-medium">Coming Soon</span>
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">We're Building Something Special</h2>
          <p className="text-secondary">
            Study Rooms will transform how you focus with friends. Get ready for the most engaging way to stay productive together.
          </p>
        </div>

        {/* Features Preview */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">What's Coming</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-surface p-6 rounded-xl border border-surface">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Users size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Virtual Study Spaces</h3>
              <p className="text-secondary">
                Create or join study rooms with friends. Share the energy of focused work and stay motivated together through synchronized Pomodoro sessions.
              </p>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-surface">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                <Timer size={24} className="text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Synced Sessions</h3>
              <p className="text-secondary">
                Start Pomodoro timers together, take breaks at the same time, and celebrate completed sessions as a group.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-primary text-center mb-8">Why Study Together?</h2>
          
          <div className="bg-surface rounded-2xl p-8 border border-surface">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap size={24} className="text-background" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">Stay Accountable</h3>
                <p className="text-secondary text-sm">
                  Knowing others are focusing alongside you creates natural accountability and motivation.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart size={24} className="text-background" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">Reduce Loneliness</h3>
                <p className="text-secondary text-sm">
                  Turn solitary work into a shared experience without the distractions of traditional study groups.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Star size={24} className="text-background" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">Better Results</h3>
                <p className="text-secondary text-sm">
                  Studies show that body doubling and parallel work can significantly improve focus and productivity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Features Reminder */}
        <div className="text-center">
          <div className="bg-surface rounded-xl p-6 border border-surface">
            <h3 className="text-lg font-semibold text-primary mb-2">While You Wait...</h3>
            <p className="text-secondary mb-4">
              Keep building your focus habits with our existing features!
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-primary text-background rounded-lg hover:bg-accent transition-colors font-medium"
              >
                Start Focus Timer
              </button>
              <button 
                onClick={() => window.location.href = '/friends'}
                className="px-4 py-2 bg-surface text-primary rounded-lg hover:bg-background transition-colors font-medium border border-surface"
              >
                Connect with Friends
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Rooms;
