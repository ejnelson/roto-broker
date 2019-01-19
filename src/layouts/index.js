import React, { Component } from "react";

import getFirebase from "../services/firebase";
import FirebaseContext from "../components/FirebaseContext";
import SignIn from "../containers/SignIn";

class AuthLayout extends Component {
  state = {
    firebase: null,
    authenticated: false
  };

  componentDidMount() {
    const app = import("firebase/app");
    const auth = import("firebase/auth");
    const database = import("firebase/database");

    Promise.all([app, auth, database]).then(values => {
      const firebase = getFirebase(values[0]);
      this.setState({ firebase });

      firebase.auth().onAuthStateChanged(user => {
        if (!user) {
          this.setState({ authenticated: false });
        } else {
          this.setState({ authenticated: true });
        }
      });
    });
  }

  render = () => {
    const { firebase, authenticated } = this.state;
    const { children } = this.props;
    if (!firebase) return null;

    return (
      <FirebaseContext.Provider value={firebase}>
        {authenticated ? children : <SignIn />}
      </FirebaseContext.Provider>
    );
  };
}

export default AuthLayout;
