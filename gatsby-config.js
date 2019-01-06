const path = require(`path`);

module.exports = {
  siteMetadata: {
    title: "Roto-Broker"
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-styled-components",
    "gatsby-plugin-flow",
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
        name: "roto-broker",
        short_name: "rb",
        start_url: "/",
        background_color: "#ffb200",
        theme_color: "#663399",
        display: "minimal-ui",
        icon: "src/images/rotobrokericon.png" // This path is relative to the root of the site.
      }
    },
    "gatsby-plugin-layout"
    // 'gatsby-plugin-offline',
  ]
};
