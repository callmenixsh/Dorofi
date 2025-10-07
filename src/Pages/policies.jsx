// Pages/Policies.jsx - Google-style unified policies page
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileText, Shield, HelpCircle } from 'lucide-react';

const Policies = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get tab from URL search params
  const getTabFromUrl = () => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    return ['privacy', 'terms', 'faq'].includes(tab) ? tab : 'privacy';
  };

  const [activeTab, setActiveTab] = useState(getTabFromUrl());

  // Update URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('tab', activeTab);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [activeTab, navigate, location.pathname]);

  // Update tab when URL changes (back/forward navigation)
  useEffect(() => {
    setActiveTab(getTabFromUrl());
  }, [location.search]);

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms', label: 'Terms of Service', icon: FileText },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-surface/50 bg-background">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Dorofi Policies</h1>
          <p className="text-secondary">Privacy, terms, and frequently asked questions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface/50 bg-surface/20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-4 text-sm font-medium border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-primary text-primary bg-background'
                    : 'border-transparent text-secondary hover:text-primary hover:bg-surface/50'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {activeTab === 'privacy' && <PrivacyContent />}
        {activeTab === 'terms' && <TermsContent />}
        {activeTab === 'faq' && <FAQContent />}
      </div>
    </div>
  );
};

// Privacy Policy Content Component
const PrivacyContent = () => (
  <div className="prose prose-lg max-w-none">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-primary mb-4">Privacy Policy</h2>
      <p className="text-secondary">Last updated: December 20, 2024</p>
    </div>

    <div className="space-y-8 text-secondary">
      <section>
        <h3 className="text-xl font-semibold text-primary mb-4">Information We Collect</h3>
        
        <h4 className="font-medium text-primary mb-2">Account Information</h4>
        <p className="mb-4">When you sign in with Google, we collect your name, email address, and profile picture.</p>
        
        <h4 className="font-medium text-primary mb-2">Usage Data</h4>
        <p className="mb-4">We collect information about your Pomodoro sessions, including start times, duration, and completion status to provide productivity insights.</p>
        
        <h4 className="font-medium text-primary mb-2">Device Information</h4>
        <p>We automatically collect device and browser information, IP address, and usage patterns to improve our service.</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-primary mb-4">How We Use Your Information</h3>
        <ul className="space-y-2">
          <li>• Provide and maintain the Dorofi service</li>
          <li>• Track your productivity and focus sessions</li>
          <li>• Enable social features like study rooms and friend connections</li>
          <li>• Improve our service and develop new features</li>
          <li>• Send important service updates and announcements</li>
          <li>• Provide customer support</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-primary mb-4">Information Sharing</h3>
        <p className="mb-4"><strong>We do not sell your personal information.</strong></p>
        <p className="mb-4">We may share your information only in these situations:</p>
        <ul className="space-y-2">
          <li>• <strong>With your consent:</strong> When you choose to share data publicly (like leaderboards)</li>
          <li>• <strong>Service providers:</strong> Trusted partners who help operate our service</li>
          <li>• <strong>Legal requirements:</strong> When required by law or to protect user safety</li>
          <li>• <strong>Business transfers:</strong> In connection with a merger or acquisition</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-primary mb-4">Your Rights</h3>
        <ul className="space-y-2">
          <li>• <strong>Access:</strong> Export your data from account settings</li>
          <li>• <strong>Correction:</strong> Update your information through your profile</li>
          <li>• <strong>Deletion:</strong> Delete your account and all data permanently</li>
          <li>• <strong>Marketing:</strong> Opt out of promotional emails</li>
        </ul>
      </section>

      {/* <section>
        <h3 className="text-xl font-semibold text-primary mb-4">Contact Us</h3>
        <p>Questions about this privacy policy? Contact us at:</p>
        <p className="mt-2">
          Email: <a href="mailto:privacy@dorofi.com" className="text-primary underline">privacy@dorofi.com</a>
        </p>
      </section> */}
    </div>
  </div>
);

