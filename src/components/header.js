import React from "react";
import { navigate, Link } from "gatsby";
import styled from "styled-components";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Switch from "@material-ui/core/Switch";
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
  // state = {
  //   checked: false
  // };

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
    const { siteTitle, firebase, changeIsRanks } = this.props;
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
          <button type="button" onClick={() => changeIsRanks()}>
            change ranks/trades
          </button>
        ) : null}
        {firebase.auth().currentUser ? <UserMenu /> : null}
      </HeaderBar>
    );
  }
}

export default withFirebase(Header);
