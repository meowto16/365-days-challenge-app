const Challenger = require('../models/Challenger')

const challengers = [
  new Challenger(
    'meowto16',
    '@meowto16',
    {
      name: 'Kirshin M.',
      avatar: '/images/maxim-kirshin.jpeg',
      specialization: 'react',
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
      name: 'Razboinikov E.',
      avatar: '/images/evgeniy-razboynikov.jpeg',
      specialization: 'flutter',
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
      specialization: 'react',
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
      specialization: 'react',
      socials: {
        vk: 'https://vk.com/maqpug',
        github: 'https://github.com/maq7p'
      },
      birthday: new Date('2022-03-07')
    },
    {
      startDate: new Date('2022-01-21')
    }
  ),
  new Challenger(
    'masterdensan',
    '@nightshikiden',
    {
      name: 'Lambin D.',
      avatar: '/images/denis-lambin.jpeg',
      specialization: 'react',
      socials: {
        vk: 'https://vk.com/nightshikiden',
        github: 'https://github.com/MasterDenSan'
      },
      birthday: new Date('2022-08-08')
    },
    {
      startDate: new Date('2022-07-18')
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
