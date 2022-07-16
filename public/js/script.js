'use strict'

const main = async function () {
  registerServiceWorker()
  activateChallengerFavorites()

  await fetchAndFillInfo()

  await activateTooltips()
  await activatePullToRefresh()
}

async function fetchAndFillInfo() {
  fillCurrentDate()

  const challengersNodes = document.querySelectorAll('.js-challenger')
  const challengersInfo = await API.fetchChallengersFullInfo()

  challengersNodes.forEach((challengerNode) => {
    const github = challengerNode.dataset.challengerGithub
    const data = challengersInfo[github]

    fillChallengerStats(challengerNode, data.stats)
    fillChallengerRating(challengerNode, data.rating)
    fillChallengerActivity(challengerNode, data.activity)
    fillChallengerAchievements(challengerNode, data.achievements)
  })
}

function fillCurrentDate() {
  const timeNode = document.querySelector('.js-header-time')
  const time = {
    datetime: new Date().toISOString().split('T')[0],
    datatype: 'YYYY-MM-DD',
    humantime: new Date().toDateString()
  }

  timeNode.setAttribute('datetime', time.datetime)
  timeNode.setAttribute('datatype', time.datatype)
  timeNode.textContent = time.humantime
  delete timeNode.dataset.loading
}

function fillChallengerStats(challenger, stats) {
  const { currentStreak, contributionsPerDay, totalContributes, daysMissed } =
    stats

  const statsNode = challenger.querySelector('.js-challenger-stats')
  const currentStreakNode = statsNode.querySelector(
    '.js-challenger-current-streak'
  )
  const contributionsPerDayNode = statsNode.querySelector(
    '.js-challenger-contributions-per-day'
  )
  const totalContributesNode = statsNode.querySelector(
    '.js-challenger-total-contributes'
  )
  const daysMissedNode = statsNode.querySelector('.js-challenger-days-missed')

  const statsMap = [
    [currentStreak, currentStreakNode],
    [contributionsPerDay, contributionsPerDayNode],
    [totalContributes, totalContributesNode],
    [daysMissed, daysMissedNode]
  ]

  statsMap.forEach(([stat, statNode]) => {
    if (!statNode) return

    statNode.innerText = stat
    delete statNode.dataset.loading
  })
}

function fillChallengerRating(challenger, rating) {
  const ratingNode = challenger.querySelector('.js-challenger-rating')
  const starsNodes = ratingNode.querySelectorAll('.js-challenger-rating-star')

  delete ratingNode.dataset.loading

  starsNodes.forEach((starNode, idx) => {
    if (idx < rating) {
      starNode.classList.replace(
        'rating__star--default',
        'rating__star--filled'
      )
    }
  })
}

function fillChallengerActivity(challenger, activity) {
  const activityEntries = Object.entries(activity)

  const activityNode = challenger.querySelector('.js-challenger-activity')
  const activityItemsNodes = activityNode.querySelectorAll(
    '.js-challenger-activity-item'
  )

  delete activityNode.dataset.loading

  if (!activityEntries.length) {
    return
  }

  activityItemsNodes.forEach((activityItemNode, idx) => {
    const [day, data] = activityEntries[idx]
    const titleNode = activityItemNode.querySelector(
      '.js-challenger-activity-title'
    )
    titleNode.textContent = day

    activityItemNode.setAttribute('data-popper', '')
    activityItemNode.setAttribute('data-popper-title', data.date)
    activityItemNode.setAttribute('data-popper-description', data.contributes)

    const scalePartNode = activityItemNode.querySelector(
      '.js-challenger-activity-scale'
    )

    scalePartNode.classList.add(
      {
        0: 'activity__scale--danger',
        1: 'activity__scale--warning',
        2: 'activity__scale--warning',
        3: 'activity__scale--warning',
        4: 'activity__scale--default',
        5: 'activity__scale--default',
        6: 'activity__scale--default'
      }[data.activity]
    )

    const scalePartsNodes = activityItemNode.querySelectorAll(
      '.js-challenger-activity-scale-part'
    )

    ;[...scalePartsNodes].reverse().forEach((scaleNode, idx) => {
      if (idx < data.activity) {
        scaleNode.classList.replace(
          'activity__scale-part--empty',
          'activity__scale-part--filled'
        )
      }
    })
  })
}

