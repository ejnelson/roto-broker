/* eslint react/destructuring-assignment: 0 */

// ./src/components/NewPoll/index.js
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import {
  SortableContainer,
  SortableElement,
  SortableHandle
} from "react-sortable-hoc";

const OptionsContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 30px;
`;

const OptionItemContainer = styled.li`
  border-bottom: 1px solid #ddd;
  padding: 10px 60px 10px 20px;
  margin: 0 0 10px;
  background-color: #f5f5f5;
  list-style: none;
  position: relative;
  min-height: 36px;
`;

const ActionItem = styled.div`
  position: absolute;
  right: ${props => (props.right ? `${props.right}px` : "10px")};
  top: 50%;
  transform: translateY(-50%);
  cursor: ${props => (props.editing ? "pointer" : "move")};
`;

const DragHandle = SortableHandle(() => <ActionItem>:::</ActionItem>);

const SortableItem = SortableElement(({ name, rank, team, position, id }) => (
  <OptionItemContainer key={id}>
    {name}, {rank}, {team}, {position}
    <DragHandle />
  </OptionItemContainer>
));

const SortableList = SortableContainer(({ options, ...props }) => (
  <OptionsContainer>
    {options.filter(Boolean).map((option, index) => (
      <SortableItem {...option} {...props} index={index} key={option.id} />
    ))}
  </OptionsContainer>
));
class DraggableList extends React.Component {
  state = {
    options: this.props.options.slice(0, 1)
  };

  componentDidMount() {
    this.recursive();
  }

  componentWillReceiveProps() {
    this.recursive();
  }

  recursive = () => {
    setTimeout(() => {
      const hasMore = this.state.options.length + 1 < this.props.options.length;
      this.setState((prev, props) => ({
        options: props.options.slice(0, prev.options.length + 1)
      }));
      if (hasMore) this.recursive();
    }, 0);
  };

  render() {
    const { options } = this.state;
    return (
      <SortableList
        {...this.props}
        options={options}
        lockAxis="y"
        useDragHandle
        lockToContainerEdges
      />
    );
  }
}

DraggableList.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSortEnd: PropTypes.func.isRequired
};

export default DraggableList;
