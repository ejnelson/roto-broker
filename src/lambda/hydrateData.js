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

export function handler(event, context, callback) {
  console.log(`received request: ${event}`);
  console.log(`context: ${context}`);

  request(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const data = JSON.parse(body);
      callback(null, {
        statusCode: response.statusCode,
        body: JSON.stringify({ msg: data })
      });
      firebase
        .database()
        .ref("/nflData")
        .push({ original: data });
    } else {
      callback(null, {
        statusCode: response.statusCode,
        body: JSON.stringify({ msg: response.status })
      });
    }
  });
}
