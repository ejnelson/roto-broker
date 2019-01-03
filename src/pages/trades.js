import React, { Component } from "react";
// import styled from "styled-components";

import List from "@material-ui/core/List";
import { withStyles } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import Grid from "@material-ui/core/Grid";
import LeagueSelection from "../containers/LeagueSelection";
import Layout from "../components/layout";
import { withFirebase } from "../components/FirebaseContext";
import IndividualPlayer from "../components/individualPlayer";

const styles = {
  optionsList: {
    // backgroundColor: blue[100],
    color: blue[600]
  },
  optionsHeaders: {
    backgroundColor: blue[300],
    color: blue[800]
  }
};
class TradesPage extends Component {
  state = {
    options: [],
    ranksToCompare: []
  };

  userOptionsRef = null;

  componentDidMount() {
    const { firebase } = this.props;
    const { uid } = firebase.auth().currentUser;
    this.userOptionsRef = firebase.database().ref(`users/${uid}/ranks`);
    this.userOptionsRef.once("value", options => {
      this.setState(prevState => ({
        ...prevState,
        options: options.val() || [{ name: "go set your ranks" }]
      }));
    });
  }

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

  handleSaveOptions = (option, isChecked) => {
    const newOption = option;
    newOption.owned = isChecked;
    const { options } = this.state;
    const newOptions = options;
    const pos = newOptions
      .map(optionFromState => optionFromState.name)
      .indexOf(newOption.name);
    newOptions[pos] = newOption;
    this.userOptionsRef.set(newOptions);
  };

  render() {
    const { options, ranksToCompare } = this.state;
    const { classes } = this.props;
    const cachedRanks = sessionStorage.getItem("ranks");
    let ranksFromStateOrCache;
    if (cachedRanks) {
      ranksFromStateOrCache = JSON.parse(cachedRanks);
    } else {
      ranksFromStateOrCache = ranksToCompare;
    }

    const listItems = options.map((option, index) => {
      const pos = ranksFromStateOrCache
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
          saveOptions={this.handleSaveOptions}
        />
      );
    });
    return (
      <Layout>
        <Grid container>
          <Grid item>
            <LeagueSelection setRanksToCompare={this.setRanksToCompare} />
          </Grid>
          <Grid item>
            <Grid item>
              <List className={classes.optionsHeaders}>headers</List>
            </Grid>
            <List className={classes.optionsList}>{listItems}</List>
          </Grid>
        </Grid>
      </Layout>
    );
  }
}

export default withFirebase(withStyles(styles)(TradesPage));
