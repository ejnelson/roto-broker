/* eslint import/prefer-default-export: 0 */
/* eslint no-unused-vars: 0 */
import { google } from "googleapis";
import fetch from "node-fetch";

require("dotenv").config();

const serviceAccount = {
  type: process.env.FB_TYPE,
  project_id: process.env.FB_PROJECT_ID,
  private_key_id: process.env.FB_PRIVATE_KEY_ID,
  private_key: process.env.FB_PRIVATE_KEY,
  client_email: process.env.FB_CLIENT_EMAIL,
  client_id: process.env.FB_CLIENT_ID,
  auth_uri: process.env.FB_AUTH_URI,
  token_uri: process.env.FB_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FB_AUTH_PROVIDER,
  client_x509_cert_url: process.env.FB_CLIENT_CERT
};
const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/firebase.database"
];
const fixedKey = serviceAccount.private_key.replace(
  new RegExp("\\\\n", "g"),
  "\n"
);

// Authenticate a JWT client with the service account.
const jwtClient = new google.auth.JWT(
  serviceAccount.client_email,
  null,
  serviceAccount.private_key.replace(new RegExp("\\\\n", "g"), "\n"),
  scopes
);
const options = {
  headers: { "Ocp-Apim-Subscription-Key": process.env.FANTASY_API_KEY }
};
function checkStatus(res) {
  if (res.ok) {
    // res.status >= 200 && res.status < 300
    return res;
  }
  throw new Error("bad fetch");
}
export async function handler(event, context, callback) {
  console.log(`10.............................................`);
  console.log(`email   ${serviceAccount.client_email}`);
  console.log(`private key  ${serviceAccount.private_key}`);
  console.log(`fixed key ${fixedKey}`);

  try {
    //   const response = await fetch(
    //     "https://api.fantasydata.net/v3/nfl/stats/JSON/FantasyPlayers",
    //     options
    //   )
    //     .then(res => res.json())
    //     .then(json => {
    console.log("got it");
    // Use the JWT client to generate an access token.
    jwtClient.authorize(async (error, tokens) => {
      console.log("Im gunna try to write to firebase now please");
      if (error) {
        console.log("Error making request to generate access token:", error);
        callback({
          statusCode: 400,
          body: JSON.stringify({
            message: "error1"
          })
        });
      } else if (tokens.access_token === null) {
        console.log(
          "Provided service account does not have permission to generate access tokens"
        );
      } else {
        const accessToken = tokens.access_token;
        console.log(`here is the TOKENNNNNNNNN${accessToken}`);
        const write = await fetch(
          `https://roto-broker-625b9.firebaseio.com/nflData.json?access_token=${accessToken}`,
          {
            body: JSON.stringify({
              // json
              test: "ok"
            }),
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "PATCH"
          }
        )
          .then(checkStatus)
          .catch(err => {
            console.error(err);
            callback({
              statusCode: 400,
              body: JSON.stringify({
                message: "error2"
              })
            });
          })
          .then(res => res.json())
          .then(json => {
            console.log(json);
            callback({
              statusCode: 200,
              body: JSON.stringify({
                msg: "wedidit"
              })
            });
          });
      }
    });
    // });
  } catch (err) {
    console.log(err); // output to netlify function log

    callback({
      statusCode: 400,
      body: JSON.stringify({
        message: "error3"
      })
    });
  }
}
