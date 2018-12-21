import React, { Component } from "react";
import { withFirebase } from "../components/FirebaseContext";

class FetchingExample extends Component {
  state = {
    test: null,
  };
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.writeUserData = this.writeUserData.bind(this);
  }
  componentDidMount() {
    const { firebase } = this.props;
    for (var key in this.props) {
      console.log("key" + key);
    }
    firebase
      .database()
      .ref("/qbranks")
      .once("value")
      .then(snapshot => {
        this.setState({
          test: snapshot.val(),
        });
      });
  }
  writeUserData(userId, name, email, imageUrl) {
    const { firebase } = this.props;
    firebase
      .database()
      .ref("users/" + userId)
      .set({
        username: name,
        email: email,
        profile_picture: imageUrl,
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
    this.writeUserData(uid, name, email, photoUrl);
  }
  render() {
    const { test } = this.state;

    if (!test) {
      return null;
    }

    return (
      <div>
        {test.map((x, i) => (
          <h4>string test data : {x.Quarterbacks.toString()}</h4>
        ))}
        <button onClick={this.handleClick}> CLICK HERE</button>
      </div>
    );
  }
}

export default withFirebase(FetchingExample);
