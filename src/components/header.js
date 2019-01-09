import React from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import SignOut from "../containers/SignOut";
import logo from "../images/roto-broker.png";

const Logo = styled.img`
  height: 2.5rem;
`;
const HeaderBar = styled.div`
  background: #bbb;
  margin-bottom: 1.45rem;
  padding: 1rem;
`;

const Header = ({ siteTitle }) => (
  <HeaderBar>
    <Link to="/">
      <Logo src={logo} alt={siteTitle} />
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
  </HeaderBar>
);

export default Header;
