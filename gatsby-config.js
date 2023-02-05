const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  pathPrefix: "/trainwreck",
  siteMetadata: {
    title: `Trainwreck`,
    description: `Simple pixi.js game`,
    author: `Dominik Gmiterko`,
    siteUrl: `https://ienze.me/trainwreck`,
    keywords: ["html5 game", "trainwreck", "rails", "game"],
  },
  plugins: [
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Trainwreck game`,
        short_name: `Trainwreck`,
        start_url: `/`,
        background_color: `#003039`,
        theme_color: `#fbb03b`,
        display: `minimal-ui`,
        icon: `src/images/icon.png`,
      },
    },
    `gatsby-plugin-offline`,
  ],
};
