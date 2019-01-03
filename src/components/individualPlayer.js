import React from "react";
import PropTypes from "prop-types";
import Checkbox from "@material-ui/core/Checkbox";
import styled from "styled-components";

const IndividualPlayerContainer = styled.div`
  padding: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 5px;
  background: #fff;
  border-radius: 2px;
  margin: 1rem;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  :hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  }
`;
const PlayerNameContainer = styled.div`
  flex: 3;
`;
const PlayerValueContainer = styled.div`
  margin: 0 15px;
`;
const StyledCheckbox = styled(Checkbox)`
  /* align-self: flex-start; */
`;

class IndividualPlayer extends React.Component {
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
    const { value, option } = this.props;
    if (
      value === nextProps.value &&
      option.owned === owned &&
      nextState.owned === owned
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
    const { value, option } = this.props;
    const { owned } = this.state;
    return (
      <IndividualPlayerContainer key={option.rank}>
        <StyledCheckbox
          checked={owned || false}
          onChange={this.handleChange("owned")}
          value={option.name}
        />

        <PlayerNameContainer>{option.name}</PlayerNameContainer>

        <PlayerValueContainer item justify="flex-end">
          {value}
        </PlayerValueContainer>
      </IndividualPlayerContainer>
    );
  }
}

IndividualPlayer.propTypes = {
  //   value: PropTypes.number.isRequired,
  saveOptions: PropTypes.func.isRequired
  //   option: PropTypes.instanceOf(PropTypes.Object).isRequired
};

export default IndividualPlayer;
