import shortId from "short-id";

const createOptionsFromRanks = async ranksList =>
  ranksList.map((player, i) => ({
    name: player.Overall,
    id: shortId.generate(),
    position: player.Pos,
    team: player.Team,
    rank: i + 1,
    editing: false
  }));

const getAllOptions = async firebase => {
  const ranks = await firebase
    .database()
    .ref("/allranks")
    .once("value")
    .then(snapshot => {
      console.log(snapshot.val());
      return snapshot.val();
    });
  return createOptionsFromRanks(ranks);
};

export default getAllOptions;
