require('dotenv').config();
const express = require('express');
const path    = require('path');
const morgan  = require('morgan');
const port    = process.env || 5000;
const app     = express();

app.use(morgan('dev'));
app.use(express.json());

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

app.listen(port, () => `listening on port ${port}`);
