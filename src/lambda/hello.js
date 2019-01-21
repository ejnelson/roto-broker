/* eslint import/prefer-default-export: 0 */
// show object spread works, i.e. babel works
const obj = {
  foo: "bar"
};
export function handler(event, context, callback) {
  console.log("event", event);
  console.log("context", context);

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ msg: "Hello, World!", ...obj })
  });
}
