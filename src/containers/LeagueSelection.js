import React from "react";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import PropTypes from "prop-types";

import FacesIcon from "@material-ui/icons/Face";
import Avatar from "@material-ui/core/Avatar";
import blue from "@material-ui/core/colors/blue";

import { withStyles } from "@material-ui/core/styles";
import SimpleDialog from "../components/SimpleDialog";
import { withFirebase } from "../components/FirebaseContext";

const styles = {
  leagueSelection: {
    backgroundColor: blue[100],
    color: blue[600]
  }
};
class LeagueSelection extends React.Component {
  state = {
    open: false,
    selectedLeague: "no leagues available",
    selectedMate: "",
    leagues: ["1"],
    leagueMates: []
  };

  allLeaguesRef = null;

  userLeaguesRef = null;

  componentWillMount() {
    const { firebase } = this.props;
    const { uid } = firebase.auth().currentUser;
    const { selectedLeague } = this.state;
    const cachedLeague = sessionStorage.getItem("league");

    let selectedLeagueFromStateOrCache;
    if (cachedLeague) {
      console.log(`l cached${JSON.parse(cachedLeague)}`);

      selectedLeagueFromStateOrCache = JSON.parse(cachedLeague);
    } else {
      selectedLeagueFromStateOrCache = selectedLeague;
    }

    console.log(uid);
    this.allLeaguesRef = firebase.database().ref(`leagues`);
    this.userLeaguesRef = firebase.database().ref(`users/${uid}/leagues`);
    this.userLeaguesRef.once("value", leagues => {
      if (selectedLeagueFromStateOrCache !== "no leagues available") {
        this.setLeague(selectedLeagueFromStateOrCache);
      }
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

  handleClickLeagueMate = mateUid => {
    const { setRanksToCompare } = this.props;
    setRanksToCompare(mateUid);
    sessionStorage.setItem("selectedMate", JSON.stringify(mateUid));

    this.setState(prevState => ({
      ...prevState,
      selectedMate: mateUid
    }));
  };

  setLeague = league => {
    this.allLeaguesRef.child(`${league}/members`).once("value", members => {
      console.log(league);
      const keys = Object.keys(members.val());
      const membersArray = [];
      keys.map(key => {
        const member = members.val()[key];
        member.uid = key;
        membersArray.push(member);
        return null;
      });
      sessionStorage.setItem("league", JSON.stringify(league));

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
    const {
      leagues,
      selectedLeague,
      open,
      leagueMates,
      selectedMate
    } = this.state;
    const { classes } = this.props;
    const cachedSelectedMate = sessionStorage.getItem("selectedMate");
    let selectedMateFromStateOrCache;
    if (cachedSelectedMate) {
      selectedMateFromStateOrCache = JSON.parse(cachedSelectedMate);
    } else {
      selectedMateFromStateOrCache = selectedMate;
    }
    return (
      <div className={classes.leagueSelection}>
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
          let avatar = <FacesIcon />;

          if (data.photoURL != null) {
            avatar = <Avatar alt="photo" src={data.photoURL} />;
          }
          let color = "default";
          if (data.uid === selectedMateFromStateOrCache) {
            color = "primary";
          }
          return (
            <Chip
              key={data.uid}
              avatar={avatar}
              label={data.username}
              clickable
              color={color}
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
export default withFirebase(withStyles(styles)(LeagueSelection));
