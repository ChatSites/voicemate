
import React, { useEffect, lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load non-critical components for better initial load performance
const AudioPreview = lazy(() => import('@/components/AudioPreview'));
const UseCases = lazy(() => import('@/components/UseCases'));
const WhyItMatters = lazy(() => import('@/components/WhyItMatters'));
const Story = lazy(() => import('@/components/Story'));
const Technology = lazy(() => import('@/components/Technology'));
const HowItWorks = lazy(() => import('@/components/HowItWorks'));
const CallToAction = lazy(() => import('@/components/CallToAction'));

const SectionSkeleton = () => (
  <div className="py-12 px-4">
    <div className="container mx-auto">
      <Skeleton className="h-12 w-1/2 mx-auto mb-8 bg-gray-800" />
      <Skeleton className="h-32 w-full bg-gray-800" />
    </div>
  </div>
);

const Index = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  useEffect(() => {
    document.title = 'VoiceMate ID – Your Voice, Your Identity';
  }, []);

  return (
    <>
      <SEO 
        title="VoiceMate Pulse ID – Your Voice, Your Identity"
        description="Revolutionary voice identification technology that replaces phone numbers. Create your unique Pulse ID and communicate securely with just your voice. Live your life, uninterrupted."
        url="https://voicemate.id"
        keywords="voice identification, voice biometrics, secure communication, digital identity, VoiceMate, Pulse ID, voice technology, phone number replacement"
      />
      <div className={`min-h-screen flex flex-col overflow-hidden ${isDark ? 'bg-black' : 'bg-white'} ${isDark ? 'text-white' : 'text-gray-900'}`}>
        <Navbar />
        <Hero />
        
        <Suspense fallback={<SectionSkeleton />}>
          <AudioPreview />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <UseCases />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <HowItWorks />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <WhyItMatters />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <Story />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <Technology />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <CallToAction />
        </Suspense>
        
        <Footer />
      </div>
    </>
  );
};

export default Index;
