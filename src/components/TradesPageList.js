/* eslint react/destructuring-assignment: 0 */

import React from "react";
import PropTypes from "prop-types";

import List from "@material-ui/core/List";
import IndividualPlayer from "./individualPlayer";

class TradesPageList extends React.Component {
  state = {
    options: this.props.options.slice(0, 1)
  };

  isThisMounted = false;

  componentDidMount() {
    this.isThisMounted = true;
    this.recursive();
  }

  componentWillReceiveProps() {
    this.recursive();
  }

  componentWillUnmount() {
    this.isThisMounted = false;
    clearInterval(this.timeout);
  }

  recursive = () => {
    if (this.isThisMounted) {
      this.timeout = setTimeout(() => {
        const hasMore =
          this.state.options.length + 1 < this.props.options.length;
        this.setState((prev, props) => ({
          options: props.options.slice(0, prev.options.length + 1)
        }));
        if (hasMore) this.recursive();
      }, 0);
    }
  };

  render() {
    const { ranksToCompare, handleSaveOptions } = this.props;
    const { options } = this.state;
    const listItems = options.map((option, index) => {
      const pos = ranksToCompare
        .map(comparator => comparator.name)
        .indexOf(option.name);
      let value;
      if (pos === -1) {
        value = "n/a";
      } else {
        value = pos + 1 - (index + 1);
      }
      return (
        <IndividualPlayer
          key={option.rank}
          value={value}
          option={option}
          saveOptions={handleSaveOptions}
        />
      );
    });
    return <List>{listItems}</List>;
  }
}

TradesPageList.propTypes = {
  handleSaveOptions: PropTypes.func.isRequired,
  ranksToCompare: PropTypes.arrayOf(PropTypes.string).isRequired
  //   options: PropTypes.instanceOf(PropTypes.Array).isRequired
};

export default TradesPageList;
