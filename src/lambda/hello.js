/* eslint import/prefer-default-export: 0 */
/* eslint no-unused-vars: 0 */
import { google } from "googleapis";
import fetch from "node-fetch";

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

// Authenticate a JWT client with the service account.
const jwtClient = new google.auth.JWT(
  serviceAccount.client_email,
  null,
  serviceAccount.private_key.replace(new RegExp("\\\\n", "g"), "\n"),
  scopes
);
function checkStatus(res) {
  console.log(`status${res.status}`);
  if (res.ok) {
    // res.status >= 200 && res.status < 300
    return res;
  }
  throw new Error(res.statusText);
}
export function handler(event, context, callback) {
  // Use the JWT client to generate an access token.
  jwtClient.authorize(async (error, tokens) => {
    if (error) {
      console.log("Error making request to generate access token:", error);
    } else if (tokens.access_token === null) {
      console.log(
        "Provided service account does not have permission to generate access tokens"
      );
    } else {
      const accessToken = tokens.access_token;
      const write = await fetch(
        `https://roto-broker-625b9.firebaseio.com/nflData.json?access_token=${accessToken}`,
        {
          body: JSON.stringify({
            // json
            test: "ok123"
          }),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: "PATCH"
        }
      )
        .then(checkStatus)
        .then(res => res.json())
        .then(json => {
          console.log(json);
          callback({
            statusCode: 200,
            body: json
          });
        });
      // .catch(err => {
      //   console.log(JSON.stringify(err));
      //   console.log(err.text());

      //   callback({
      //     statusCode: 400,
      //     body: JSON.stringify({
      //       message: err
      //     })
      //   });
      // });
    }
  });
}
