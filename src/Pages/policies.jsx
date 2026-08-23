import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Shield, 
  HelpCircle, 
  ArrowLeft, 
  Database, 
  Eye, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  Check, 
  X, 
  Info, 
  ChevronDown 
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Policies = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const tabFromUrl = searchParams.get('tab') || 'privacy';
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['privacy', 'terms', 'faq'].includes(tab)) {
      setActiveTab(tab);
    } else {
      setActiveTab('privacy');
    }
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const tabs = [
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'terms', label: 'Terms', icon: FileText },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-background animate-page-in">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate('/')}
          className="group mb-8 inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors font-medium"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Back to focus
        </button>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-3">Legal & Help</h1>
          <p className="text-secondary text-sm md:text-base">Privacy, terms of service, and frequently asked questions</p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="flex bg-surface border border-surface rounded-xl p-1 gap-1 w-full max-w-sm shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-invert shadow-sm scale-[1.02]'
                      : 'text-secondary hover:bg-background hover:text-primary'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-surface border border-surface rounded-2xl p-6 md:p-8 shadow-sm transition-all duration-300">
          {activeTab === 'privacy' && <PrivacyContent />}
          {activeTab === 'terms' && <TermsContent />}
          {activeTab === 'faq' && <FAQContent />}
        </div>
      </div>
    </div>
  );
};

const PolicySection = (props) => {
  const Icon = props.icon;
  return (
    <div className="flex gap-4 items-start group">
      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 duration-200">
        <Icon size={20} />
      </div>
      <div className="space-y-1.5 flex-1">
        <h3 className="font-bold text-primary text-base leading-snug">{props.title}</h3>
        <div className="text-secondary text-sm leading-relaxed">{props.children}</div>
      </div>
    </div>
  );
};

const PrivacyContent = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-xl font-extrabold text-primary mb-1">Privacy Policy</h2>
      <p className="text-xs text-secondary/70">Last updated: December 20, 2024</p>
    </div>

    <div className="space-y-6">
      <PolicySection icon={Database} title="What We Collect">
        <p>Your Google account info (name, email, profile picture) and your Pomodoro session data to track your productivity.</p>
      </PolicySection>

      <PolicySection icon={Eye} title="How We Use It">
        <p>To provide the service, track your progress, personalize your experience, and enable social features.</p>
      </PolicySection>

      <PolicySection icon={Lock} title="Your Data Rights">
        <p>You own your data. You can have your progress history exported or permanently deleted at any time.</p>
      </PolicySection>
    </div>

    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-3 items-center">
      <ShieldCheck className="text-primary flex-shrink-0" size={20} />
      <p className="text-sm font-semibold text-primary">We never sell or rent your personal information.</p>
    </div>
  </div>
);

const TermsContent = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-xl font-extrabold text-primary mb-1">Terms of Service</h2>
      <p className="text-xs text-secondary/70">Last updated: December 20, 2024</p>
    </div>

    <div className="space-y-6">
      <PolicySection icon={Sparkles} title="What Dorofi Does">
        <p>Dorofi is a productivity platform that helps you focus using Pomodoro timers, statistics tracking, study rooms, and social features.</p>
      </PolicySection>

      <PolicySection icon={BookOpen} title="Rules of Conduct">
        <p className="mb-3">To keep Dorofi safe and productive for everyone, we ask that you follow these guidelines:</p>
        <div className="space-y-2">
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check size={12} className="stroke-[3]" />
            </span>
            <span className="text-sm">Use Dorofi for productivity, study, and genuine focus.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded bg-rose-500/10 text-rose-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <X size={12} className="stroke-[3]" />
            </span>
            <span className="text-sm">Do not harass other users, misuse study rooms, or attempt to exploit the service.</span>
          </div>
        </div>
      </PolicySection>
    </div>

    <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 flex gap-3 items-center">
      <Info className="text-accent flex-shrink-0" size={20} />
      <p className="text-sm font-semibold text-accent">The service is provided "as is" without any warranties.</p>
    </div>
  </div>
);

const FAQContent = () => {
  const [openFAQ, setOpenFAQ] = useState(0);

  const faqs = [
    {
      question: "What is the Pomodoro Technique?",
      answer: "25-minute focused work sessions followed by short breaks to improve concentration."
    },
    {
      question: "Is Dorofi free?",
      answer: "Yes, Dorofi is completely free to use with all features available."
    },
    {
      question: "How do I sign up?",
      answer: "Click 'Sign Up/Login' and authenticate with your Google account."
    },
    {
      question: "Can I customize timers?",
      answer: "Yes, you can adjust work and break durations in your settings."
    },
    {
      question: "How do streaks work?",
      answer: "Complete at least one Pomodoro session each day to maintain your streak."
    },
    {
      question: "Can I delete my account?",
      answer: "Yes, you can permanently delete your account by contacting support."
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-primary mb-1">FAQ</h2>
        <p className="text-sm text-secondary">Common questions about Dorofi</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openFAQ === index;
          return (
            <div 
              key={index} 
              className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                isOpen 
                  ? 'border-primary/30 bg-primary/5' 
                  : 'border-surface/50 hover:border-primary/20 bg-background/30 hover:bg-background/50'
              }`}
            >
              <button
                onClick={() => setOpenFAQ(isOpen ? -1 : index)}
                className="w-full px-5 py-4 text-left flex justify-between items-center transition-colors"
              >
                <span className={`font-semibold text-sm transition-colors duration-200 ${isOpen ? 'text-primary' : 'text-primary/90'}`}>
                  {faq.question}
                </span>
                <ChevronDown 
                  size={16} 
                  className={`text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} 
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4 pt-1 text-secondary text-sm border-t border-primary/10 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Policies;
