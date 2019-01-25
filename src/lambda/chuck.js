/* eslint import/prefer-default-export: 0 */

import fetch from "node-fetch";
import firebase from "firebase";

const config = {
  apiKey: "AIzaSyA8rA-zxGf9rcQLClghCdIhLzMl9VkbYlw",
  authDomain: "roto-broker-625b9.firebaseapp.com",
  databaseURL: "https://roto-broker-625b9.firebaseio.com",
  projectId: "roto-broker-625b9",
  storageBucket: "roto-broker-625b9.appspot.com",
  messagingSenderId: "1077190018456"
};
firebase.initializeApp(config);

const options = {
  headers: { "Ocp-Apim-Subscription-Key": "17611b8bcbb649fd808febd543b4a8a5" }
};

export async function handler(event, context) {
  try {
    const response = await fetch(
      "https://api.fantasydata.net/v3/nfl/stats/JSON/FantasyPlayers",
      options
    );
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText };
    }
    const data = await response.json();
    console.log(firebase.database().ref("/nflData"));
    console.log("got it");
    firebase
      .database()
      .ref("/nflData")
      .push({ original: data });
    return {
      statusCode: 200,
      body: JSON.stringify({ msg: data })
    };
  } catch (err) {
    console.log(err); // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }) // Could be a custom message or object i.e. JSON.stringify(err)
    };
  }
}
