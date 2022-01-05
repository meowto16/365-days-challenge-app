const express = require('express');
const router = express.Router();

const Challenger = require('../models/Challenger')

router.get('/', async function(req, res) {

  const challengers = [
    new Challenger('meowto16', {
      name: 'Kirshin M.',
      avatar: '/images/maxim-kirshin.jpeg',
      specialization: '/svg/sprite.svg#react',
      socials: {
        vk: 'https://vk.com/meowto16',
        github: 'https://github.com/meowto16',
      }}),
    new Challenger('e-razboinikov', {
      name: 'Razboynikov E.',
      avatar: '/images/evgeniy-razboynikov.jpeg',
      specialization: '/svg/sprite.svg#flutter',
      socials: {
        vk: 'https://vk.com/e.razboinikov',
        github: 'https://github.com/e-razboinikov',
      }}),
  ]

  const challengersFullified = await Promise.all(
    challengers.map(challenger => challenger.getFullInformation())
  )

  res.render('index', {
    time: {
      datetime: new Date().toISOString().split('T')[0],
      datatype: 'YYYY-MM-DD',
      humantime: new Date().toDateString(),
    },
    challengers: challengersFullified,
  });
});

module.exports = router;