function fillChallengerAchievements(challenger, achievements) {
  const achievementsNode = challenger.querySelector(
    '.js-challenger-achievements'
  )
  const achievementsListNode = challenger.querySelector(
    '.js-challenger-achievements-list'
  )

  delete achievementsNode.dataset.loading

  Object.entries(achievements).forEach(
    ([achievement, { progress, completed, name, description }]) => {
      const achievementNode = achievementsListNode.querySelector(
        `[data-challenger-achievement="${achievement}"]`
      )

      if (!achievementNode) {
        return
      }

      const progressCircleNode = achievementNode.querySelector(
        '.js-achievement-progress-circle'
      )

      achievementNode.classList.add(
        completed
          ? 'achievements__item--completed'
          : 'achievements__item--default'
      )
      achievementNode.dataset.popper = true
      achievementNode.dataset.popperTitle = `${completed ? '✔ ' : ''}${name}`
      achievementNode.dataset.popperDescription = description

      if (!progressCircleNode) {
        return
      }

      progressCircleNode.setAttribute(
        'stroke-dashoffset',
        `${(100 - progress) * 1.13}`
      )
    }
  )
}

async function activateTooltips() {
  await loadScript('/vendor/popper.min.js')

  const tooltipNodes = [...document.querySelectorAll('[data-popper]')]

  const tooltipNode = document.querySelector('.tooltip')
  const tooltipTitle = tooltipNode.querySelector('.js-tooltip-title')
  const tooltipDescription = tooltipNode.querySelector(
    '.js-tooltip-description'
  )

  if (tooltipNodes.length) {
    tooltipNodes.forEach((node) => {
      const show = (e) => {
        e.stopPropagation()

        const title = node.getAttribute('data-popper-title')
        const description = node.getAttribute('data-popper-description')

        tooltipTitle.innerText = title || ''
        tooltipDescription.innerHTML = description || ''

        tooltipNode.classList.remove('tooltip--hidden')
        tooltipNode.classList.add('tooltip--visible')

        Popper.createPopper(node, tooltipNode, {
          placement: 'top',
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 8]
              }
            }
          ]
        })
      }

      const hide = (e) => {
        e.stopPropagation()

        tooltipNode.classList.remove('tooltip--visible')
        tooltipNode.classList.add('tooltip--hidden')
      }

      node.addEventListener('mouseenter', show)
      node.addEventListener('focus', show)
      node.addEventListener('click', show)
      node.addEventListener('mouseleave', hide)
      node.addEventListener('blur', hide)
      document.body.addEventListener('click', hide)
    })
  }
}

function activateLoadingState() {
  // Date reset
  const timeNode = document.querySelector('.js-header-time')
  timeNode.removeAttribute('datetime')
  timeNode.removeAttribute('datatype')
  timeNode.textContent = ''
  timeNode.dataset.loading = ''

  // Stats reset
  ;[
    ...document.querySelectorAll('.js-challenger-current-streak'),
    ...document.querySelectorAll('.js-challenger-contributions-per-day'),
    ...document.querySelectorAll('.js-challenger-total-contributes'),
    ...document.querySelectorAll('.js-challenger-days-missed')
  ].forEach((node) => {
    node.dataset.loading = ''
  })

  // Rating reset
  document
    .querySelectorAll('.js-challenger-rating')
    .forEach((ratingNode) => (ratingNode.dataset.loading = ''))
  document
    .querySelectorAll('.js-challenger-rating-star')
    .forEach((starNode) => {
      starNode.classList.add('rating__star--default')
      starNode.classList.remove('rating__star--filled')
    })

  // Activity reset
  document
    .querySelectorAll('.js-challenger-activity')
    .forEach((activityNode) => (activityNode.dataset.loading = ''))
  document
    .querySelectorAll('.js-challenger-activity-item')
    .forEach((activityItemNode) => {
      delete activityItemNode.dataset.popper
      delete activityItemNode.dataset.popperTitle
      delete activityItemNode.dataset.popperDescription

      const scaleNode = activityItemNode.querySelector(
        '.js-challenger-activity-scale'
      )

      scaleNode.classList.remove(
        'activity__scale--default',
        'activity__scale--warning',
        'activity__scale--danger'
      )

      activityItemNode
        .querySelectorAll('.js-challenger-activity-scale-part')
        .forEach((scalePartNode) => {
          scalePartNode.classList.replace(
            'activity__scale-part--filled',
            'activity__scale-part--empty'
          )
        })
    })

  // Achievements reset
  document
    .querySelectorAll('.js-challenger-achievements')
    .forEach((achievementsNode) => (achievementsNode.dataset.loading = ''))

  document
    .querySelectorAll('[data-challenger-achievement]')
    .forEach((achievementNode) => {
      delete achievementNode.dataset.popper
      delete achievementNode.dataset.popperTitle
      delete achievementNode.dataset.popperDescription

      achievementNode.classList.replace(
        'achievements__item--completed',
        'achievements__item--default'
      )

      achievementNode
        .querySelector('.js-achievement-progress-circle')
        .setAttribute('stroke-dashoffset', '0')
    })
}

