const express = require('express');
const router = express.Router();

const { challengers, fetchChallengers } = require('../constants/challengers')

router.get('/', async function(req, res) {
  await fetchChallengers()

  challengers.forEach(challenger => challenger.checkHaveContributesToday())

  res.render('index', {
    time: {
      datetime: new Date().toISOString().split('T')[0],
      datatype: 'YYYY-MM-DD',
      humantime: new Date().toDateString(),
    },
    challengers: challengers,
  });
});

module.exports = router;
