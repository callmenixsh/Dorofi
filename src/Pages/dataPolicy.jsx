// Pages/DataPolicy.jsx - Minimal version
import React from 'react';

const DataPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold text-primary mb-4">Privacy Policy</h1>
          <p className="text-secondary mb-8">Last updated: December 20, 2024</p>

          <div className="space-y-8 text-secondary">
            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">Information We Collect</h2>
              
              <h3 className="font-medium text-primary mb-2">Account Information</h3>
              <p className="mb-4">When you sign in with Google, we collect your name, email address, and profile picture.</p>
              
              <h3 className="font-medium text-primary mb-2">Usage Data</h3>
              <p className="mb-4">We collect information about your Pomodoro sessions, including start times, duration, and completion status to provide productivity insights.</p>
              
              <h3 className="font-medium text-primary mb-2">Device Information</h3>
              <p>We automatically collect device and browser information, IP address, and usage patterns to improve our service.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">How We Use Your Information</h2>
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
              <h2 className="text-xl font-semibold text-primary mb-4">Information Sharing</h2>
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
              <h2 className="text-xl font-semibold text-primary mb-4">Data Security</h2>
              <p>We use industry-standard security measures including encryption, secure authentication, and regular security audits. However, no method of transmission over the internet is 100% secure.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">Your Rights</h2>
              <ul className="space-y-2">
                <li>• <strong>Access:</strong> Export your data from account settings</li>
                <li>• <strong>Correction:</strong> Update your information through your profile</li>
                <li>• <strong>Deletion:</strong> Delete your account and all data permanently</li>
                <li>• <strong>Marketing:</strong> Opt out of promotional emails</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">Cookies and Tracking</h2>
              <p>We use cookies and similar technologies to maintain your session, remember your preferences, and analyze usage patterns. You can control cookies through your browser settings.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">Children's Privacy</h2>
              <p>Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">International Users</h2>
              <p>By using Dorofi, you consent to the transfer of your information to countries where we operate, which may have different privacy laws than your country.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">Changes to This Policy</h2>
              <p>We may update this privacy policy from time to time. We will notify you of significant changes by email or through the service.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">Contact Us</h2>
              <p>If you have questions about this privacy policy, contact us at:</p>
              <p className="mt-2">
                Email: <a href="mailto:privacy@dorofi.com" className="text-primary underline">privacy@dorofi.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPolicy;
