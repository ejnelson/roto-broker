import React, { Component } from "react";
// import styled from "styled-components";
// import { arrayMove } from "react-sortable-hoc";

import { withFirebase } from "../components/FirebaseContext";
import Layout from "../components/layout";
import DraggableList from "../containers/DraggableList";
import getAllOptions from "../services/getRanks";

class RanksPage extends Component {
  state = {
    options: []
  };

  optionsRef = null;

  constructor(props) {
    super(props);
    this.state = { options: [{ id: 1 }] };
    this.resetRanks = this.resetRanks.bind(this);
    this.writeUserData = this.writeUserData.bind(this);
    const { firebase } = props;
    const { displayName, email, photoURL, uid } = firebase.auth().currentUser;
    this.optionsRef = firebase.database().ref(`users/${uid}/ranks`);
    this.optionsRef.once("value", options => {
      if (options.val() == null) {
        this.writeUserData(uid, displayName, email, photoURL);
        this.resetRanks();
      } else {
        this.setState({
          options: options.val()
        });
      }
    });
  }

  handleSortEnd = ({ oldIndex, newIndex }) => {
    const { options } = this.state;
    const newOrder = arrayMove(options, oldIndex, newIndex);
    this.optionsRef.set(newOrder);
    this.setState(prevState => ({
      ...prevState,
      options: newOrder
    }));
  };

  writeUserData(userId, username, email, photoURL) {
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
  }

  resetRanks() {
    const { firebase } = this.props;
    getAllOptions(firebase).then(options => {
      this.optionsRef.set(options);
      this.setState(prevState => ({
        ...prevState,
        options
      }));
    });
  }

  render() {
    const { options } = this.state;

    return (
      <Layout>
        <h1>Hi people</h1>
        <p>Make some rankings!!!</p>

        <button type="button" onClick={this.resetRanks}>
          Reset ranks
        </button>
        <DraggableList options={options} onSortEnd={this.handleSortEnd} />
      </Layout>
    );
  }
}

export default withFirebase(RanksPage);
