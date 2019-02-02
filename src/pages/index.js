import React from "react";

// import { PoseGroup } from "react-pose";
// import styles from "./styles.module.css";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import posed from "react-pose";
import styled from "styled-components";
import { withStyles } from "@material-ui/core/styles";

import CircularProgress from "@material-ui/core/CircularProgress";
import Header from "../components/header";
import Background from "../containers/Background";
import LayoutContainer from "../containers/LayoutContainer";
import LeagueSelection from "../containers/LeagueSelection";

import { withFirebase } from "../components/FirebaseContext";
import getAllOptions from "../services/getRanks";
import InnerList from "../containers/InnerList";
import StatSelector from "../containers/StatSelector";
import availableStats from "../services/availableStats";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  progress: {
    margin: theme.spacing.unit * 2,
    color: "#8c52ff"
  }
});

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
      width: { ease: "easeInOut", duration: 200 }
    }
  },
  trades: {
    width: 400,
    transition: {
      width: { ease: "easeInOut", duration: 200 }
    }
  }
});

const StyledListContainer = styled(ListContainer)`
  color: white;
  overflow: auto;
`;
// ---------------------------------------BEGIN COMPONENT -----------------------------------//
// ---------------------------------------BEGIN COMPONENT -----------------------------------//
class Main extends React.Component {
  state = {
    ranksOrTrades: "ranks",
    options: [{ id: 1 }],
    ranksToCompare: [{}],
    loading: false,
    statsArray: availableStats
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
    this.setState(prevState => ({
      ...prevState,
      loading: true
    }));
    getAllOptions(firebase).then(options => {
      this.optionsRef.set(options);
      this.setState(prevState => ({
        ...prevState,
        loading: false,
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

  newStatsArray = (items, index, stat) => [
    ...items.slice(0, index),
    {
      prettyName: stat.prettyName,
      databaseName: stat.databaseName,
      inStats: stat.inStats,
      isActive: !stat.isActive
    },
    ...items.slice(index + 1, items.length)
  ];

  handleUpdateDisplayedStats = stat => {
    const { statsArray } = this.state;
    const index = statsArray.indexOf(stat);
    const newArray = this.newStatsArray(statsArray, index, stat);
    console.log(`found the index${index}`);
    this.setState(prevState => ({
      ...prevState,
      statsArray: newArray
    }));
  };

  render() {
    const {
      ranksOrTrades,
      options,
      ranksToCompare,
      loading,
      statsArray
    } = this.state;
    const { classes } = this.props;
    return (
      <>
        {loading && <CircularProgress className={classes.progress} />}
        <Header changeRanksOrTrades={this.handleChangeRanksOrTrades} />
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
        ) : (
          <StatSelector
            availableStats={statsArray}
            updateDisplayedStats={this.handleUpdateDisplayedStats}
          />
        )}
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
                    statsArray={statsArray}
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

export default withFirebase(withStyles(styles)(Main));

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
