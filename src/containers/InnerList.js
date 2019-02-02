import React from "react";
import { Draggable } from "react-beautiful-dnd";
import PlayerContainer from "./PlayerContainer";

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
  // do not re-render if the list has not changed
  shouldComponentUpdate(nextProps) {
    const { options, ranksToCompare, ranksOrTrades, statsArray } = this.props;

    if (
      options === nextProps.options &&
      ranksToCompare === nextProps.ranksToCompare &&
      ranksOrTrades === nextProps.ranksOrTrades &&
      JSON.stringify(statsArray) === JSON.stringify(nextProps.statsArray)
    ) {
      return false;
    }
    return true;
  }

  render() {
    const {
      options,
      ranksToCompare,
      handleSaveOptions,
      ranksOrTrades,
      statsArray
    } = this.props;
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
            isDragDisabled={ranksOrTrades === "trades"}
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
                ranksOrTrades={ranksOrTrades}
                statsArray={statsArray}
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
