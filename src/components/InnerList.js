import React from "react";
import { Draggable } from "react-beautiful-dnd";
import PlayerContainer from "../containers/PlayerContainer";

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

class InnerList extends React.Component {
  // state = { ranksOrTrades: "ranks" };

  // do not re-render if the students list has not changed
  shouldComponentUpdate(nextProps) {
    const { options, ranksToCompare, isRanks } = this.props;
    if (
      options === nextProps.options &&
      ranksToCompare === nextProps.ranksToCompare &&
      isRanks === nextProps.isRanks
    ) {
      return false;
    }
    return true;
  }

  render() {
    const { options, ranksToCompare, handleSaveOptions, isRanks } = this.props;
    if (options.length > 0) {
      return options.map((option, index) => {
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
          <Draggable
            key={option.id}
            draggableId={option.id}
            index={index}
            isDragDisabled={isRanks}
          >
            {(provided, snapshot) => (
              <PlayerContainer
                iRef={provided.innerRef}
                dProps={provided.draggableProps}
                dHProps={provided.dragHandleProps}
                style={getItemStyle(
                  snapshot.isDragging,
                  provided.draggableProps.style
                )}
                option={option}
                compareValue={value}
                saveOptions={handleSaveOptions}
              />
            )}
          </Draggable>
        );
      });
    }
    return <div>loading</div>;
  }
}

export default InnerList;
