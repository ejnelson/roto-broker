const getAllRanks = async firebase => {
  return firebase
    .database()
    .ref("/allranks")
    .once("value")
    .then(snapshot => {
      console.log(snapshot.val());
      return snapshot.val();
    });
};

export default getAllRanks;
