import React, { Component } from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import { arrayMove } from "react-sortable-hoc";
import shortId from "short-id";

import { withFirebase } from "../components/FirebaseContext";
import Layout from "../components/layout.js";
import FetchingExample from "../containers/FetchingExample";
import SignOut from "../containers/SignOut";
import DraggableList from "../containers/DraggableList";
import getAllRanks from "../services/getRanks";

const CreateButton = styled.button`
  background-image: linear-gradient(19deg, #21d4fd 0%, #b721ff 100%);
  margin-left: 20px;
`;

class IndexPage extends Component {
  state = {
    options: [],
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
          editing: false,
        },
      ],
    };
  }
  createOptionsFromRanks = async ranksList => {
    return ranksList.map((player, i) => {
      return {
        text: player.Overall,
        id: shortId.generate(),
        editing: false,
      };
    });
  };

  componentDidMount() {
    const { firebase } = this.props;
    let ranks = getAllRanks(firebase).then(ranks =>
      this.createOptionsFromRanks(ranks).then(optionsMap => {
        this.setState({
          options: optionsMap,
        });
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
        .filter(({ text }) => text)
        .map(option => {
          if (option.id === id) {
            if (!option.editing) {
              this.editing = id;
            } else {
              this.editing = null;
            }

            return {
              ...option,
              editing: !option.editing,
            };
          }

          return {
            ...option,
            editing: false,
          };
        });

      return {
        ...prevState,
        options,
      };
    });
  };

  handleTextChange = (e, id) => {
    const options = this.state.options.map(option => {
      if (option.id === id) {
        return {
          ...option,
          text: e.target.value,
        };
      }

      return option;
    });

    this.setState({
      ...this.state,
      options,
    });
  };

  handleSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      ...this.state,
      options: arrayMove(this.state.options, oldIndex, newIndex),
    });
  };

  handleAddItem = () => {
    // if the user spams add w/o writing any text the items w/o any text get removed
    const options = this.state.options
      // filter out any falsy values from the list
      .filter(Boolean)
      .filter(({ text }) => text)
      .map(option => ({
        ...option,
        editing: false,
      }));
    const id = shortId.generate();
    this.editing = id;

    this.setState({
      ...this.state,
      options: [
        ...options,
        {
          id,
          text: "",
          editing: true,
        },
      ],
    });
  };

  handleDelete = id => {
    const options = this.state.options.filter(option => option.id !== id);

    this.setState({
      ...this.state,
      options,
    });
  };
  writeUserData(userId, name, email, imageUrl, ranks) {
    const { firebase } = this.props;
    firebase
      .database()
      .ref("users/" + userId)
      .set({
        username: name,
        email: email,
        profile_picture: imageUrl,
        ranks: ranks,
      });
  }
  handleClick() {
    const { firebase } = this.props;
    var user = firebase.auth().currentUser;
    var name, email, photoUrl, uid, emailVerified;

    if (user != null) {
      name = user.displayName;
      email = user.email;
      photoUrl = user.photoURL;
      emailVerified = user.emailVerified;
      uid = user.uid; // The user's ID, unique to the Firebase project. Do NOT use
      // this value to authenticate with your backend server, if
      // you have one. Use User.getToken() instead.
    }
    console.log(name + email + photoUrl + uid + emailVerified);
    this.writeUserData(uid, name, email, photoUrl, this.state.options);
  }
  render() {
    const { options } = this.state;

    return (
      <Layout>
        <h1>Hi people</h1>
        <p>Make some rankings!!!</p>

        {/* <FetchingExample /> */}
        <DraggableList
          options={options}
          onToggleEdit={this.handleToggleEdit}
          onTextChange={this.handleTextChange}
          onKeyDown={this.handleKeydown}
          onSortEnd={this.handleSortEnd}
          onDelete={this.handleDelete}
        />
        <Link to="/page-2/">Go to page 2</Link>
        <button onClick={this.handleClick}> CLICK HERE</button>

        <SignOut />
      </Layout>
    );
  }
}

export default withFirebase(IndexPage);
