import React, { Component } from "react";
// import styled from "styled-components";

import { withFirebase } from "../components/FirebaseContext";
import Layout from "../components/layout";
import LeagueSelection from "../containers/LeagueSelection";

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

  render() {
    const { options, ranksToCompare } = this.state;
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
        <li key={option.rank}>
          {option.name} value: {value}
        </li>
      );
    });
    return (
      <Layout>
        <LeagueSelection setRanksToCompare={this.setRanksToCompare} />
        <ul>{listItems}</ul>
      </Layout>
    );
  }
}

export default withFirebase(TradesPage);
