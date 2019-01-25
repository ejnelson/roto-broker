/* eslint import/prefer-default-export: 0 */
/* eslint no-unused-vars: 0 */
import fetch from "node-fetch";

require("dotenv").config();

const options = {
  headers: { "Ocp-Apim-Subscription-Key": process.env.FANTASY_API_KEY }
};

export async function handler(event, context) {
  console.log("doing the test");
  try {
    const response = await fetch(
      "https://api.fantasydata.net/v3/nfl/stats/JSON/FantasyPlayers",
      options
    )
      .then(res => res.json())
      .then(json => {
        console.log(json);

        return {
          statusCode: 200,
          body: JSON.stringify({ msg: json })
        };
      });

    return {
      statusCode: 200,
      body: JSON.stringify({ msg: "ok" })
    };
  } catch (err) {
    console.log(err); // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }) // Could be a custom message or object i.e. JSON.stringify(err)
    };
  }
}
