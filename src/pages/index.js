import React from "react";

// import { PoseGroup } from "react-pose";
// import styles from "./styles.module.css";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import posed from "react-pose";
import styled from "styled-components";
import Header from "../components/header";
import Background from "../containers/Background";
import LayoutContainer from "../containers/LayoutContainer";

import { withFirebase } from "../components/FirebaseContext";
import getAllOptions from "../services/getRanks";
import InnerList from "../components/InnerList";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250
});

const ListContainer = posed.div({
  ranks: {
    opacity: 0.5,
    width: 100,

    transition: {
      default: { ease: "easeInOut", duration: 1000 }
    }
  },
  trades: {
    opacity: 1,
    width: 200,
    transition: {
      default: { ease: "easeInOut", duration: 1000 }
    }
  }
});

const StyledListContainer = styled(ListContainer)`
  color: white;
`;

class Main extends React.Component {
  state = { isVisible: true, options: [{ id: 1 }], ranksToCompare: [{}] };

  optionsRef = null;

  fullOptions = Array.from({ length: 100 }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    name: `item ${k}`
  }));

  isThisMounted = false;

  // constructor(props) {
  //   super(props);
  // const { firebase } = props;
  // const { displayName, email, photoURL, uid } = firebase.auth().currentUser;
  // this.optionsRef = firebase.database().ref(`users/${uid}/ranks`);
  // this.optionsRef.once("value", options => {
  //   if (options.val() == null) {
  //     this.writeUserData(uid, displayName, email, photoURL);
  //     this.resetRanks();
  //   } else {
  //     this.fullOptions = options.val();
  //     this.setState(prevState => ({
  //       ...prevState,
  //       options: options.val().slice(0, 1)
  //     }));
  //   }
  // });

  // }

  componentDidMount() {
    this.isThisMounted = true;
    this.recursive();
    setInterval(() => {
      console.log("changing list");
      this.setState(prevState => ({
        ...prevState,
        isVisible: !prevState.isVisible
      }));
    }, 3000);
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
        const { options } = this.state;
        const hasMore = options.length + 1 < this.fullOptions.length;
        this.setState(prevState => ({
          options: this.fullOptions.slice(0, prevState.options.length + 1)
        }));
        if (hasMore) this.recursive();
      }, 0);
    }
  };

  // handleSaveOptions = (option, isChecked) => {
  //   const newOption = option;
  //   newOption.owned = isChecked;
  //   const { options } = this.state;
  //   const newOptions = options;
  //   const pos = newOptions
  //     .map(optionFromState => optionFromState.name)
  //     .indexOf(newOption.name);
  //   newOptions[pos] = newOption;
  //   this.optionsRef.set(newOptions);
  // };

  // setRanksToCompare = leagueMateUid => {
  //   const { firebase } = this.props;

  //   firebase
  //     .database()
  //     .ref(`users/${leagueMateUid}/ranks`)
  //     .once("value", ranks => {
  //       this.setState(prevState => {
  //         sessionStorage.setItem("ranks", JSON.stringify(ranks.val()));

  //         return {
  //           ...prevState,
  //           ranksToCompare: ranks.val() || [{ name: "no ranks to compare" }]
  //         };
  //       });
  //     });
  // };

  resetRanks = () => {
    const { firebase } = this.props;
    getAllOptions(firebase).then(options => {
      this.optionsRef.set(options);
      this.setState(prevState => ({
        ...prevState,
        options
      }));
    });
  };

  writeUserData = (userId, username, email, photoURL) => {
    const { firebase } = this.props;
    firebase
      .database()
      .ref(`users`)
      .child(userId)
      .set({
        username,
        email,
        photoURL
      });
  };

  onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const { options } = this.state;
    const newOptions = reorder(
      options,
      result.source.index,
      result.destination.index
    );

    this.setState(prevState => ({
      ...prevState,
      options: newOptions
    }));
  };

  render() {
    const { isVisible, options, ranksToCompare } = this.state;
    return (
      <>
        <Header key="header" />

        <Background upOrDown={isVisible ? "up" : "down"} />

        <LayoutContainer {...this.props}>
          <button type="button" onClick={this.resetRanks}>
            Reset ranks
          </button>

          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <StyledListContainer
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  pose={isVisible ? "ranks" : "trades"}
                >
                  <InnerList
                    options={options}
                    ranksToCompare={ranksToCompare}
                  />
                  {provided.placeholder}
                </StyledListContainer>
              )}
            </Droppable>
          </DragDropContext>
        </LayoutContainer>
      </>
    );
  }
}

export default withFirebase(Main);
