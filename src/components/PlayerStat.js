/* eslint no-nested-ternary: 0 */

import React from "react";
import styled from "styled-components";
// import Checkbox from "@material-ui/core/Checkbox";

const ColumnSlot = styled.div`
  flex: 1;
`;
class PlayerStat extends React.Component {
  //   static getDerivedStateFromProps(nextProps, prevState) {
  //     if (nextProps.stat.isActive !== prevState.isActive) {
  //       return { checked: nextProps.stat.isActive };
  //     }
  //     return null;
  //   }

  shouldComponentUpdate(nextProps, nextState) {
    const { stat } = this.props;
    if (stat.isActive === nextProps.stat.isActive) {
      return false;
    }
    return true;
  }

  handleChange = name => event => {
    const isChecked = event.target.checked;
    const { updateDisplayedStats, stat } = this.props;
    this.setState({ [name]: isChecked });
    updateDisplayedStats(stat);
  };

  render() {
    const { stat, option } = this.props;
    return (
      <ColumnSlot style={{ display: !stat.isActive ? "none" : "flex" }}>
        {stat.inStats
          ? option.stats
            ? option.stats[stat.databaseName]
            : "0"
          : option[stat.databaseName]}
      </ColumnSlot>
    );
  }
}

export default PlayerStat;

PlayerStat.propTypes = {};
