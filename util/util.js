const regions = require('../data/regions.json');
const seasons = require('../data/seasons.json');
const fs      = require('fs');
const axios   = require('axios');

const headers = {
  Authorization  : `Bearer ${process.env.PUBG_KEY}`,
  'Content-Type' : 'application/json',
  Accept         : 'application/json'
};

const filterCurrentSeason = ( data ) => data.attributes.isCurrentSeason;

getSavedSeason = () => {
  return seasons.filter(filterCurrentSeason)[0].id;
}

getLiveSeason = () => {
  return axios.get('https://api.pubg.com/shards/pc-na/seasons', { headers })
    .then(({ data }) => {
      const currentSeasonId = data.data.filter(filterCurrentSeason)[0].id;
      return {
        id: currentSeasonId,
        data
      };
    })
    .catch(err => console.log(err));
}

exports.createPubgInstance = () => {
  const instance = axios.create({
    baseURL: 'https://api.pubg.com',
    timeout: 3000,
    headers
  });
  return instance;
}

const updateSeasonFile = data => {
  let wstream = fs.createWriteStream(__dirname + '../data/seasons.json', { flags: 'w+' });
  wstream.write(data, err => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('file updated');
  });
}

exports.compareSeasons = async () => {
  const [
    liveSeasons,
    savedSeason
  ] = await Promise.all([
    getLiveSeason(),
    getSavedSeason()
  ]);

  if (liveSeasons.id !== savedSeason) {
    updateSeasonFile(liveSeasons.data);
  } else {
    console.log('seasons are identical');
  }
}

exports.getRegion = (platform, region) => regions[platform][region];

exports.capitalize = str => str[0].toUpperCase() + str.slice(1).toLowerCase();
