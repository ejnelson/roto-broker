import React from "react";
import styled from "styled-components";
import SelectableStat from "../components/SelectableStat";

const StatPickerDiv = styled.div`
  flex: 1;
  display: flex;
`;

class StatSelector extends React.Component {
  render() {
    const { updateDisplayedStats, availableStats } = this.props;
    return (
      <StatPickerDiv>
        {availableStats.map(stat => (
          <SelectableStat
            key={stat.databaseName}
            updateDisplayedStats={updateDisplayedStats}
            stat={stat}
          />
        ))}
      </StatPickerDiv>
    );
  }
}

export default StatSelector;

StatSelector.propTypes = {};
