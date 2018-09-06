const { capitalize, getRegion, createPubgInstance } = require('./util');

class API {
  constructor(API_KEY) {
    this.API_KEY = API_KEY;
    this.fetcher = createPubgInstance();
  }

  getPlayer(playerName, platform, region) {
    const regionURL = getRegion(platform, region);
    playerName = capitalize(playerName);

    return this.fetcher
      .get(`/shards/${regionURL}/players?filter[playerNames]=${playerName}`);
  }

  getPlayerSeasonStats(playerId, seasonId, platform, region) {
    const regionURL = getRegion(platform, region);

    return this.fetcher
      .get(`/shards/${regionURL}/players/${playerId}/seasons/${seasonId}`);
  }
}



module.exports = API;
