import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/Layout/Layout";

const NotFoundPage = ({ data }) => (
  <Layout title={"Not Found"} siteMetadata={data.site.siteMetadata}>
    <h1>Page not found</h1>
  </Layout>
);

export default NotFoundPage;

export const pageQuery = graphql`
  query NotFoundQuery {
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