// Terms of Service Content Component
const TermsContent = () => (
  <div className="prose prose-lg max-w-none">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-primary mb-4">Terms of Service</h2>
      <p className="text-secondary">Last updated: December 20, 2024</p>
    </div>

    <div className="space-y-8 text-secondary">
      <section>
        <h3 className="text-xl font-semibold text-primary mb-4">Acceptance of Terms</h3>
        <p>By using Dorofi, you agree to these terms. If you don't agree, please don't use our service.</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-primary mb-4">Description of Service</h3>
        <p className="mb-4">Dorofi is a productivity platform that helps you focus using the Pomodoro technique. Our service includes:</p>
        <ul className="space-y-2">
          <li>• Focus timers and break reminders</li>
          <li>• Productivity tracking and analytics</li>
          <li>• Social features like study rooms and friend connections</li>
          <li>• Achievement systems and progress tracking</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-primary mb-4">User Eligibility</h3>
        <p>You must be at least 13 years old to use Dorofi. If you're between 13 and 18, you need parental consent.</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-primary mb-4">Acceptable Use</h3>
        <p className="mb-4"><strong>You may:</strong></p>
        <ul className="space-y-2 mb-4">
          <li>• Use Dorofi for productivity and focus</li>
          <li>• Participate in social features</li>
          <li>• Share achievements with friends</li>
        </ul>
        
        <p className="mb-4"><strong>You may not:</strong></p>
        <ul className="space-y-2">
          <li>• Use the service for illegal activities</li>
          <li>• Harass or harm other users</li>
          <li>• Attempt to hack or disrupt the service</li>
          <li>• Spam or send unwanted communications</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-primary mb-4">Disclaimers</h3>
        <p className="mb-4"><strong>The service is provided "as is" without warranties.</strong></p>
        <p>We don't guarantee that Dorofi will be error-free or uninterrupted. We're not responsible for any damages from using the service.</p>
      </section>

      {/* <section>
        <h3 className="text-xl font-semibold text-primary mb-4">Contact Information</h3>
        <p>Questions about these terms? Contact us:</p>
        <p className="mt-2">
          Email: <a href="mailto:legal@dorofi.com" className="text-primary underline">legal@dorofi.com</a>
        </p>
      </section> */}
    </div>
  </div>
);

// FAQ Content Component
const FAQContent = () => {
  const [openFAQ, setOpenFAQ] = useState(0);

  const faqs = [
    {
      question: "What is the Pomodoro Technique?",
      answer: "The Pomodoro Technique is a time management method that uses 25-minute focused work sessions followed by short breaks. It helps improve concentration and prevent burnout."
    },
    {
      question: "Is Dorofi free to use?",
      answer: "Yes, Dorofi is currently free to use. All core features including timers, tracking, and social features are available at no cost."
    },
    {
      question: "How do I create an account?",
      answer: "You can create an account by clicking 'Sign Up/Login' and authenticating with your Google account. We use Google OAuth for secure authentication."
    },
    {
      question: "Can I customize timer lengths?",
      answer: "Yes! You can customize work and break durations in your settings. While 25 minutes is the traditional Pomodoro length, you can adjust it to fit your needs."
    },
    {
      question: "How does the streak system work?",
      answer: "Streaks track consecutive days of completing at least one Pomodoro session. The longer your streak, the more achievements you unlock."
    },
    {
      question: "Is my data private?",
      answer: "Yes, we take privacy seriously. We don't sell your data, and you can export or delete all your information at any time. See our Privacy Policy for details."
    },
    {
      question: "Can I use Dorofi offline?",
      answer: "Dorofi requires an internet connection for social features and data syncing. However, basic timer functionality may work offline."
    },
    {
      question: "How do I add friends?",
      answer: "Once logged in, go to the Friends page where you can search for other users by their username to send friend requests."
    },
    {
      question: "Can I delete my account?",
      answer: "Yes, you can permanently delete your account and all associated data from your profile settings. This action cannot be undone."
    }
  ];

  return (
    <div className="prose prose-lg max-w-none">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
        <p className="text-secondary">Common questions about Dorofi and the Pomodoro technique</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-surface rounded-lg">
            <button
              onClick={() => setOpenFAQ(openFAQ === index ? -1 : index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-surface/50 transition-colors"
            >
              <span className="font-medium text-primary">{faq.question}</span>
              <span className={`text-secondary transition-transform ${openFAQ === index ? 'rotate-180' : ''}`}>
                ↓
              </span>
            </button>
            {openFAQ === index && (
              <div className="px-6 pb-4 text-secondary">
                <div className="border-t border-surface pt-4">
                  {faq.answer}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
{/* 
      <section className="mt-12">
        <h3 className="text-xl font-semibold text-primary mb-4">Still have questions?</h3>
        <p className="text-secondary mb-4">
          Can't find what you're looking for? We're here to help.
        </p>
        <p className="text-secondary">
          Contact us: <a href="mailto:support@dorofi.com" className="text-primary underline">support@dorofi.com</a>
        </p>
      </section> */}
    </div>
  );
};

export default Policies;
