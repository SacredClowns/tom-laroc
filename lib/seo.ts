// Central SEO config — global + local (Miami) discovery.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://tomlaroc.com"
).replace(/\/$/, "");

export const SITE = {
  name: "Tom Laroc",
  brand: "Tom Laroc — Hi-Fi-Ai",
  tagline: "AI that never looks like AI.",
  description:
    "Tom Laroc is an artist and designer first — the bridge between high-level generative AI and commercial multimedia production. Design-led AI strategy, creative direction, AI video & animation, generative art, music visuals, and multi-model pipelines. A 40-year discography; co-host of the daily #AIArtToday show. Based in South Beach, Miami; working worldwide.",
  city: "Miami Beach",
  region: "FL",
  country: "US",
  neighborhood: "South Beach",
  geo: { lat: 25.790654, lng: -80.13005 },
  email: "inquiries@tomlaroc.com",
  sameAs: [
    "https://x.com/TomLaroc",
    "https://www.instagram.com/tomlaroc/",
    "https://www.mixcloud.com/tomlaroc/",
  ],
  keywords: [
    "AI strategy",
    "AI consultant Miami",
    "creative director Miami",
    "AI strategist South Beach",
    "AI video",
    "AI animation",
    "generative art",
    "music visuals",
    "AI content production",
    "multi-model AI pipeline",
    "Sora",
    "Ideogram",
    "graphic design and AI",
    "design-led AI",
    "AI for brands",
    "AI workshops Miami",
    "brand AI strategy",
    "#AIArtToday",
    "Tom Laroc",
    "Hi-Fi-Ai",
  ],
};

// schema.org JSON-LD: WebSite + ProfessionalService (local) + Person (Tom).
export function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE.brand,
        description: SITE.description,
        publisher: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": ["ProfessionalService", "LocalBusiness"],
        "@id": `${SITE_URL}/#business`,
        name: SITE.brand,
        url: SITE_URL,
        image: `${SITE_URL}/opengraph-image`,
        email: SITE.email,
        description: SITE.description,
        priceRange: "$$$",
        founder: { "@id": `${SITE_URL}/#person` },
        areaServed: [
          { "@type": "City", name: "Miami" },
          { "@type": "City", name: "Miami Beach" },
          { "@type": "AdministrativeArea", name: "South Florida" },
          { "@type": "Country", name: "Worldwide" },
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: SITE.city,
          addressRegion: SITE.region,
          addressCountry: SITE.country,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: SITE.geo.lat,
          longitude: SITE.geo.lng,
        },
        sameAs: SITE.sameAs,
        knowsAbout: [
          "Artificial intelligence strategy",
          "Generative art",
          "AI video and animation",
          "Multi-model AI pipelines",
          "Music visuals",
          "Commercial multimedia production",
          "Creative direction",
          "Contemporary graphic design",
          "Brand systems",
          "AI workshops and training",
        ],
        makesOffer: [
          { "@type": "Offer", name: "AI Audit" },
          { "@type": "Offer", name: "Strategy Intensive" },
          { "@type": "Offer", name: "Monthly Advisory" },
        ],
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "Tom Laroc",
        url: SITE_URL,
        jobTitle: "Artist · Designer · AI Strategist & Creative Director",
        description:
          "Artist and designer bridging high-level generative AI and commercial multimedia production. A 40-year DJ discography; co-host of the daily #AIArtToday show. Born in the Bronx, based in South Beach, Miami for 20+ years.",
        homeLocation: {
          "@type": "Place",
          name: "South Beach, Miami Beach, FL",
        },
        sameAs: SITE.sameAs,
        knowsAbout: [
          "AI strategy",
          "Generative art",
          "Creative direction",
          "Graphic design",
        ],
      },
    ],
  };
}
