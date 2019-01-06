import React from "react";
import { Link } from "gatsby";
import SignOut from "../containers/SignOut";
import logo from "../images/roto-broker.png";

const Header = ({ siteTitle }) => (
  <div
    style={{
      background: "#bbb",
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
      <Link to="/">
        <img src={logo} alt={siteTitle} />
      </Link>
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
