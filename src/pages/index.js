import React from "react";

import styled from "styled-components";
import Layout from "../components/layout";
import styles from "./styles.module.css";

const CoolH1 = styled.h1`
  color: blue;
  background-color: red;
`;
const classNames = `${styles.reallyCool} ${styles.cool}`;

console.log(styles);
const LandingPage = () => (
  <Layout>
    <CoolH1 className={classNames}>Landing page</CoolH1>
    <p> Describe how to do stuff</p>
  </Layout>
);

export default LandingPage;
