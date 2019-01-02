import React from "react";
import PropTypes from "prop-types";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";

class SimpleDialog extends React.Component {
  state = {
    owned: false
  };

  //   handleChange = event => {
  //     console.log(event);
  //     this.setState(prevState =>
  //   const newOptions = prevState.options;
  //   const pos = newOptions
  //     .map(optionFromState => optionFromState.name)
  //     .indexOf(option.name);
  //   newOptions[pos] = newOption;
  //   this.userOptionsRef.set(newOptions);
  //       ({ ...prevState, owned: event.target.checked })
  //     );
  //   };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.option.owned !== prevState.owned) {
      return { owned: nextProps.option.owned };
    }
    return null;
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
    console.log("placeholder");
    return (
      <ListItem key={option.rank}>
        <ListItemText primary={option.name} />
        <ListItemText primary={value} />

        <Checkbox
          checked={owned || false}
          onChange={this.handleChange("owned")}
          value={option.name}
        />
      </ListItem>
    );
  }
}

SimpleDialog.propTypes = {
  //   value: PropTypes.number.isRequired,
  saveOptions: PropTypes.func.isRequired
  //   option: PropTypes.instanceOf(PropTypes.Object).isRequired
};

export default SimpleDialog;
