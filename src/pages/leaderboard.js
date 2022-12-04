import React from "react";
import Layout from "../components/Layout/Layout";
import Leaderboard from "../components/Leaderboard/Leaderboard";
import { graphql } from "gatsby";
import store from "../game/store";
import { Provider } from "react-redux";

const LeaderboardPage = ({ data: { site } }) => {

  return (
    <Layout siteMetadata={site.siteMetadata}>
      <main className="leaderboard-page">
        <Provider store={store}>
          <Leaderboard size={500} />
        </Provider>
      </main>
    </Layout>
  );
};

export default LeaderboardPage;

export const pageQuery = graphql`
  query LeaderboardQuery {
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
