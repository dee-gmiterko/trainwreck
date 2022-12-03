import React from "react";
import Layout from "../components/Layout/Layout";
import Game from "../components/Game/Game";
import { graphql } from "gatsby";

const IndexPage = ({ data: { site, cardImagesData } }) => {

  return (
    <Layout siteMetadata={site.siteMetadata}>
      <main>
        <Game />
      </main>
    </Layout>
  );
};

export default IndexPage;

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        author
        description
        siteUrl
        title
        keywords
      }
    }
  }
`;
