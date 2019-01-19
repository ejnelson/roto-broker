import React from "react";
import posed from "react-pose";
import styled from "styled-components";

const Player = posed.div({
  ranks: {
    opacity: 0.5,
    scaleY: 1,

    transition: {
      default: { ease: "easeInOut", duration: 100 }
    }
  },
  trades: {
    opacity: 1,
    scaleY: 1,
    transition: {
      default: { ease: "easeInOut", duration: 100 }
    }
  }
});

const StyledPlayer = styled(Player)`
  background-color: blue;

  left: -50%;
`;

const PlayerContainer = props => {
  const { option, iRef, dProps, dHProps, style, ranksOrTrades } = props;
  return (
    <StyledPlayer
      {...dProps}
      {...dHProps}
      ref={iRef}
      style={style}
      pose={ranksOrTrades}
    >
      {option.name}
    </StyledPlayer>
  );
};

export default PlayerContainer;

PlayerContainer.propTypes = {};
