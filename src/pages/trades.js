import React, { Component } from "react";
// import styled from "styled-components";

import { withStyles } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import Grid from "@material-ui/core/Grid";
import LeagueSelection from "../containers/LeagueSelection";
import Layout from "../components/layout";
import { withFirebase } from "../components/FirebaseContext";
import TradesPageList from "../components/TradesPageList";

const styles = {
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

  render() {
    const { options, ranksToCompare } = this.state;
    const { classes } = this.props;
    const cachedRanks = sessionStorage.getItem("ranks");
    let ranksToCompareFromStateOrCache;
    if (cachedRanks) {
      ranksToCompareFromStateOrCache = JSON.parse(cachedRanks);
    } else {
      ranksToCompareFromStateOrCache = ranksToCompare;
    }
    return (
      <Layout gradientColor="#8c52ff">
        <Grid container>
          <Grid item xs={12}>
            <LeagueSelection setRanksToCompare={this.setRanksToCompare} />
          </Grid>
          <Grid item>
            <Grid item>
              <div className={classes.optionsHeaders}>headers</div>
            </Grid>
            <TradesPageList
              options={options}
              ranksToCompare={ranksToCompareFromStateOrCache}
              handleSaveOptions={this.handleSaveOptions}
            />
          </Grid>
        </Grid>
      </Layout>
    );
  }
}

export default withFirebase(withStyles(styles)(TradesPage));
