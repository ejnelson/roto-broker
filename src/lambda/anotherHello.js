/* eslint import/prefer-default-export: 0 */
/* eslint no-unused-vars: 0 */
const firebase = require("firebase");

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

firebase.initializeApp({
  serviceAccount: {
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key.replace(
      new RegExp("\\\\n", "g"),
      "\n"
    )
  },
  databaseURL: "https://roto-broker-625b9.firebaseio.com/"
});

console.log(process.env.fb_privateKey);
export async function handler(event, context, callback) {
  firebase
    .database()
    .ref("users")
    .once("value", snapshot => {
      console.log(snapshot.val());
      process.exit();
    });
}
