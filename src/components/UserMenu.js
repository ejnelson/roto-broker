import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AccountCircle from "@material-ui/icons/AccountCircle";
import styled from "styled-components";
import { withFirebase } from "./FirebaseContext";

const UserIcon = styled(AccountCircle)`
  && {
    font-size: 2rem;
  }
`;
class SimpleMenu extends React.Component {
  state = {
    anchorEl: null
  };

  handleClickProfile = event => {
    console.log(event);

    this.setState({ anchorEl: null });
    // todo: navigate to profile or show profile
  };

  handleClickHelp = event => {
    this.setState({ anchorEl: null });
    console.log(event);
    // todo: navigate to help
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  signOut = () => {
    this.setState({ anchorEl: null });
    const { firebase } = this.props;
    firebase.auth().signOut();
  };

  render() {
    const { anchorEl } = this.state;

    return (
      <div>
        <IconButton
          aria-owns={anchorEl ? "simple-menu" : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <UserIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleClickProfile}>Profile</MenuItem>
          <MenuItem onClick={this.handleClickHelp}>Help</MenuItem>
          <MenuItem onClick={this.signOut}>Logout</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default withFirebase(SimpleMenu);
