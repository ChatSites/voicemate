
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTheme } from '@/components/providers/ThemeProvider';

const Terms = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  useEffect(() => {
    document.title = 'Terms of Service | VoiceMate ID';
  }, []);

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-black' : 'bg-white'} ${isDark ? 'text-white' : 'text-gray-900'}`}>
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>Last Updated: May 10, 2025</p>
          </div>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Agreement to Terms</h2>
            <p>
              These Terms of Service ("Terms") constitute a legally binding agreement between you and VoiceMate ID
              governing your access to and use of our website and voice identification services.
              By accessing or using our service, you agree to be bound by these Terms.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Account Registration</h2>
            <p>
              To use certain features of our service, you must register for an account. When you register, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Promptly notify us of any unauthorized access to your account</li>
            </ul>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Voice Data</h2>
            <p>
              By using our voice identification services, you grant us permission to collect, store, and process your voice 
              recordings and derived biometric data for the purposes of providing our services. We handle this data in accordance 
              with our Privacy Policy.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Intellectual Property</h2>
            <p>
              The service and its original content, features, and functionality are owned by VoiceMate ID and are protected by 
              international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Prohibited Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the service to impersonate others</li>
              <li>Attempt to bypass any security measures of the service</li>
              <li>Use the service for any illegal purpose</li>
              <li>Interfere with or disrupt the service</li>
              <li>Upload viruses or other malicious code</li>
            </ul>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Termination</h2>
            <p>
              We may terminate or suspend your account at our sole discretion, without prior notice, for conduct that we 
              determine violates these Terms or is harmful to other users of the service, us, or third parties, or for any 
              other reason.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, VoiceMate ID shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, 
              or any loss of data, use, goodwill, or other intangible losses.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. If we make material changes, we will notify you by email 
              or through the service. Your continued use of the service after such changes constitutes your acceptance of the new Terms.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Contact</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
              <a href="mailto:rick@voicemate.id" className="text-voicemate-red hover:text-voicemate-purple ml-2">rick@voicemate.id</a>
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