async function activatePullToRefresh() {
  await loadScript('/vendor/pulltorefresh.min.js')

  PullToRefresh.init({
    mainElement: document.querySelector('.js-pull-to-refresh'),
    onRefresh: async () => {
      activateLoadingState()

      await fetchAndFillInfo()
      await activateTooltips()
    }
  })
}

function activateChallengerFavorites() {
  document.querySelectorAll('.js-challenger-like').forEach((likeButtonNode) => {
    likeButtonNode.addEventListener('click', (event) => {
      event.preventDefault()
      const challengerNode = event.currentTarget.closest('.js-challenger')

      if (!challengerNode) {
        return
      }

      const challengerGithub = challengerNode.dataset.challengerGithub
      const favorite = getFavoriteChallenger()

      if (challengerGithub === favorite) {
        removeChallengerFromFavorites()
      } else {
        addChallengerToFavorites(challengerGithub)
      }

      sortChallengersByFavorites()
    })
  })

  sortChallengersByFavorites()
}

function sortChallengersByFavorites() {
  const challengers = document.querySelectorAll('.js-challenger')
  const favorite = getFavoriteChallenger()

  challengers.forEach((challengerNode) => {
    const challengerGithub = challengerNode.dataset.challengerGithub
    const isFavorite = favorite === challengerGithub

    const challengerLike = challengerNode.querySelector('.js-challenger-like')

    challengerNode.style.order = isFavorite ? '0' : '1'

    if (favorite) {
      challengerLike.classList.add(isFavorite ? 'active' : 'inactive')
    } else {
      challengerLike.classList.remove('active', 'inactive')
    }
  })
}

function getFavoriteChallenger() {
  return localStorage.getItem('FAVORITE_CHALLENGER_GITHUB')
}

function addChallengerToFavorites(challengerName) {
  return localStorage.setItem('FAVORITE_CHALLENGER_GITHUB', challengerName)
}

function removeChallengerFromFavorites() {
  return localStorage.removeItem('FAVORITE_CHALLENGER_GITHUB')
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then(function (registration) {
        console.log('Registration successful, scope is:', registration.scope)
      })
      .catch(function (error) {
        console.log('Service worker registration failed, error:', error)
      })
  }
}

async function loadScript(path) {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = path
  script.async = true
  document.head.appendChild(script)
  script.remove()

  return new Promise((resolve, reject) => {
    script.onload = resolve
    script.onerror = reject
  })
}

class API {
  static _baseURL = '/api/challenger'

  static async fetchChallengersFullInfo() {
    try {
      return new Promise((resolve, reject) => {
        fetch(`${API._baseURL}/full-info`)
          .then((response) => resolve(response.json()))
          .catch((err) => reject(err))
      })
    } catch (e) {
      console.error(e)
    }
  }
}

window.addEventListener('load', main)
