const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  const achievements = [
    {
      icon: '/svg/sprite.svg#medal-1',
      name: 'First step',
      description: '1 day gone',
    },
    {
      icon: '/svg/sprite.svg#medal-2',
      name: 'Week hero',
      description: 'contribute 7 days in a row',
    },
    {
      icon: '/svg/sprite.svg#medal-3',
      name: 'Month terminator',
      description: 'contribute 30 days in a row',
    },
    {
      icon: '/svg/sprite.svg#medal-4',
      name: 'Tryhard',
      description: 'contribute 90 days in a row',
    },
    {
      icon: '/svg/sprite.svg#medal-5',
      name: 'Demigod',
      description: 'contribute 180 days in a row',
    },
    {
      icon: '/svg/sprite.svg#medal-6',
      name: 'God',
      description: 'contribute 365 days in a row',
    },

    {
      icon: '/svg/sprite.svg#ribbon-1',
      name: 'Trainee',
      description: 'make 5 contributes in a day'
    },
    {
      icon: '/svg/sprite.svg#ribbon-2',
      name: 'Junior',
      description: 'make 10 contributes in a day'
    },
    {
      icon: '/svg/sprite.svg#ribbon-3',
      name: 'Pre-middle',
      description: 'make 15 contributes in a day'
    },
    {
      icon: '/svg/sprite.svg#ribbon-4',
      name: 'Middle',
      description: 'make 20 contributes in a day'
    },
    {
      icon: '/svg/sprite.svg#ribbon-5',
      name: 'Upper-middle',
      description: 'make 30 contributes in a day'
    },
    {
      icon: '/svg/sprite.svg#ribbon-6',
      name: 'Senior',
      description: 'make 50 contributes in a day'
    },
  ]

  const challengers = [
    {
      name: 'Kirshin M.',
      avatar: '/images/maxim-kirshin.jpeg',
      specialization: '/svg/sprite.svg#react',
      socials: {
        vk: 'https://vk.com/meowto16',
        github: 'https://github.com/meowto16',
      },
      stats: {
        currentStreak: '10 days',
        contributionsPerDay: '12.43',
        lastActive: '5 hours ago',
        daysMissed: '0'
      },
      achievements,
      rating: 4,
      activity: {
        Mon: 6,
        Tue: 3,
        Wed: 4,
        Thu: 2,
        Fri: 5,
        Sun: 6,
        Sat: 6,
      }
    },
    {
      name: 'Razboynikov E.',
      avatar: '/images/evgeniy-razboynikov.jpeg',
      specialization: '/svg/sprite.svg#flutter',
      socials: {
        vk: 'https://vk.com/e.razboinikov',
        github: 'https://github.com/e-razboinikov',
      },
      stats: {
        currentStreak: '5 days',
        contributionsPerDay: '4.65',
        lastActive: '18 hours ago',
        daysMissed: '0'
      },
      achievements,
      rating: 3,
      activity: {
        Mon: 5,
        Tue: 3,
        Wed: 4,
        Thu: 3,
        Fri: 6,
        Sun: 0,
        Sat: 1,
      }
    }
  ]

  res.render('index', {
    time: {
      datetime: '2022-01-02',
      datatype: 'YYYY-MM-DD',
      humantime: '2 January 2022'
    },
    challengers,
  });
});

module.exports = router;
