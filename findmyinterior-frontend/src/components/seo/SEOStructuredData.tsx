import React from "react";

export function SEOStructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FindMyInterior",
    url: "https://findmyinterior.com",
    logo: "https://findmyinterior.com/logo.png",
    description: "Bihar's leading Home Improvement, Interior Design & Construction Marketplace",
    address: {
      "@type": "PostalAddress",
      addressRegion: "Bihar",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "support@findmyinterior.com",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FindMyInterior",
    url: "https://findmyinterior.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://findmyinterior.com/professionals?name={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const localServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "FindMyInterior Bihar Interior Marketplace",
    image: "https://findmyinterior.com/og-image.jpg",
    url: "https://findmyinterior.com",
    telephone: "+91-8000000000",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Patna",
      addressRegion: "Bihar",
      addressCountry: "IN",
    },
    areaServed: [
      { "@type": "City", name: "Patna" },
      { "@type": "City", name: "Gaya" },
      { "@type": "City", name: "Muzaffarpur" },
      { "@type": "City", name: "Bhagalpur" },
      { "@type": "City", name: "Darbhanga" },
    ],
    priceRange: "₹₹ - ₹₹₹₹",
    description: "Connect with 100% verified interior designers, architects, builders, and skilled contractors across Bihar.",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I get free interior design quotes in Bihar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Simply submit your requirement on FindMyInterior to get up to 3 custom, verified professional quotes within 24 hours with zero hidden charges.",
        },
      },
      {
        "@type": "Question",
        name: "Are the professionals on FindMyInterior verified?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, 100% of businesses and professionals listed on FindMyInterior undergo verification including business registration and background reviews.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localServiceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
