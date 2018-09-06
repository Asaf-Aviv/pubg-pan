const router   = require('express').Router();
const pubgPan = require('../../util/pubg-pan');

const Pan = new pubgPan(process.env.PUBG_KEY);

router.get('/', async (req, res) => {
  Pan.getPlayer('YOJIMBOZ', 'pc', 'EU')
    .then(result => res.send(result.data))
    .catch(err => console.log(err.response.statusText))
});

module.exports = router;
