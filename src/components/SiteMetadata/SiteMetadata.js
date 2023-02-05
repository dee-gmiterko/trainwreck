import React from "react";

import siteImage from "../../images/og-banner.jpg";

const siteMetadata = ({ title, siteMetadata }) => {
  const siteName = siteMetadata.title;
  const siteDescription = siteMetadata.description;
  const keywords = siteMetadata.keywords;

  return (
    <>
      <title>{title ? `${title} | ${siteName}` : siteName}</title>
      
      <meta name="description" content="Hello World" />
      <meta name="og:title" content={siteName} />
      <meta name="og:description" content={siteDescription} />
      <meta name="og:type" content="website" />
      <meta name="og:image" content={siteImage} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title ? `${title} | ${siteName}` : siteName} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={siteImage} />
      <meta name="keywords" content={keywords.join(`, `)} />
    </>
  );
};

export default siteMetadata;
