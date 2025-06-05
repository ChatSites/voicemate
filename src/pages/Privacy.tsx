import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useTheme } from '@/components/providers/ThemeProvider';

const Privacy = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  useEffect(() => {
    document.title = 'Privacy Policy | VoiceMate ID';
  }, []);

  return (
    <>
      <SEO 
        title="Privacy Policy"
        description="Learn how VoiceMate protects your privacy and handles your voice identification data. Comprehensive privacy policy for our voice biometric services."
        url="https://voicemate.id/privacy"
        keywords="privacy policy, voice data protection, biometric privacy, VoiceMate privacy, voice identification security"
      />
      <div className={`min-h-screen flex flex-col ${isDark ? 'bg-black' : 'bg-white'} ${isDark ? 'text-white' : 'text-gray-900'}`}>
        <Navbar />
        
        <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
              <p className={isDark ? "text-gray-400" : "text-gray-600"}>Last Updated: May 10, 2025</p>
            </div>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. Introduction</h2>
              <p>
                At VoiceMate ID ("we," "our," or "us"), we respect your privacy and are committed to protecting your personal data. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our voice identification 
                service and visit our website.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
              <p>We collect the following types of information:</p>
              
              <h3 className="text-xl font-medium mt-4">2.1 Personal Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email address</li>
                <li>Username (PulseID)</li>
                <li>Voice samples and voice identity data</li>
                <li>Authentication data</li>
                <li>Profile information you choose to provide</li>
              </ul>
              
              <h3 className="text-xl font-medium mt-4">2.2 Usage Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Log data (IP address, browser type, pages visited)</li>
                <li>Device information</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
              <p>We use your information for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and maintain our service</li>
                <li>To authenticate your identity using voice biometrics</li>
                <li>To communicate with you and respond to inquiries</li>
                <li>To improve our service and develop new features</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized or 
                unlawful processing, accidental loss, destruction, or damage. Voice identification data is encrypted and stored 
                using industry-standard security practices.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. Your Rights</h2>
              <p>Depending on your location, you may have the following rights:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access to your personal data</li>
                <li>Correction of inaccurate data</li>
                <li>Deletion of your data</li>
                <li>Restriction or objection to processing</li>
                <li>Data portability</li>
                <li>Withdrawal of consent</li>
              </ul>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or our data practices, please contact us at:
                <a href="mailto:rick@voicemate.id" className="text-voicemate-red hover:text-voicemate-purple ml-2">rick@voicemate.id</a>
              </p>
            </section>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Privacy;
