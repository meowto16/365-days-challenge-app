const main = async function () {
  fillCurrentDate()

  const challengers = document.querySelectorAll('.js-challenger')

  const response = await API.fetchChallengersFullInfo()

  activateTooltips()
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
  })
}

function fillChallengerActivity(challenger, activity) {}

function activateTooltips() {
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

class API {
  static _baseURL = '/api/challenger'

  static async fetchChallengersFullInfo() {
    try {
      await fetch(`${API._baseURL}/full-info`)
    } catch (e) {
      console.error(e)
    }
  }
}

window.addEventListener('load', main)
