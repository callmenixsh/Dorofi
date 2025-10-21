// Pages/NotFound.jsx - 404 page using your theme
import React from 'react';
import { Timer, Home, ArrowLeft, Clock, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        
        {/* 404 Animation/Visual */}
        <div className="mb-8">
          <div className="relative">
            {/* Large 404 Text */}
            <div className="text-8xl md:text-9xl font-bold text-primary/10 mb-4">
              404
            </div>
            
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-secondary mb-2">
            Looks like this page took a break and didn't come back!
          </p>
          <p className="text-secondary">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors font-medium"
          >
            <Home size={20} />
            Go Home
          </button>
          
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-6 py-3 bg-surface text-primary rounded-lg hover:bg-background transition-colors font-medium border border-surface"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
        {/* Footer */}
        <div className="mt-8 text-xs text-secondary">
          <p>Error Code: 404 • Page Not Found</p>
          <p className="mt-1">
            Need help? <button className="text-primary hover:text-accent underline">Contact Support</button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default NotFound;
