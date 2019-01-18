import React from "react";
import { navigate, Link } from "gatsby";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import UserMenu from "./UserMenu";
import logo from "../images/roto-broker.png";
import SEO from "./seo";
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
class Header extends React.Component {
  state = {
    checked: true
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
    console.log(name);
    console.log(event.target.checked);
    if (event.target.checked) {
      navigate("/trades");
    } else {
      navigate("/ranks");
    }
  };

  render() {
    const { siteTitle, firebase } = this.props;
    const { checked } = this.state;
    return (
      <HeaderBar>
        <SEO
          title="Home"
          keywords={[`fantasy football`, `roto`, `trade`, "trade help"]}
        />
        <Link to="/">
          <Logo src={logo} alt={siteTitle} />
        </Link>
        {firebase.auth().currentUser ? (
          <FormControlLabel
            control={
              <Switch
                checked={checked}
                onChange={this.handleChange("checked")}
                value="checked"
              />
            }
            label="Primary"
          />
        ) : null}
        {firebase.auth().currentUser ? <UserMenu /> : null}
      </HeaderBar>
    );
  }
}

export default withFirebase(Header);
