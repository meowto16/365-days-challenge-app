const express = require('express');
const router = express.Router();

const { challengers, fetchChallengers } = require('../../constants/challengers')

router.get('/check-contributes-today', async (req, res) => {
  await fetchChallengers()

  const { contributed, notContributed } = challengers.reduce((acc, challenger) => {
    acc[challenger.checkHaveContributesToday() ? 'contributed' : 'notContributed'].push({
      github: challenger.github,
      vk: challenger.vk,
      info: challenger.info,
      stats: challenger.stats,
    })
    return acc
  }, { contributed: [], notContributed: [] })

  res.json({
    contributed,
    notContributed,
  })
})

module.exports = router
