// Pages/About.jsx - Cleaned About Page with Subtle Founder Section
import React from 'react';
import { Timer, Users, Clock, Target, Trophy, TrendingUp, Heart, Zap, Github, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  const handleFounderProfile = () => {
    // This would navigate to the founder's profile page
    navigate('/profile/callmenixsh'); // or however your profile routing works
  };

  const handleGitHub = () => {
    window.open('https://github.com/callmenixsh', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
              <Timer size={36} className="text-white" />
            </div>
            <h1 className="text-5xl font-bold text-primary" style={{ fontFamily: "Joti One" }}>
              Dorofi
            </h1>
          </div>
          <h2 className="text-3xl font-bold text-primary mb-4">
            Focus Better with the Pomodoro Technique
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Transform your productivity with 25-minute focused work sessions, enhanced with 
            social features and smart tracking.
          </p>
        </div>

        {/* What is Pomodoro */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-primary mb-8 text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">25-Minute Focus Sessions</h3>
                  <p className="text-secondary text-sm">
                    Work in focused bursts that align with your brain's natural attention span.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap size={24} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Strategic Breaks</h3>
                  <p className="text-secondary text-sm">
                    5-minute breaks after each session to rest and recharge your mind.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Build Habits</h3>
                  <p className="text-secondary text-sm">
                    Create sustainable productivity habits that prevent burnout.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-xl p-6 border border-surface">
              <h3 className="text-xl font-semibold text-primary mb-4">Why Pomodoro Works</h3>
              <p className="text-secondary mb-4 text-sm">
                Developed by Francesco Cirillo, backed by research on focus and motivation:
              </p>
              <ul className="space-y-2 text-secondary text-sm">
                <li>• Reduces mental fatigue through regular breaks</li>
                <li>• Creates urgency that combats procrastination</li>
                <li>• Provides frequent sense of accomplishment</li>
                <li>• Makes overwhelming tasks feel manageable</li>
              </ul>
            </div>
          </div>
        </div>

        {/* What Makes Dorofi Different */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-primary mb-8 text-center">What Makes Dorofi Special</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface p-6 rounded-xl border border-surface text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">Social Focus</h3>
              <p className="text-secondary text-sm">
                Study with friends and stay motivated together.
              </p>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-surface text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">Smart Tracking</h3>
              <p className="text-secondary text-sm">
                Track your focus patterns and optimize your productivity.
              </p>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-surface text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Trophy size={24} className="text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">Achievements</h3>
              <p className="text-secondary text-sm">
                Earn streaks, unlock badges, and celebrate progress.
              </p>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 border border-surface text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Heart size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-4">Our Mission</h2>
            <p className="text-secondary max-w-2xl mx-auto">
              To make focused work accessible, enjoyable, and sustainable for everyone. 
              We believe productivity should enhance your life, not overwhelm it.
            </p>
          </div>
        </div>

        {/* Subtle Founder Credit */}
        <div className="text-center">
          <div className="inline-flex items-center gap-4 text-sm text-secondary">
            <span>Built by</span>
            <button
              onClick={handleFounderProfile}
              className="text-primary hover:text-accent transition-colors font-medium"
            >
              callmenixsh
            </button>
            <span>•</span>
            <button
              onClick={handleGitHub}
              className="flex items-center gap-1 text-secondary hover:text-primary transition-colors"
            >
              <Github size={14} />
              <span>Open Source</span>
              <ExternalLink size={12} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
