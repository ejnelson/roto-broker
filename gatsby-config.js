module.exports = {
  siteMetadata: {
    title: "Roto-Broker",
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-styled-components",
    "gatsby-plugin-flow",
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "roto-broker",
        short_name: "starter",
        start_url: "/",
        background_color: "#ffb200",
        theme_color: "#663399",
        display: "minimal-ui",
        icon: "src/images/gatsby-icon.png", // This path is relative to the root of the site.
      },
    },
    "gatsby-plugin-layout",
    // 'gatsby-plugin-offline',
  ],
};
