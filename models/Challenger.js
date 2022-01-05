const Achievement = require("../models/Achievement");
const githubGraphQLClient = require('../graphql/github/client')
const {gql} = require("graphql-request");
const plural = require('plural-ru')

class Challenger {
  constructor(github, info, achievements) {
    this._github = github
    this.info = info
    this._achievements = [
      new Achievement('1-day-contribute-in-a-row', 'First step', '1 day gone', '/svg/sprite.svg#medal-1'),
      new Achievement('7-day-contribute-in-a-row', 'Week hero', 'contribute 7 days in a row', '/svg/sprite.svg#medal-2'),
      new Achievement('30-day-contribute-in-a-row', 'Month terminator', 'contribute 30 days in a row', '/svg/sprite.svg#medal-3'),
      new Achievement('90-day-contribute-in-a-row', 'Tryhard', 'contribute 90 days in a row', '/svg/sprite.svg#medal-4'),
      new Achievement('180-day-contribute-in-a-row', 'Demigod', 'contribute 180 days in a row', '/svg/sprite.svg#medal-5'),
      new Achievement('365-day-contribute-in-a-row', 'God', 'contribute 365 days in a row', '/svg/sprite.svg#medal-6'),
      new Achievement('5-contributes-in-a-day', 'Trainee', 'make 5 contributes in a day', '/svg/sprite.svg#ribbon-1'),
      new Achievement('10-contributes-in-a-day', 'Junior', 'make 10 contributes in a day', '/svg/sprite.svg#ribbon-2'),
      new Achievement('15-contributes-in-a-day', 'Pre-middle', 'make 15 contributes in a day', '/svg/sprite.svg#ribbon-3'),
      new Achievement('20-contributes-in-a-day', 'Middle', 'make 20 contributes in a day', '/svg/sprite.svg#ribbon-4'),
      new Achievement('30-contributes-in-a-day', 'Upper-middle', 'make 30 contributes in a day', '/svg/sprite.svg#ribbon-5'),
      new Achievement('50-contributes-in-a-day', 'Senior', 'make 50 contributes in a day', '/svg/sprite.svg#ribbon-6'),
    ]
  }

  async getFullInformation() {
    const {user} = await this.#fetchInfo()
    const contributions = Challenger.#getYearContributionsMap(
      user?.contributionsCollection?.contributionCalendar?.weeks
    )

    const streak = Challenger.#calculateCurrentStreak(contributions)
    const perDay = Challenger.#calculateContributionsPerDay(contributions)
    const daysMissed = Challenger.#calculateContributionsDaysMissed(contributions)

    const achievements = this.#calculateAchievements(contributions)
    const activity = this.#calculateActivity(contributions)
    const rating = this.#calculateRating(contributions)

