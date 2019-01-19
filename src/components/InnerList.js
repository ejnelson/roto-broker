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

  // componentDidMount() {
  //   setInterval(() => {
  //     console.log("changing");
  //     this.setState(prevState => ({
  //       ...prevState,
  //       ranksOrTrades: prevState.ranksOrTrades === "ranks" ? "trades" : "ranks"
  //     }));
  //   }, 3000);
  // }

  // do not re-render if the students list has not changed
  shouldComponentUpdate(nextProps) {
    const { options } = this.props;
    // const { ranksOrTrades } = this.state;
    if (
      options === nextProps.options
      // ranksOrTrades === nextState.ranksOrTrades
    ) {
      return false;
    }
    return true;
  }

  render() {
    const { options } = this.props;
    if (options.length > 0) {
      return options.map((option, index) => (
        <Draggable key={option.id} draggableId={option.id} index={index}>
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
            />
          )}
        </Draggable>
      ));
    }
    return <div>loading</div>;
  }
}

export default InnerList;
