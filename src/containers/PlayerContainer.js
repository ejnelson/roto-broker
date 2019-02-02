import React from "react";
import posed from "react-pose";
import styled from "styled-components";
import Checkbox from "@material-ui/core/Checkbox";
import { rhythm } from "../utils/typography";
import PlayerStat from "../components/PlayerStat";

const Player = posed.div({
  ranks: {
    opacity: 1,
    scaleY: 1,

    transition: {
      opacity: { ease: "easeInOut", duration: 100 }
    }
  },
  trades: {
    opacity: 0.6,
    scaleY: 1,
    transition: {
      opacity: { ease: "easeInOut", duration: 100 }
    }
  }
});

const StyledPlayer = styled(Player)`
  height: ${rhythm(2)};
  display: flex;
`;
const StyledCheckbox = styled(Checkbox)`
  /* align-self: flex-start; */
`;
// const ColumnSlot = styled.div`
//   flex: 1;
// `;
const NameColumnSlot = styled.div`
  flex: 3;
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
    const { compareValue, option, dProps, statsArray } = this.props;
    if (
      compareValue === nextProps.compareValue &&
      option.owned === owned &&
      nextState.owned === owned &&
      dProps === nextProps.dProps &&
      JSON.stringify(statsArray) === JSON.stringify(nextProps.statsArray)
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
      // compareValue,
      statsArray
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
        <NameColumnSlot>{option.name}</NameColumnSlot>
        {statsArray
          // .filter(stat => stat.isActive)
          .map(stat => (
            <PlayerStat option={option} stat={stat} key={stat.databaseName} />
          ))}
      </StyledPlayer>
    );
  }
}

export default PlayerContainer;

PlayerContainer.propTypes = {};
