const Challenger = require('../models/Challenger')

const challengers = [
  new Challenger(
    'meowto16',
    '@meowto16',
    {
      name: 'Kirshin M.',
      avatar: '/images/maxim-kirshin.jpeg',
      specialization: '/svg/sprite.svg#react',
      socials: {
        vk: 'https://vk.com/meowto16',
        github: 'https://github.com/meowto16'
      },
      birthday: new Date('2022-10-28')
    },
    {
      startDate: new Date('2022-01-01')
    }
  ),
  new Challenger(
    'e-razboinikov',
    '@e.razboinikov',
    {
      name: 'Razboynikov E.',
      avatar: '/images/evgeniy-razboynikov.jpeg',
      specialization: '/svg/sprite.svg#flutter',
      socials: {
        vk: 'https://vk.com/e.razboinikov',
        github: 'https://github.com/e-razboinikov'
      },
      birthday: new Date('2022-05-22')
    },
    {
      startDate: new Date('2022-01-01')
    }
  ),
  new Challenger(
    'ruslan-bekshenev',
    '@mynameisruslanbek',
    {
      name: 'Bekshenev R.',
      avatar: '/images/ruslan-bekshenev.jpg',
      specialization: '/svg/sprite.svg#react',
      socials: {
        vk: 'https://vk.com/mynameisruslanbek',
        github: 'https://github.com/ruslan-bekshenev'
      },
      birthday: new Date('2022-01-23')
    },
    {
      startDate: new Date('2022-01-21')
    }
  ),
  new Challenger(
    'maq7p',
    '@maqpug',
    {
      name: 'Petrov M.',
      avatar: '/images/maxim-petrov.jpeg',
      specialization: '/svg/sprite.svg#react',
      socials: {
        vk: 'https://vk.com/maqpug',
        github: 'https://github.com/maq7p'
      },
      birthday: new Date('2022-03-07')
    },
    {
      startDate: new Date('2022-01-21')
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
