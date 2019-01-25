/* eslint import/prefer-default-export: 0 */

// more info: https://www.netlify.com/docs/functions/#identity-and-functions

// Note that `netlify-lambda` only locally emulates Netlify Functions, while `netlify-identity-widget` interacts with a real Netlify Identity instance. This means that `netlify-lambda` doesn't support Netlify Functions + Netlify Identity integration.

export function handler(event, context, callback) {
  console.log(event);
  console.log(context);

  if (context.clientContext) {
    const {
      user // actual user info you can use for your serverless functions
    } = context.clientContext;
    console.log(`here is the user${user}`);
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        msg: `auth-hello: ${Math.round(Math.random() * 10)}`,
        user
      })
    });
  } else {
    console.log(`
      Note that netlify-lambda only locally emulates Netlify Functions, 
      while netlify-identity-widget interacts with a real Netlify Identity instance. 
      This means that netlify-lambda doesn't support Netlify Functions + Netlify Identity integration.
      `);
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        msg:
          "auth-hello - no authentication detected. Note that netlify-lambda doesnt locally emulate Netlify Identity."
      })
    });
  }
}
