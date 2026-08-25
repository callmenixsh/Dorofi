import React from 'react';
import { Users, TrendingUp, Trophy, Zap, Play, Timer, Headphones, Target, ChevronRight, Github, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useThemeAssets } from '../hooks/useThemeAssets';

const ThemeLogo = () => {
  const themeAssets = useThemeAssets();
  return (
    <img src={themeAssets.logo} alt="Dorofi Logo" className={`w-14 h-14 ${themeAssets.logoClass}`} />
  );
};

const Feature = ({ icon: Icon, iconColor, title, description }) => (
  <div className="bg-surface rounded-xl p-6 border border-surface group hover:border-primary/20 transition-colors">
    <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 ${iconColor}`}>
      <Icon size={22} />
    </div>
    <h3 className="font-semibold text-primary mb-1.5">{title}</h3>
    <p className="text-secondary text-sm leading-relaxed">{description}</p>
  </div>
);

const Step = ({ number, title, description }) => (
  <div className="flex gap-4">
    <div className="w-9 h-9 rounded-full bg-primary text-surface flex items-center justify-center flex-shrink-0 text-sm font-bold">
      {number}
    </div>
    <div>
      <h4 className="font-semibold text-primary text-sm mb-0.5">{title}</h4>
      <p className="text-secondary text-sm">{description}</p>
    </div>
  </div>
);

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">

      {/* ─── Hero ─── */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-3 mb-6">
          <ThemeLogo />
          <span className="text-3xl font-bold text-primary" style={{ fontFamily: 'Joti One' }}>Dorofi</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-primary leading-tight mb-5">
          Focus is better<br />when you're not alone.
        </h1>

        <p className="text-secondary text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          A social productivity platform built on the Pomodoro technique.
          Track sessions, compete on leaderboards, study in rooms with friends,
          and actually build the habits you've been putting off.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-surface transition-all hover:opacity-90 text-base"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Play size={18} />
            Start Focusing
          </button>
          <button
            onClick={() => navigate('/guide')}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-primary bg-surface border border-surface hover:border-primary/30 transition-colors text-base"
          >
            How It Works
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* ─── What You Get ─── */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-primary">Everything you need to actually focus</h2>
          <p className="text-secondary mt-2">Not just a timer. A system that makes productivity stick.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Feature
            icon={Timer}
            iconColor="bg-primary/10 text-primary"
            title="Pomodoro Timer"
            description="25-minute focused sessions with 5-minute breaks and longer rests every 4 cycles. Fully customizable."
          />
          <Feature
            icon={Users}
            iconColor="bg-accent/10 text-accent"
            title="Friends & Leaderboards"
            description="Add friends by username, see who's focusing now, and compete on daily and weekly leaderboards."
          />
          <Feature
            icon={TrendingUp}
            iconColor="bg-primary/10 text-primary"
            title="Progress Analytics"
            description="Detailed stats on total focus time, sessions, streaks, and weekly goals with a visual calendar."
          />
          <Feature
            icon={Trophy}
            iconColor="bg-accent/10 text-accent"
            title="Achievements & Streaks"
            description="Unlock badges at milestones, build daily streaks, and watch your consistency grow over time."
          />
          <Feature
            icon={Headphones}
            iconColor="bg-primary/10 text-primary"
            title="Focus Sounds"
            description="Built-in lofi music player and white noise — rain, ocean waves, underwater ambience — to keep you in the zone."
          />
          <Feature
            icon={Target}
            iconColor="bg-accent/10 text-accent"
            title="Study Rooms"
            description="Join or create real-time rooms to focus alongside others. Shared timers, shared accountability."
          />
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="bg-surface/50 border-y border-surface">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-primary text-center mb-10">Up and running in 30 seconds</h2>

          <div className="max-w-md mx-auto space-y-6">
            <Step
              number={1}
              title="Hit play"
              description="A 25-minute Pomodoro session starts immediately. No setup, no account needed."
            />
            <Step
              number={2}
              title="Work, then rest"
              description="Focus until the timer rings. Take a 5-minute break. Repeat 4x, then get a longer 15-minute break."
            />
            <Step
              number={3}
              title="Sign in to unlock everything"
              description="Google sign-in saves your stats, unlocks friends, leaderboards, achievements, and study rooms."
            />
          </div>
        </div>
      </section>

      {/* ─── Why Pomodoro / Why Dorofi ─── */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl font-bold text-primary mb-4">Why the Pomodoro Technique?</h2>
            <p className="text-secondary text-sm leading-relaxed mb-4">
              Developed by Francesco Cirillo in the late 1980s, the Pomodoro technique works because
              it aligns with how your brain naturally manages attention and motivation.
            </p>
            <ul className="space-y-2 text-secondary text-sm">
              <li className="flex gap-2"><span className="text-primary font-bold">→</span> Reduces mental fatigue through regular breaks</li>
              <li className="flex gap-2"><span className="text-primary font-bold">→</span> Creates urgency that combats procrastination</li>
              <li className="flex gap-2"><span className="text-primary font-bold">→</span> Turns overwhelming tasks into manageable chunks</li>
              <li className="flex gap-2"><span className="text-primary font-bold">→</span> Gives you a frequent sense of accomplishment</li>
            </ul>
          </div>

          <div className="bg-surface rounded-xl p-6 border border-surface">
            <h3 className="font-semibold text-primary mb-3">So why not just use any timer?</h3>
            <p className="text-secondary text-sm leading-relaxed">
              Because a timer alone doesn't build habits. Dorofi adds the social layer — friends
              who see you focusing, leaderboards that motivate, streaks that keep you coming back,
              and rooms that make focus feel less isolating. The timer is the engine.
              Everything else is why you'll actually stick with it.
            </p>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-10 border border-surface text-center">
          <h2 className="text-2xl font-bold text-primary mb-3">Ready to focus?</h2>
          <p className="text-secondary mb-6 max-w-lg mx-auto">
            No downloads. No account required to start. Just open and begin.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-surface transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Play size={18} />
            Open Dorofi
          </button>
        </div>
      </section>

      {/* ─── Founder ─── */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 text-md text-invert">
            <span>Built by</span>
            <button
              className="flex items-center gap-1 text-primary hover:text-accent transition-colors font-medium"
              onClick={() => window.open('https://github.com/callmenixsh/Dorofi', '_blank')}
            >
            <Github size={12} />
              callmenixsh
            </button>
            <span>•</span>
            <button
              className="flex items-center gap-1 text-accent hover:text-primary transition-colors"
              onClick={() => navigate('/profile/callmenixshh')}
            >
              Profile
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;
