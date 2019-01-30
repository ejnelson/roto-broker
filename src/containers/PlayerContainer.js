import React from "react";
import posed from "react-pose";
import styled from "styled-components";
import Checkbox from "@material-ui/core/Checkbox";
import { ScrollSyncPane, ScrollSync } from "react-scroll-sync";
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
  height: ${rhythm(4)};
`;
const StyledCheckbox = styled(Checkbox)`
  /* align-self: flex-start; */
`;
const ColumnSlot = styled.div`
  width: 550px;
  display: flex;
`;
const StatsContainer = styled.div`
  display: flex;
  height: ${rhythm(2)};
`;
const scrollStyle = {
  display: "flex",
  color: "purple",
  overflow: "auto"
};
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
        <ColumnSlot>{option.name}</ColumnSlot>
        <ScrollSyncPane>
          <div style={{ overflow: "auto" }}>
            <div
              style={{
                display: "flex",
                minWidth: "min-content",
                height: "80px"
              }}
            >
              <ColumnSlot>{option.rank}</ColumnSlot>
              <ColumnSlot>{option.position}</ColumnSlot>
              <ColumnSlot>{option.team}</ColumnSlot>
              <ColumnSlot>{option.projectedPoints}</ColumnSlot>
              <ColumnSlot>{option.auctionValue}</ColumnSlot>
              <ColumnSlot>{option.averageDraftPosition}</ColumnSlot>
              <ColumnSlot>{compareValue}</ColumnSlot>
              {/* <ColumnSlot>{option.stats.RushingAttempts || 0}</ColumnSlot>
              <ColumnSlot>{option.stats.RushingYards || 0}</ColumnSlot>
              <ColumnSlot>{option.stats.RushingTouchdowns || 0}</ColumnSlot>
              <ColumnSlot>
                {option.stats.RushingYardsPerAttempt || 0}
              </ColumnSlot>
              <ColumnSlot>{option.stats.Receptions || 0}</ColumnSlot>
              <ColumnSlot>{option.stats.ReceivingYards || 0}</ColumnSlot>
              <ColumnSlot>{option.stats.ReceivingTouchdowns || 0}</ColumnSlot>
              <ColumnSlot>
                {option.stats.ReceivingYardsPerReception || 0}
              </ColumnSlot> */}
            </div>
          </div>
        </ScrollSyncPane>
      </StyledPlayer>
    );
  }
}

export default PlayerContainer;

PlayerContainer.propTypes = {};
