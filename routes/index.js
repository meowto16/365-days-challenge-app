const express = require('express');
const router = express.Router();

const { challengers } = require('../constants/challengers')

router.get('/', async function(req, res) {
  res.render('index', {
    challengers: challengers,
  });
});

module.exports = router;
