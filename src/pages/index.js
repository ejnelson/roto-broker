import React, { Component } from "react";
import { Link } from "gatsby";
// import styled from "styled-components";
import { arrayMove } from "react-sortable-hoc";

import { withFirebase } from "../components/FirebaseContext";
import Layout from "../components/layout";
import SignOut from "../containers/SignOut";
import DraggableList from "../containers/DraggableList";
import getAllOptions from "../services/getRanks";

class IndexPage extends Component {
  state = {
    options: []
  };

  // to keep track of what item is being edited
  editing = null;

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      options: [
        {
          text: "option1",
          id: "123avcs232",
          rank: 1,
          position: "RB",
          team: "LAR",
          editing: false
        }
      ]
    };
  }

  componentDidMount() {
    const { firebase } = this.props;
    getAllOptions(firebase).then(options =>
      this.setState({
        options
      })
    );
  }

  handleKeydown = e => {
    if (e.which === 27) this.handleToggleEdit(this.editing);
    if (e.which === 13) this.handleAddItem();
  };

  handleToggleEdit = id => {
    this.setState(prevState => {
      const options = prevState.options
        .filter(({ name }) => name)
        .map(option => {
          if (option.id === id) {
            if (!option.editing) {
              this.editing = id;
            } else {
              this.editing = null;
            }

            return {
              ...option,
              editing: !option.editing
            };
          }

          return {
            ...option,
            editing: false
          };
        });

      return {
        ...prevState,
        options
      };
    });
  };

  // handleSortEnd = ({ oldIndex, newIndex }) => {
  //   this.setState({
  //     ...this.state,
  //     options: arrayMove(this.state.options, oldIndex, newIndex)
  //   });
  // };
  handleSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(prevState => ({
      ...prevState,
      options: arrayMove(prevState.options, oldIndex, newIndex)
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
          onToggleEdit={this.handleToggleEdit}
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
