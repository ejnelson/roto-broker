/* eslint react/destructuring-assignment: 0 */

// ./src/components/NewPoll/index.js
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
// import { SortableContainer } from "react-sortable-hoc";
import SortableItem from "../components/SortableItem";

const OptionsContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 30px;
`;

const SortableList = SortableContainer(
  ({ options, ranksToCompare, ...props }) => (
    <OptionsContainer>
      {options.filter(Boolean).map((option, index) => (
        <SortableItem
          option={option}
          value={1}
          {...props}
          index={index}
          key={option.id}
        />
      ))}
    </OptionsContainer>
  )
);

class DraggableList extends React.Component {
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
    clearTimeout(this.timeout);
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

    return (
      <SortableList
        {...this.props}
        options={options}
        lockAxis="y"
        useDragHandle
        lockToContainerEdges
        ranksToCompare={ranksToCompare}
        saveOptions={handleSaveOptions}
      />
    );
  }
}

DraggableList.propTypes = {
  handleSaveOptions: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSortEnd: PropTypes.func.isRequired,
  ranksToCompare: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default DraggableList;
