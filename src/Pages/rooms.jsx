// Pages/Rooms.jsx - Minimal Coming Soon page
import React from 'react';
import { Users, Clock, Globe } from 'lucide-react';

const Rooms = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md mx-auto text-center">
        
        {/* Icon & Title */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Globe size={36} className="text-background" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-3">Study Rooms</h1>
          <p className="text-secondary">
            Focus together with friends in virtual study spaces
          </p>
        </div>

        {/* Coming Soon Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-8">
          <Clock size={16} className="text-primary animate-pulse" />
          <span className="text-primary font-medium">Coming Soon</span>
        </div>

        {/* Simple CTA */}
        <div className="space-y-3">
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full px-6 py-3 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Start Focus Session
          </button>
          <button 
            onClick={() => window.location.href = '/friends'}
            className="w-full px-6 py-3 bg-surface text-primary rounded-lg hover:bg-surface/80 transition-colors border border-surface"
          >
            Connect with Friends
          </button>
        </div>

      </div>
    </div>
  );
};

export default Rooms;
