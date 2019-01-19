import React from "react";
import posed from "react-pose";
import styled from "styled-components";

const Bg = posed.div({
  up: {
    y: 0,
    transition: {
      default: { ease: "easeInOut", duration: 3000 }
    }
  },
  down: {
    y: "100%",
    transition: {
      default: { ease: "easeInOut", duration: 3000 }
    }
  }
});
const StyledBg = styled(Bg)`
  height: 100%;
  position: fixed;
  top: 0px;
  left: -50%;
  width: 200%;
  z-index: -1;
  background: radial-gradient(
    ellipse at bottom center,
    #8c52ff,
    rgba(0, 0, 0, 0) 50%
  );
`;
const Background = props => {
  const { upOrDown } = props;
  return <StyledBg initialPose="closed" pose={upOrDown} />;
};

export default Background;

Background.propTypes = {};
