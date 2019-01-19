import PropTypes from "prop-types";
import styled from "styled-components";
import React from "react";

import Header from "./header";
import "./layout.css";

const Background = styled.div`
  background: white;
  background: linear-gradient(
    to top,
    ${props => props.gradientColor || "black"} -5%,
    rgba(255, 255, 255, 0) 65%
  );
  background-attachment: fixed;
`;
const Container = styled.div`
  margin: 0 auto;
  max-width: 960px;
  padding: 0px 1.0875rem 1.45rem;
`;

const Layout = ({ children, gradientColor }) => (
  <>
    <Header />
    <Background gradientColor={gradientColor}>
      <Container>{children}</Container>
    </Background>
  </>
);

export default Layout;

Layout.propTypes = {
  children: PropTypes.node.isRequired
};
