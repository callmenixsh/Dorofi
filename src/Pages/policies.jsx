// Pages/Policies.jsx - Simplified Policies Page
import React, { useState } from 'react';
import { FileText, Shield, HelpCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Policies = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('privacy');

  const tabs = [
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'terms', label: 'Terms', icon: FileText },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        
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
          <h1 className="text-3xl font-bold text-primary mb-4">Policies</h1>
          <p className="text-secondary">Privacy, terms, and frequently asked questions</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-surface rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-surface rounded-xl p-8">
          {activeTab === 'privacy' && <PrivacyContent />}
          {activeTab === 'terms' && <TermsContent />}
          {activeTab === 'faq' && <FAQContent />}
        </div>
      </div>
    </div>
  );
};

// Simplified Privacy Policy
const PrivacyContent = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-bold text-primary mb-2">Privacy Policy</h2>
      <p className="text-xs text-secondary mb-6">Last updated: December 20, 2024</p>
    </div>

    <div className="space-y-4 text-secondary">
      <div>
        <h3 className="font-semibold text-primary mb-2">What We Collect</h3>
        <p className="text-sm">Your Google account info (name, email, profile picture) and your Pomodoro session data to track your productivity.</p>
      </div>

      <div>
        <h3 className="font-semibold text-primary mb-2">How We Use It</h3>
        <p className="text-sm">To provide the service, track your progress and enable social features.</p>
      </div>

      <div>
        <h3 className="font-semibold text-primary mb-2">Your Data Rights</h3>
        <p className="text-sm">You can have your data exported, or deleted anytime.</p>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <p className="text-sm font-medium text-primary">We never sell your personal information.</p>
      </div>
    </div>
  </div>
);

// Simplified Terms of Service
const TermsContent = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-bold text-primary mb-2">Terms of Service</h2>
      <p className="text-xs text-secondary mb-6">Last updated: December 20, 2024</p>
    </div>

    <div className="space-y-4 text-secondary">
      <div>
        <h3 className="font-semibold text-primary mb-2">What Dorofi Does</h3>
        <p className="text-sm">Dorofi is a productivity app that helps you focus using Pomodoro timers, tracking, and social features.</p>
      </div>

      <div>
        <h3 className="font-semibold text-primary mb-2">Rules</h3>
        <div className="text-sm space-y-1">
          <p>✅ Use Dorofi for productivity and focus</p>
          <p>❌ Don't harass other users or misuse the service</p>
        </div>
      </div>

      <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
        <p className="text-sm font-medium text-accent">The service is provided "as is" without warranties.</p>
      </div>
    </div>
  </div>
);

// Simplified FAQ
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
      answer: "Yes, you can permanently delete your account by contacting."
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-primary mb-2">FAQ</h2>
        <p className="text-sm text-secondary mb-6">Common questions about Dorofi</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-background rounded-lg">
            <button
              onClick={() => setOpenFAQ(openFAQ === index ? -1 : index)}
              className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-background/50 transition-colors"
            >
              <span className="font-medium text-primary text-sm">{faq.question}</span>
              <span className={`text-secondary text-sm transition-transform ${openFAQ === index ? 'rotate-180' : ''}`}>
                ↓
              </span>
            </button>
            {openFAQ === index && (
              <div className="px-4 pb-3 text-secondary text-sm border-t border-background pt-3">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Policies;
