import React from "react";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import PropTypes from "prop-types";

import TagFacesIcon from "@material-ui/icons/TagFaces";
import Avatar from "@material-ui/core/Avatar";

import SimpleDialog from "../components/SimpleDialog";
import { withFirebase } from "../components/FirebaseContext";

class LeagueSelection extends React.Component {
  state = {
    open: false,
    selectedLeague: "no leagues available",
    selectedMate: "",
    leagues: ["1"],
    leagueMates: [
      { key: 0, label: "Angular" },
      { key: 1, label: "jQuery" },
      { key: 2, label: "Polymer" },
      { key: 3, label: "React" },
      { key: 4, label: "Vue.js" }
    ]
  };

  allLeaguesRef = null;

  userLeaguesRef = null;

  componentWillMount() {
    const { firebase } = this.props;
    const { uid } = firebase.auth().currentUser;
    console.log(uid);
    this.allLeaguesRef = firebase.database().ref(`leagues`);
    this.userLeaguesRef = firebase.database().ref(`users/${uid}/leagues`);
    this.userLeaguesRef.once("value", leagues => {
      this.setLeague(leagues.val()[0]);
      this.setState(prevState => ({
        ...prevState,
        leagues: leagues.val() || []
      }));
    });
  }

  handleClickOpen = () => {
    this.setState(prevState => ({
      ...prevState,
      open: true
    }));
  };

  handleClickLeagueMate = mate => {
    const { setRanksToCompare } = this.props;
    console.log(mate);
    setRanksToCompare(mate);
    this.setState(prevState => ({
      ...prevState,
      selectedMate: mate
    }));
  };

  setLeague = league => {
    this.allLeaguesRef.child(`${league}/members`).once("value", members => {
      const keys = Object.keys(members.val());
      const membersArray = [];
      keys.map(key => {
        const member = members.val()[key];
        member.uid = key;
        membersArray.push(member);
        return null;
      });
      this.setState(prevState => ({
        ...prevState,
        selectedLeague: league,
        leagueMates: membersArray,
        open: false
      }));
    });
  };

  handleClose = league => {
    this.setLeague(league);
  };

  handleDeleteLeague = value => {
    const { firebase } = this.props;

    const { leagues } = this.state;
    const filteredLeagues = leagues.filter(e => e !== value);
    this.userLeaguesRef.set(filteredLeagues);
    const { uid } = firebase.auth().currentUser;

    this.allLeaguesRef.child(`${value}/members/${uid}`).remove();

    this.setState(prevState => ({
      ...prevState,
      leagues: filteredLeagues
    }));
  };

  handleAddLeague = value => {
    const { firebase } = this.props;
    const { uid, displayName, email, photoURL } = firebase.auth().currentUser;
    this.allLeaguesRef
      .child(`${value}/members`)
      .child(uid)
      .set({
        username: `${displayName}`,
        email: `${email}`,
        photoURL: `${photoURL}`
      });
    this.setState(prevState => {
      const newLeagues = prevState.leagues;
      if (newLeagues.indexOf(value) === -1) {
        newLeagues.push(value);
      }
      this.userLeaguesRef.set(newLeagues);
      return {
        ...prevState,
        leagues: newLeagues
      };
    });
  };

  render() {
    const { leagues, selectedLeague, open, leagueMates } = this.state;
    return (
      <div>
        <Button onClick={this.handleClickOpen}>League: {selectedLeague}</Button>
        <SimpleDialog
          selectedLeague={selectedLeague}
          open={open}
          onClose={this.handleClose}
          leagues={leagues}
          deleteLeague={this.handleDeleteLeague}
          addLeague={this.handleAddLeague}
        />
        Select Leaguemate to compare ranks:
        {leagueMates.map(data => {
          let avatar = <TagFacesIcon />;

          if (data.photoURL != null) {
            avatar = <Avatar alt="photo" src={data.photoURL} />;
          }
          return (
            <Chip
              key={data.uid}
              avatar={avatar}
              label={data.username}
              onClick={() => this.handleClickLeagueMate(data.uid)}
            />
          );
        })}
      </div>
    );
  }
}
LeagueSelection.propTypes = {
  setRanksToCompare: PropTypes.func.isRequired
};
export default withFirebase(LeagueSelection);
