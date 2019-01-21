import React from "react";
import posed from "react-pose";
import styled from "styled-components";

const Bg = posed.div({
  up: {
    y: 0,
    transition: {
      default: { ease: "easeInOut", duration: 2000 }
    }
  },
  down: {
    y: "100%",
    transition: {
      default: { ease: "easeInOut", duration: 2000 }
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
    ${props => props.color || "palevioletred"},
    rgba(0, 0, 0, 0) 50%
  );
`;
const Background = props => {
  const { ranksOrTrades, forRanksOrTrades, color } = props;
  return (
    <StyledBg
      initialPose={ranksOrTrades === forRanksOrTrades ? "up" : "down"}
      pose={ranksOrTrades === forRanksOrTrades ? "up" : "down"}
      color={color}
    />
  );
};

export default Background;

Background.propTypes = {};
