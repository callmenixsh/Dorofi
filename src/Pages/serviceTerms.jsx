// Pages/ServiceTerms.jsx - Minimal version
import React from 'react';

const ServiceTerms = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold text-primary mb-4">Terms of Service</h1>
          <p className="text-secondary mb-8">Last updated: December 20, 2024</p>

          <div className="space-y-8 text-secondary">
            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">Acceptance of Terms</h2>
              <p>By using Dorofi, you agree to these terms. If you don't agree, please don't use our service.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">Description of Service</h2>
              <p className="mb-4">Dorofi is a productivity platform that helps you focus using the Pomodoro technique. Our service includes:</p>
              <ul className="space-y-2">
                <li>• Focus timers and break reminders</li>
                <li>• Productivity tracking and analytics</li>
                <li>• Social features like study rooms and friend connections</li>
                <li>• Achievement systems and progress tracking</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">User Eligibility</h2>
              <p>You must be at least 13 years old to use Dorofi. If you're between 13 and 18, you need parental consent.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">User Accounts</h2>
              <p className="mb-4">You can create an account using Google authentication. You are responsible for:</p>
              <ul className="space-y-2">
                <li>• Keeping your account secure</li>
                <li>• Providing accurate information</li>
                <li>• Notifying us of unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">Acceptable Use</h2>
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
                <li>• Create multiple accounts to abuse features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">User Content</h2>
              <p>You retain ownership of content you create. By using Dorofi, you grant us permission to use your content to provide and improve our service.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">Privacy</h2>
              <p>Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use your information.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">Service Availability</h2>
              <p>Dorofi is currently free to use. We work to keep the service running smoothly but cannot guarantee 100% uptime. We may modify or discontinue features with reasonable notice.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">Intellectual Property</h2>
              <p>Dorofi and all related content, features, and functionality are owned by us and protected by copyright and other intellectual property laws.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">Disclaimers</h2>
              <p className="mb-4"><strong>The service is provided "as is" without warranties.</strong></p>
              <p>We don't guarantee that Dorofi will be error-free or uninterrupted. We're not responsible for any damages from using the service.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, we won't be liable for any indirect or consequential damages arising from your use of Dorofi.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">Termination</h2>
              <p>You can delete your account anytime. We may suspend accounts that violate these terms, but we'll try to work things out first.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">Changes to Terms</h2>
              <p>We may update these terms occasionally. We'll notify you of significant changes and give you time to review them.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">Governing Law</h2>
              <p>These terms are governed by applicable local laws. Any disputes will be resolved in appropriate courts.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">Contact Information</h2>
              <p>Questions about these terms? Contact us:</p>
              <p className="mt-2">
                Email: <a href="mailto:legal@dorofi.com" className="text-primary underline">legal@dorofi.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceTerms;
