import React from "react";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import PeopleIcon from "@material-ui/icons/People";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import blue from "@material-ui/core/colors/blue";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  }
};
class SimpleDialog extends React.Component {
  state = {
    leagueInputText: "",
    leagueSiteSelect: "ESPN"
  };

  handleClose = () => {
    const { onClose, selectedLeague } = this.props;
    onClose(selectedLeague);
  };

  handleListItemClick = value => {
    const { onClose } = this.props;
    onClose(value);
  };

  handleDeleteListItemClick = value => {
    const { deleteLeague } = this.props;
    deleteLeague(value);
  };

  handleAddListItemClick = (leagueID, leagueSite) => {
    if (leagueID === "") {
      alert("League already added"); // eslint-disable-line no-alert
      return;
    }
    const { addLeague } = this.props;
    addLeague(`${leagueSite}:${leagueID}`);
    this.setState({
      leagueInputText: "",
      leagueSiteSelect: "ESPN"
    });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    const {
      classes,
      onClose,
      deleteLeague,
      addLeague,
      selectedLeague,
      leagues,
      ...other
    } = this.props;

    const { leagueInputText, leagueSiteSelect } = this.state;
    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="simple-dialog-title"
        {...other}
      >
        <DialogTitle id="simple-dialog-title">Choose League</DialogTitle>
        <div>
          <List>
            {leagues.map(league => (
              <Grid container justify="space-between" key={league}>
                <Grid item xs={10}>
                  <ListItem
                    button
                    onClick={() => this.handleListItemClick(league)}
                  >
                    <ListItemAvatar>
                      <Avatar className={classes.avatar}>
                        <PeopleIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={league} />
                  </ListItem>
                </Grid>
                <Grid item xs>
                  <Button
                    onClick={() => this.handleDeleteListItemClick(league)}
                  >
                    <Avatar>
                      <DeleteIcon />
                    </Avatar>
                  </Button>
                </Grid>
              </Grid>
            ))}
          </List>

          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>
                Add Another League
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={8}>
                <Grid item>
                  <Button
                    onClick={() =>
                      this.handleAddListItemClick(
                        leagueInputText,
                        leagueSiteSelect
                      )
                    }
                  >
                    <Avatar>
                      <AddIcon />
                    </Avatar>
                  </Button>
                </Grid>
                <Grid item>
                  <TextField
                    margin="dense"
                    id="name"
                    label="league ID#"
                    value={leagueInputText}
                    fullWidth
                    onChange={this.handleChange("leagueInputText")}
                  />
                </Grid>
                <Grid item>
                  <FormControl>
                    <InputLabel htmlFor="league-site-select">Site</InputLabel>
                    <Select
                      native
                      value={leagueSiteSelect}
                      onChange={this.handleChange("leagueSiteSelect")}
                      inputProps={{
                        name: "site",
                        id: "league-site-select"
                      }}
                    >
                      <option value="ESPN">ESPN</option>
                      <option value="Yahoo">Yahoo</option>
                      <option value="NFL">NFL</option>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      </Dialog>
    );
  }
}

SimpleDialog.propTypes = {
  // classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  deleteLeague: PropTypes.func.isRequired,
  addLeague: PropTypes.func.isRequired,
  selectedLeague: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired
};

export default withStyles(styles)(SimpleDialog);
