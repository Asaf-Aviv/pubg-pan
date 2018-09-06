require('dotenv').config();
const express = require('express');
const path    = require('path');
const morgan  = require('morgan');
const port    = process.env.PORT || 5000;
const app     = express();
const util    = require('./util/util');
const pubgAPI = require('./api/pubg/pubgAPI');

app.use(morgan('dev'));
app.use(express.json());

app.use('/pubg', pubgAPI);

app.get('/', (req, res) => {
  res.send('yallow');
});

if (process.env.NODE_ENV === 'production') {
  console.log('production env');
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

setInterval(util.compareSeasons, 60 * 1000 * 60 * 12);

app.listen(port, () => console.log(`listening on port ${port}`));
