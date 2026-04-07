import { Helmet } from "react-helmet-async";

export default function SEO({ title, description, urlPath = "/", type = "website" }) {
  const base = import.meta.env.VITE_SITE_URL || "https://propverse.ai";
  const fullUrl = `${base}${urlPath}`;
  const image = `${base}/og-cover.png`;

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PropVerse AI",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: "1999",
    },
    description,
    url: fullUrl,
  };

  const realEstateSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "PropVerse AI",
    description: "AI construction cost planning and 3D floor intelligence platform.",
    url: fullUrl,
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <script type="application/ld+json">{JSON.stringify(softwareSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(realEstateSchema)}</script>
    </Helmet>
  );
}
