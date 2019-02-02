import React from "react";
import styled from "styled-components";
import Checkbox from "@material-ui/core/Checkbox";

const StyledCheckbox = styled(Checkbox)`
  /* align-self: flex-start; */
`;

class SelectableStat extends React.Component {
  state = {
    checked: true
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.stat.isActive !== prevState.isActive) {
      return { checked: nextProps.stat.isActive };
    }
    return null;
  }

  //   shouldComponentUpdate(nextProps, nextState) {
  //     const { owned } = this.state;
  //     const { compareValue, option, dProps, statsArray } = this.props;
  //     console.log(`old stats${statsArray}`);
  //     console.log(`new stats${nextProps.statsArray}`);
  //     if (
  //       compareValue === nextProps.compareValue &&
  //       option.owned === owned &&
  //       nextState.owned === owned &&
  //       dProps === nextProps.dProps &&
  //       JSON.stringify(statsArray) === JSON.stringify(nextProps.statsArray)
  //     ) {
  //       return false;
  //     }
  //     return true;
  //   }

  handleChange = name => event => {
    const isChecked = event.target.checked;
    const { updateDisplayedStats, stat } = this.props;
    this.setState({ [name]: isChecked });
    updateDisplayedStats(stat);
  };

  render() {
    const { checked } = this.state;
    const { stat } = this.props;
    return (
      <div>
        {stat.prettyName}
        <StyledCheckbox
          checked={checked}
          onChange={this.handleChange("checked")}
          value={stat.databaseName}
        />
      </div>
    );
  }
}

export default SelectableStat;

SelectableStat.propTypes = {};
