import { Helmet } from "react-helmet";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  type?: string;
  image?: string;
  url?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export function SEO({
  title,
  description,
  keywords = [],
  author,
  type = "website",
  image,
  url,
  publishedTime,
  modifiedTime,
}: SEOProps) {
  const siteTitle = "Movement for Positive Change Ghana";
  const siteDescription = "Leading policy research organization in Ghana driving positive societal change through innovative research, youth engagement, and evidence-based policy recommendations.";
  const siteUrl = "https://mpcghana.org";
  const defaultKeywords = [
    "Ghana think tank",
    "policy research Ghana",
    "youth engagement Ghana",
    "policy innovation Ghana",
    "Ghana development",
    "research organization Ghana",
    "policy analysis",
    "social change Ghana",
    "development policy",
    "Ghana policy brief"
  ];

  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaDescription = description || siteDescription;
  const metaKeywords = [...defaultKeywords, ...keywords].join(", ");
  const metaImage = image || `${siteUrl}/logo.png`;
  const canonicalUrl = url || siteUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      {author && <meta name="author" content={author} />}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteTitle} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Additional SEO Tags */}
      <meta name="language" content="English" />
      <meta name="geo.region" content="GH" />
      <meta name="geo.country" content="Ghana" />
      <meta name="geo.placename" content="Accra" />
      
      {/* Schema.org structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": siteTitle,
          "description": siteDescription,
          "url": siteUrl,
          "logo": `${siteUrl}/logo.png`,
          "sameAs": [
            "https://twitter.com/mpcghana",
            "https://linkedin.com/company/mpcghana",
            "https://facebook.com/mpcghana"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+233241695908",
            "contactType": "customer service",
            "email": "info@mpcghana.org"
          },
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "GH",
            "addressLocality": "Accra"
          }
        })}
      </script>
    </Helmet>
  );
}