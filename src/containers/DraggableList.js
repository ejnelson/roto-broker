// ./src/components/NewPoll/index.js
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
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

const SortableItem = SortableElement(
  ({ name, rank, team, position, id, onToggleEdit, onKeyDown, editing }) => (
    <OptionItemContainer
      key={id}
      onDoubleClick={() => !editing && onToggleEdit(id)}
      onBlur={() => onToggleEdit(id)}
    >
      {name + " , " + rank + " , " + team + " , " + position}
      {/* <ActionItem
        editing
        onClick={() => onDelete(id)}
        right={40}
        title="Delete"
      >
        x
      </ActionItem> */}
      <DragHandle />
    </OptionItemContainer>
  )
);

const SortableList = SortableContainer(({ options, ...props }) => {
  return (
    <OptionsContainer>
      {options.filter(Boolean).map((option, index) => {
        return (
          <SortableItem {...option} {...props} index={index} key={option.id} />
        );
      })}
    </OptionsContainer>
  );
});

const DraggableList = props => (
  <SortableList {...props} lockAxis="y" useDragHandle lockToContainerEdges />
);

DraggableList.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  onToggleEdit: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  onSortEnd: PropTypes.func.isRequired,
};

export default DraggableList;
