const createOptionsFromRanks = async ranksList =>
  ranksList.map((player, i) => ({
    name: player.Name,
    position: player.Position,
    team: player.Team || "FA",
    rank: i + 1,
    id: player.PlayerID,
    owned: false,
    projectedPoints: player.ProjectedFantasyPoints,
    lastSeasonPoints: player.LastSeasonFantasyPoints,
    auctionValue: player.AuctionValue,
    auctionValuePPR: player.AuctionValuePPR,
    averageDraftPosition: player.AverageDraftPosition,
    averageDraftPositionPPR: player.AverageDraftPositionPPR,
    byeWeek: player.ByeWeek || "n/a",
    stats: player.stats || "n/a"
  }));

const getAllOptions = async firebase => {
  const ranks = await firebase
    .database()
    .ref("/nflData/adp")
    .once("value")
    .then(snapshot => snapshot.val());
  return createOptionsFromRanks(ranks);
};

export default getAllOptions;
