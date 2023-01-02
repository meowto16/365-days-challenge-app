const Challenger = require('../models/Challenger')

const challengers = [
  new Challenger(
    'meowto16',
    '@mw',
    {
      name: 'Kirshin M.',
      avatar: '/images/maxim-kirshin.jpeg',
      specialization: 'react',
      socials: {
        vk: 'https://vk.com/mw',
        github: 'https://github.com/meowto16'
      },
      birthday: new Date('2022-10-28')
    },
    {
      startDate: new Date('2023-01-01')
    }
  )
]

const fetchChallengers = async () => {
  const response = await Promise.all(
    challengers.map((challenger) => challenger.getFullInformation())
  )

  return challengers.reduce((acc, challenger, idx) => {
    acc[challenger.github] = response[idx]

    return acc
  }, {})
}

module.exports = {
  challengers,
  fetchChallengers
}
