import React from "react";

// import { PoseGroup } from "react-pose";
// import styles from "./styles.module.css";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import posed from "react-pose";
import styled from "styled-components";
import Header from "../components/header";
import Background from "../containers/Background";
import LayoutContainer from "../containers/LayoutContainer";
import LeagueSelection from "../containers/LeagueSelection";

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
  overflow: "auto",
  width: 250
});

const ListContainer = posed.div({
  ranks: {
    width: 1000,

    transition: {
      default: { ease: "easeInOut", duration: 200 }
    }
  },
  trades: {
    width: 400,
    transition: {
      default: { ease: "easeInOut", duration: 200 }
    }
  }
});

const StyledListContainer = styled(ListContainer)`
  color: white;
`;

class Main extends React.Component {
  state = {
    ranksOrTrades: "ranks",
    options: [{ id: 1 }],
    ranksToCompare: [{}]
  };

  optionsRef = null;

  constructor(props) {
    super(props);
    const { firebase } = props;
    const { displayName, email, photoURL, uid } = firebase.auth().currentUser;
    this.optionsRef = firebase.database().ref(`users/${uid}/ranks`);
    this.optionsRef.once("value", options => {
      if (options.val() == null) {
        this.writeUserData(uid, displayName, email, photoURL);
        this.resetRanks();
      } else {
        this.setState(prevState => ({
          ...prevState,
          options: options.val()
        }));
      }
    });
  }

  handleSaveOptions = (option, isChecked) => {
    const newOption = option;
    newOption.owned = isChecked;
    const { options } = this.state;
    const newOptions = options;
    const pos = newOptions
      .map(optionFromState => optionFromState.name)
      .indexOf(newOption.name);
    newOptions[pos] = newOption;
    this.optionsRef.set(newOptions);
  };

  setRanksToCompare = leagueMateUid => {
    const { firebase } = this.props;

    firebase
      .database()
      .ref(`users/${leagueMateUid}/ranks`)
      .once("value", ranks => {
        this.setState(prevState => {
          sessionStorage.setItem("ranks", JSON.stringify(ranks.val()));

          return {
            ...prevState,
            ranksToCompare: ranks.val() || [{ name: "no ranks to compare" }]
          };
        });
      });
  };

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
    this.optionsRef.set(newOptions);

    this.setState(prevState => ({
      ...prevState,
      options: newOptions
    }));
  };

  handleChangeRanksOrTrades = ranksOrTrades => {
    this.setState(prevState => ({
      ...prevState,
      ranksOrTrades
    }));
  };

  render() {
    const { ranksOrTrades, options, ranksToCompare } = this.state;
    return (
      <>
        <Header
          key="header"
          changeRanksOrTrades={this.handleChangeRanksOrTrades}
        />

        <Background
          forRanksOrTrades="trades"
          color="#8c52ff"
          ranksOrTrades={ranksOrTrades}
        />
        <Background
          forRanksOrTrades="ranks"
          color="black"
          ranksOrTrades={ranksOrTrades}
        />
        {ranksOrTrades === "trades" ? (
          <LeagueSelection setRanksToCompare={this.setRanksToCompare} />
        ) : null}

        <LayoutContainer {...this.props}>
          <button type="button" onClick={this.resetRanks}>
            Reset ranks
          </button>

          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable
              droppableId="droppable"
              isDropDisabled={ranksOrTrades === "trades"}
            >
              {(provided, snapshot) => (
                <StyledListContainer
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  pose={ranksOrTrades}
                  initialPose="ranks"
                >
                  <InnerList
                    options={options}
                    ranksToCompare={ranksToCompare}
                    handleSaveOptions={this.handleSaveOptions}
                    ranksOrTrades={ranksOrTrades}
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

// code to use if i need to optimize performance in future,
// led to bugs with droppable expanding while trying to drag

// fullOptions = [];

// isThisMounted = false;

// constructor(props) {
//   super(props);
//   const { firebase } = props;
//   const { displayName, email, photoURL, uid } = firebase.auth().currentUser;
//   this.optionsRef = firebase.database().ref(`users/${uid}/ranks`);
//   this.optionsRef.once("value", options => {
//     if (options.val() == null) {
//       this.writeUserData(uid, displayName, email, photoURL);
//       this.resetRanks();
//     } else {
//       this.fullOptions = options.val();
//       this.setState(prevState => ({
//         ...prevState,
//         options: options.val().slice(0, 1)
//       }));
//       this.recursive();
//     }
//   });
// }

// componentDidMount() {
//   this.isThisMounted = true;
//   this.recursive();
// }

// componentWillReceiveProps() {
//   this.recursive();
// }

// componentWillUnmount() {
//   this.isThisMounted = false;
//   clearInterval(this.timeout);
// }

// recursive = () => {
//   if (this.isThisMounted) {
//     this.timeout = setTimeout(() => {
//       const { options } = this.state;
//       const hasMore = options.length + 1 < this.fullOptions.length;

//       this.setState(prevState => ({
//         options: this.fullOptions.slice(0, prevState.options.length + 1)
//       }));
//       if (hasMore) this.recursive();
//     }, 0);
//   }
// };
