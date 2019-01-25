const path = require(`path`);

module.exports = {
  siteMetadata: {
    title: "Roto-Broker",
    description:
      "Making it easy to get fantasy football trades done with your league mates!",
    url: "https://www.roto-broker.com", // No trailing slash allowed!
    author: "@ejnelson"
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-styled-components",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: path.join(__dirname, `src`, `images`)
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `image`,
        path: `${__dirname}/src/images`
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "Roto-Broker",
        short_name: "Roto-Bro",
        start_url: "/",
        background_color: "#8c52ff",
        theme_color: "#8c52ff",
        display: "minimal-ui",
        icon: "src/images/rotobrokericon.png" // This path is relative to the root of the site.
      }
    },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`
      }
    },
    "gatsby-plugin-layout",
    "gatsby-plugin-offline"
  ]
};
