const config = {
  apiKey: "AIzaSyA8rA-zxGf9rcQLClghCdIhLzMl9VkbYlw",
  authDomain: "roto-broker-625b9.firebaseapp.com",
  databaseURL: "https://roto-broker-625b9.firebaseio.com",
  projectId: "roto-broker-625b9",
  storageBucket: "roto-broker-625b9.appspot.com",
  messagingSenderId: "1077190018456"
};

// let firebaseCache;

export const getUiConfig = firebase => ({
  signInFlow: "popup",
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ]
});

const getFirebase = firebase => {
  // if (firebaseCache) {
  //   return firebaseCache;
  // }

  firebase.initializeApp(config);
  // firebaseCache = firebase;
  return firebase;
};

export default getFirebase;
