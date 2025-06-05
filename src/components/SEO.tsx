
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
  noIndex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title = 'VoiceMate Pulse ID – Your Voice, Your Identity',
  description = 'Revolutionary voice identification technology that replaces phone numbers. Create your unique Pulse ID and communicate securely with just your voice.',
  image = 'https://i.ibb.co/Xk8SwnKp/voicemate-og.png',
  url = 'https://voicemate.id',
  type = 'website',
  keywords = 'voice identification, voice biometrics, secure communication, digital identity, VoiceMate, Pulse ID, voice technology',
  noIndex = false
}) => {
  const fullTitle = title.includes('VoiceMate') ? title : `${title} | VoiceMate`;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={url} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:url" content={url} />
    </Helmet>
  );
};

export default SEO;
