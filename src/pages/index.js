import React, { Component } from "react";
import { Link } from "gatsby";
// import styled from "styled-components";
import { arrayMove } from "react-sortable-hoc";

import { withFirebase } from "../components/FirebaseContext";
import Layout from "../components/layout";
import SignOut from "../containers/SignOut";
import DraggableList from "../containers/DraggableList";
// import getAllOptions from "../services/getRanks";

class IndexPage extends Component {
  state = {
    options: []
  };

  optionsRef = null;

  // to keep track of what item is being edited
  editing = null;

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    const { firebase } = props;
    const { uid } = firebase.auth().currentUser;
    this.optionsRef = firebase.database().ref(`users/${uid}/ranks`);

    this.optionsRef.once("value", options => {
      console.log(options.val());
      this.setState({
        options: options.val()
      });
    });
  }

  componentWillUnmount() {
    const { firebase } = this.props;
    firebase.removeBinding(this.optionsRef);
  }

  handleKeydown = e => {
    if (e.which === 27) this.handleToggleEdit(this.editing);
    if (e.which === 13) this.handleAddItem();
  };

  handleSortEnd = ({ oldIndex, newIndex }) => {
    const { options } = this.state;
    const newOrder = arrayMove(options, oldIndex, newIndex);
    this.optionsRef.set(newOrder);
    this.setState(prevState => ({
      ...prevState,
      options: newOrder
    }));
  };

  writeUserData(userId, name, email, imageUrl, ranks) {
    const { firebase } = this.props;
    firebase
      .database()
      .ref(`users/${userId}`)
      .set({
        username: name,
        email,
        profile_picture: imageUrl,
        ranks
      });
  }

  handleClick() {
    const { firebase } = this.props;
    const { options } = this.state;
    const {
      displayName,
      email,
      photoUrl,
      emailVerified,
      uid
    } = firebase.auth().currentUser;

    console.log(displayName + email + photoUrl + uid + emailVerified);
    this.writeUserData(uid, displayName, email, photoUrl, options);
  }

  render() {
    const { options } = this.state;

    return (
      <Layout>
        <h1>Hi people</h1>
        <p>Make some rankings!!!</p>

        <DraggableList
          options={options}
          onKeyDown={this.handleKeydown}
          onSortEnd={this.handleSortEnd}
        />
        <Link to="/page-2/">Go to page 2</Link>
        <button type="button" onClick={this.handleClick}>
          CLICK HERE
        </button>

        <SignOut />
      </Layout>
    );
  }
}

export default withFirebase(IndexPage);
