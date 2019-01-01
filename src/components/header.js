import React from "react";
import { Link } from "gatsby";
import SignOut from "../containers/SignOut";

const Header = ({ siteTitle }) => (
  <div
    style={{
      background: "#ffa400",
      marginBottom: "1.45rem"
    }}
  >
    <div
      style={{
        margin: "0 auto",
        maxWidth: 960,
        padding: "1.45rem 1.0875rem"
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link to="/">{siteTitle}</Link>
      </h1>
      <Link
        to="/ranks"
        style={{
          color: "white",
          textDecoration: "none"
        }}
      >
        ranks
      </Link>{" "}
      | <Link to="/trades/">trades</Link>
      <SignOut />
    </div>
  </div>
);

export default Header;