    return {
      ...this.info,
      stats: {
        currentStreak: typeof streak === 'number' ? `${streak} ${plural(streak, 'day', 'days')}` : null,
        contributionsPerDay: typeof perDay === 'number' ? `${perDay}` : null,
        // lastActive: '5 hours ago',
        daysMissed: typeof daysMissed === 'number' ? `${daysMissed}` : null,
      },
      achievements,
      rating,
      activity,
    }
  }

  async #fetchInfo() {
    return await githubGraphQLClient.request(gql`
      query($userName:String!, $from:DateTime!, $to:DateTime!) {
        user(login: $userName){
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionLevel
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `, {
      userName: this._github,
      from: new Date('2022-01-01'),
      to: (() => {
        const today = new Date()
        const yearEnd = new Date('2022-12-31')

        return today > yearEnd ? yearEnd.toISOString() : today.toISOString()
      })()
    })
  }

  static #getYearContributionsMap(contributionsCalendarWeeks) {
    return contributionsCalendarWeeks.reduce((map, week) => {
      week.contributionDays.forEach(day => map.set([day.date], day.contributionCount))
      return map
    }, new Map())
  }

  static #calculateCurrentStreak(contributions) {
    return [...contributions.values()].reduce((count, current) => current === 0 ? 0 : count + 1, 0)
  }

  static #calculateContributionsPerDay(contributions) {
    const total = [...contributions.values()].reduce((count, current) => count + current, 0)
    return total / contributions.size
  }

  static #calculateContributionsDaysMissed(contributions) {
    return [...contributions.values()].filter(count => count === 0).length
  }

  #calculateAchievements(contributions) {
    const maxContributesDaysInARow = (() => {
      let count = 0
      let lastIdx = 0

      const streaks = [...contributions.values()].reduce((acc, cur, idx, arr) => {

        if (idx === arr.length - 1 && count) {
          acc.push(count)
          return acc
        }

        if (cur > 0) {
          count += 1
          return acc
        }

        acc[lastIdx] = count
        lastIdx++
        count = 0
      }, [])

      return streaks.length ? Math.max(...streaks) : 0
    })()

    const maxContributesInADay = (() => {
      return Math.max(...contributions.values())
    })()

    const getProgress = (progress) => {
      if (typeof progress !== 'number') return 0
      if (progress > 100) return 100
      if (progress < 0) return 0
      return progress
    }

    this._achievements.map(achievement => {
      switch (achievement.code) {
        case '1-day-contribute-in-a-row':
          achievement.progress = getProgress(maxContributesDaysInARow / 1 * 100)
          break;
        case '7-day-contribute-in-a-row':
          achievement.progress = getProgress(maxContributesDaysInARow / 7 * 100)
          break;
        case '30-day-contribute-in-a-row':
          achievement.progress = getProgress(maxContributesDaysInARow / 30 * 100)
          break;
        case '90-day-contribute-in-a-row':
          achievement.progress = getProgress(maxContributesDaysInARow / 90 * 100)
          break;
        case '180-day-contribute-in-a-row':
          achievement.progress = getProgress(maxContributesDaysInARow / 180 * 100)
          break;
        case '365-day-contribute-in-a-row':
          achievement.progress = getProgress(maxContributesDaysInARow / 365 * 100)
          break;
        case '5-contributes-in-a-day':
          achievement.progress = getProgress(maxContributesInADay / 5 * 100)
          break;
        case '10-contributes-in-a-day':
          achievement.progress = getProgress(maxContributesInADay / 10 * 100)
          break;
        case '15-contributes-in-a-day':
          achievement.progress = getProgress(maxContributesInADay / 15 * 100)
          break;
        case '20-contributes-in-a-day':
          achievement.progress = getProgress(maxContributesInADay / 20 * 100)
          break;
        case '30-contributes-in-a-day':
          achievement.progress = getProgress(maxContributesInADay / 30 * 100)
          break;
        case '50-contributes-in-a-day':
          achievement.progress = getProgress(maxContributesInADay / 50 * 100)
          break;
      }
      achievement.completed = achievement.progress === 100
    })

    return this._achievements
  }

  #calculateRating(contributions) {
    const lastWeekContributionsCount = [...contributions.values()].reduce((acc, cur) => acc + cur, 0)

    if (lastWeekContributionsCount >= 48) return 5
    if (lastWeekContributionsCount >= 36) return 4
    if (lastWeekContributionsCount >= 24) return 3
    if (lastWeekContributionsCount >= 12) return 2
    if (lastWeekContributionsCount >= 6) return 1

    return 0
  }

  #calculateActivity(contributions) {
    const lastWeekContributes = [...contributions].slice(-7)
    return lastWeekContributes.reduce((acc, [date, count]) => {
      const day = new Date(date).toDateString().slice(0, 3)
      const activity = (() => {
        if (count >= 18) return 6
        if (count >= 15) return 5
        if (count >= 12) return 4
        if (count >= 9) return 3
        if (count >= 6) return 2
        if (count >= 3) return 1

        return 0
      })()
      acc[day] = activity
      return acc
    }, {})
  }
}

module.exports = Challenger
