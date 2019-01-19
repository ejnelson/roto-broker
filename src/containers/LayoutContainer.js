import PropTypes from "prop-types";
import React from "react";
import posed from "react-pose";
import styled from "styled-components";

const Layout = posed.div({
  enter: {},
  exit: {}
});

const StyledLayout = styled(Layout)`
  margin: 0 auto;
  max-width: 960px;
  padding: 0px 1.0875rem 1.45rem;
`;

const LayoutContainer = ({ children, ...props }) => (
  <StyledLayout {...props}>{children}</StyledLayout>
);

export default LayoutContainer;

LayoutContainer.propTypes = {
  children: PropTypes.node.isRequired
};
