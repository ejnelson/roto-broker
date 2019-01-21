import React from "react";
import posed from "react-pose";
import styled from "styled-components";
import Checkbox from "@material-ui/core/Checkbox";
import { rhythm } from "../utils/typography";

const Player = posed.div({
  ranks: {
    opacity: 1,
    scaleY: 1,

    transition: {
      default: { ease: "easeInOut", duration: 100 }
    }
  },
  trades: {
    opacity: 0.6,
    scaleY: 1,
    transition: {
      default: { ease: "easeInOut", duration: 100 }
    }
  }
});

const StyledPlayer = styled(Player)`
  height: ${rhythm(2)};
`;
const StyledCheckbox = styled(Checkbox)`
  /* align-self: flex-start; */
`;

class PlayerContainer extends React.Component {
  state = {
    owned: false
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.option.owned !== prevState.owned) {
      return { owned: nextProps.option.owned };
    }
    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { owned } = this.state;
    const { compareValue, option, dProps } = this.props;
    if (
      compareValue === nextProps.compareValue &&
      option.owned === owned &&
      nextState.owned === owned &&
      dProps === nextProps.dProps
    ) {
      return false;
    }
    return true;
  }

  handleChange = name => event => {
    const isChecked = event.target.checked;
    const { saveOptions, option } = this.props;
    this.setState({ [name]: isChecked });
    saveOptions(option, isChecked);
  };

  render() {
    const { owned } = this.state;
    const {
      option,
      iRef,
      dProps,
      dHProps,
      style,
      ranksOrTrades,
      compareValue
    } = this.props;
    return (
      <StyledPlayer {...dProps} {...dHProps} ref={iRef} style={style}>
        {ranksOrTrades === "trades" ? (
          <StyledCheckbox
            checked={owned || false}
            onChange={this.handleChange("owned")}
            value={option.name}
          />
        ) : null}
        {option.name}, {option.rank}, {option.position}, {compareValue}
      </StyledPlayer>
    );
  }
}

export default PlayerContainer;

PlayerContainer.propTypes = {};
