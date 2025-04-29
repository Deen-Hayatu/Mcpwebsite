import { Helmet } from 'react-helmet';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  canonicalUrl?: string;
}

export function SEOHead({
  title,
  description,
  keywords = 'Ghana, policy research, economic development, social change, Africa development',
  ogImage = '/assets/og-image.jpg',
  ogUrl,
  canonicalUrl
}: SEOHeadProps) {
  // Construct full title with brand
  const fullTitle = `${title} | Movement for Positive Change Ghana`;
  
  // Get current URL if ogUrl not provided
  const url = ogUrl || (typeof window !== 'undefined' ? window.location.href : 'https://www.mpcghana.org');
  
  // Use provided canonical URL or default to current URL
  const canonical = canonicalUrl || url;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Movement for Positive Change Ghana" />
      <meta property="og:locale" content="en_GH" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="author" content="Movement for Positive Change Ghana" />
      <meta name="language" content="English" />
      <meta name="robots" content="index,follow" />
      <meta name="googlebot" content="index,follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="geo.region" content="GH" />
      <meta name="geo.placename" content="Accra" />
    </Helmet>
  );
}
