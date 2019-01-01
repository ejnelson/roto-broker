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

  setRanksToCompare = leagueMate => {
    const { firebase } = this.props;

    firebase
      .database()
      .ref(`users/${leagueMate}/ranks`)
      .once("value", ranks => {
        this.setState(prevState => ({
          ...prevState,
          ranksToCompare: ranks.val() || [{ name: "no ranks to compare" }]
        }));
      });
  };

  render() {
    const { options } = this.state;
    const listItems = options.map(option => (
      <li key={option.name}>{option.name}</li>
    ));
    return (
      <Layout>
        <LeagueSelection setRanksToCompare={this.setRanksToCompare} />
        <ul>{listItems}</ul>
      </Layout>
    );
  }
}

export default withFirebase(TradesPage);
