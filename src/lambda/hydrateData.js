/* eslint import/prefer-default-export: 0 */

import firebase from "firebase";
import request from "request";

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
  url: "https://api.fantasydata.net/v3/nfl/stats/JSON/FantasyPlayers",
  headers: {
    "Ocp-Apim-Subscription-Key": "17611b8bcbb649fd808febd543b4a8a5"
  }
};
function firebaseCallback(error, response, body) {
  if (!error && response.statusCode === 200) {
    const data = JSON.parse(body);
    console.log(data);
    firebase
      .database()
      .ref("/nflData")
      .push({ original: data });
  }
}
export async function handler(event, context, callback) {
  try {
    const response = await request(options, firebaseCallback);
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText };
    }
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ msg: data.value })
    };
  } catch (err) {
    console.log(err); // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }) // Could be a custom message or object i.e. JSON.stringify(err)
    };
  }
}
