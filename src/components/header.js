/* eslint import/no-unresolved: 0 */

import React from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import Switch from "@material-ui/core/Switch";
import { withStyles } from "@material-ui/core/styles";
import logo from "../images/roto-broker.png";
import UserMenu from "./UserMenu";
import Seo from "./seo";
import { withFirebase } from "./FirebaseContext";

const Logo = styled.img`
  height: 2rem;
`;
const HeaderBar = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const styles = {
  icon: {
    background: "black"
  },
  iconChecked: {
    background: "purple"
  }
};

class Header extends React.Component {
  // ranks is false, trades is true
  state = {
    checked: false
  };

  handleChange = name => event => {
    const { changeRanksOrTrades } = this.props;
    this.setState({ [name]: event.target.checked });

    if (event.target.checked) {
      changeRanksOrTrades("trades");
    } else {
      changeRanksOrTrades("ranks");
    }
  };

  render() {
    const { siteTitle, firebase, classes } = this.props;
    const { checked } = this.state;
    return (
      <HeaderBar>
        <Seo
          title="Home"
          keywords={[`fantasy football`, `roto`, `trade`, "trade help"]}
        />
        <Link to="/">
          <Logo src={logo} alt={siteTitle} />
        </Link>
        {firebase.auth().currentUser ? (
          <div>
            ranks
            <Switch
              classes={classes}
              checked={checked}
              onChange={this.handleChange("checked")}
              value="checked"
              color="default"
            />
            trades
          </div>
        ) : null}

        {firebase.auth().currentUser ? <UserMenu /> : null}
      </HeaderBar>
    );
  }
}

export default withStyles(styles)(withFirebase(Header));
