const regions = require('../data/regions.json');
const seasons = require('../data/seasons.json');
const fs      = require('fs');
const path    = require('path');
const axios   = require('axios');

const headers = {
  Authorization  : `Bearer ${process.env.PUBG_KEY}`,
  'Content-Type' : 'application/json',
  Accept         : 'application/json'
};

const filterCurrentSeason = ({ attributes }) => attributes.isCurrentSeason;

const getSavedSeasonId = () => seasons.filter(filterCurrentSeason)[0].id;

const getLiveSeasonData = () => {
  return axios.get('https://api.pubg.com/shards/pc-na/seasons', { headers })
    .then(({ data }) => {
      const liveSeasonId = data.data.filter(filterCurrentSeason)[0].id;
      return {
        id: liveSeasonId,
        data: data.data
      };
    })
    .catch(err => console.log(err));
}

const updateSeasonFile = data => {
  fs.writeFile(
    path.join(__dirname, '../data/seasons.json'),
    JSON.stringify(data, null, 2), err => {
      if (err) {
        console.log(err);
      }
  });
}

exports.compareSeasons = async () => {
  const [
    liveSeasons,
    savedSeasonId
  ] = await Promise.all([
    getLiveSeasonData(),
    getSavedSeasonId()
  ]);

  if (!savedSeasonId || liveSeasons.id !== savedSeasonId) {
    updateSeasonFile(liveSeasons.data);
  }
}

exports.createPubgInstance = () => {
  const instance = axios.create({
    baseURL: 'https://api.pubg.com',
    timeout: 3000,
    headers
  });
  return instance;
}

exports.capitalize = str => str[0].toUpperCase() + str.slice(1).toLowerCase();

exports.getRegion = (platform, region) => regions[platform][region];
