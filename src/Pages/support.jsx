// Pages/Support.jsx - GitHub-based support page
import React from 'react';
import { Timer, Github, Bug, ExternalLink, MessageCircle, BookOpen, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Support = () => {
  const navigate = useNavigate();

  const handleGitHubIssues = () => {
    window.open('https://github.com/callmenixsh/Dorofi/issues', '_blank');
  };

  const handleNewIssue = () => {
    window.open('https://github.com/callmenixsh/Dorofi/issues/new', '_blank');
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
              <MessageCircle size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-primary">Support</h1>
          </div>
          <p className="text-xl text-secondary max-w-2xl mx-auto">
            We're here to help you get the most out of Dorofi
          </p>
        </div>

        {/* Current Status */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 border border-surface mb-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <Timer size={16} className="text-primary" />
              <span className="text-primary font-medium">Currently in Development</span>
            </div>
            <h2 className="text-2xl font-bold text-primary mb-3">Support System Coming Soon</h2>
            <p className="text-secondary max-w-2xl mx-auto">
              We're working on building a comprehensive support system with help docs, 
              live chat, and email support. In the meantime, we're using GitHub Issues 
              to track bugs and feature requests.
            </p>
          </div>
        </div>

        {/* Bug Reporting Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-primary text-center mb-8">Found a Bug? Let Us Know!</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Report New Bug */}
            <div className="bg-surface p-6 rounded-xl border border-surface">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-4">
                <Bug size={24} className="text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Report a Bug</h3>
              <p className="text-secondary mb-4">
                Encountered an issue? Help us improve Dorofi by reporting bugs on GitHub. 
                Include as many details as possible to help us reproduce and fix the issue.
              </p>
              <button
                onClick={handleNewIssue}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                <Bug size={16} />
                <span>Report Bug</span>
                <ExternalLink size={14} />
              </button>
            </div>

            {/* View Existing Issues */}
            <div className="bg-surface p-6 rounded-xl border border-surface">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Github size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Browse Issues</h3>
              <p className="text-secondary mb-4">
                Check if someone else has already reported the same issue, or see what 
                we're working on. You can also upvote existing issues you care about.
              </p>
              <button
                onClick={handleGitHubIssues}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors font-medium"
              >
                <Github size={16} />
                <span>View Issues</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* How to Report Guidelines */}
        <div className="bg-surface rounded-2xl p-8 border border-surface mb-12">
          <h3 className="text-2xl font-bold text-primary mb-6 text-center">How to Report a Good Bug</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-primary mb-3">Include These Details:</h4>
              <ul className="space-y-2 text-secondary text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  What you were trying to do
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  What actually happened
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Your browser and device info
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Steps to reproduce the issue
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-primary mb-3">This Helps Us:</h4>
              <ul className="space-y-2 text-secondary text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  Fix bugs faster
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  Understand user needs better
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  Prioritize important fixes
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  Improve Dorofi for everyone
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Resources */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-primary text-center mb-8">Quick Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => navigate('/about')}
              className="bg-surface p-6 rounded-xl border border-surface hover:bg-background transition-colors text-left"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <BookOpen size={24} className="text-primary" />
              </div>
              <h3 className="font-semibold text-primary mb-2">About Dorofi</h3>
              <p className="text-secondary text-sm">Learn about the Pomodoro technique and how Dorofi works</p>
            </button>

            <button
              onClick={() => navigate('/guide')}
              className="bg-surface p-6 rounded-xl border border-surface hover:bg-background transition-colors text-left"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                <Timer size={24} className="text-accent" />
              </div>
              <h3 className="font-semibold text-primary mb-2">How to Use</h3>
              <p className="text-secondary text-sm">Step-by-step guide to get started with focused work</p>
            </button>

            <button
              onClick={() => navigate('/policies?tab=faq')}
              className="bg-surface p-6 rounded-xl border border-surface hover:bg-background transition-colors text-left"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle size={24} className="text-primary" />
              </div>
              <h3 className="font-semibold text-primary mb-2">FAQs</h3>
              <p className="text-secondary text-sm">Common questions and answers about Dorofi</p>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Support;
