import PropTypes from "prop-types";
import styled from "styled-components";
import React, { Component } from "react";

import Header from "./header";
import "./layout.css";

import getFirebase from "../services/firebase";
import FirebaseContext from "./FirebaseContext";
import SignIn from "../containers/SignIn";

const Background = styled.div`
  background: white;
  background: linear-gradient(
    to top,
    ${props => props.gradientColor || "black"} -5%,
    rgba(255, 255, 255, 0) 65%
  );
  background-attachment: fixed;
`;
const Container = styled.div`
  margin: 0 auto;
  max-width: 960px;
  padding: 0px 1.0875rem 1.45rem;
`;

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
    const { children, gradientColor } = this.props;
    if (!firebase) return null;

    return (
      <FirebaseContext.Provider value={firebase}>
        <Header />
        <Background gradientColor={gradientColor}>
          <Container>{authenticated ? children : <SignIn />}</Container>
        </Background>
      </FirebaseContext.Provider>
    );
  };
}

export default AuthLayout;

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired
};
