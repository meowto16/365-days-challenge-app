const Achievement = require('../models/Achievement')
const githubGraphQLClient = require('../graphql/github/client')
const { gql } = require('graphql-request')
const plural = require('plural-ru')

class Challenger {
  constructor(github, vk, info, meta) {
    this._contributions = new Map()
    this._github = github
    this._vk = vk
    this.info = info
    this.meta = meta
    this.achievements = [
      new Achievement(
        '1-day-contribute-in-a-row',
        'First step',
        '1 day gone',
        '/svg/sprite.svg#medal-1'
      ),
      new Achievement(
        '7-day-contribute-in-a-row',
        'Week hero',
        '7 days in a row',
        '/svg/sprite.svg#medal-2'
      ),
      new Achievement(
        '30-day-contribute-in-a-row',
        'Month terminator',
        '30 days in a row',
        '/svg/sprite.svg#medal-3'
      ),
      new Achievement(
        '90-day-contribute-in-a-row',
        'Tryhard',
        '90 days in a row',
        '/svg/sprite.svg#medal-4'
      ),
      new Achievement(
        '180-day-contribute-in-a-row',
        'Demigod',
        '180 days in a row',
        '/svg/sprite.svg#medal-5'
      ),
      new Achievement(
        '365-day-contribute-in-a-row',
        'God',
        '365 days in a row',
        '/svg/sprite.svg#medal-6'
      ),

      new Achievement(
        '25-contributes-total',
        'Tenten',
        '25 contributes in total',
        '/svg/sprite.svg#medal-c-1'
      ),
      new Achievement(
        '100-contributes-total',
        'Killing spree',
        '100 contributes in total',
        '/svg/sprite.svg#medal-c-2'
      ),
      new Achievement(
        '250-contributes-total',
        'Rampage',
        '250 contributes in total',
        '/svg/sprite.svg#medal-c-3'
      ),
      new Achievement(
        '500-contributes-total',
        'Dominating',
        '500 contributes in total',
        '/svg/sprite.svg#medal-c-4'
      ),
      new Achievement(
        '1000-contributes-total',
        'Unstoppable',
        '1000 contributes in total',
        '/svg/sprite.svg#medal-c-5'
      ),
      new Achievement(
        '2000-contributes-total',
        'Godlike',
        '2000 contributes in total',
        '/svg/sprite.svg#medal-c-6'
      ),

      new Achievement(
        '5-contributes-in-a-day',
        'Trainee',
        '5 contributes in a day',
        '/svg/sprite.svg#ribbon-1'
      ),
      new Achievement(
        '10-contributes-in-a-day',
        'Junior',
        '10 contributes in a day',
        '/svg/sprite.svg#ribbon-2'
      ),
      new Achievement(
        '15-contributes-in-a-day',
        'Pre-middle',
        '15 contributes in a day',
        '/svg/sprite.svg#ribbon-3'
      ),
      new Achievement(
        '20-contributes-in-a-day',
        'Middle',
        '20 contributes in a day',
        '/svg/sprite.svg#ribbon-4'
      ),
      new Achievement(
        '30-contributes-in-a-day',
        'Upper-middle',
        '30 contributes in a day',
        '/svg/sprite.svg#ribbon-5'
      ),
      new Achievement(
        '50-contributes-in-a-day',
        'Senior',
        '50 contributes in a day',
        '/svg/sprite.svg#ribbon-6'
      )
    ]
  }

  async getFullInformation() {
    await this.fetchContributes()

    const streak = this.calculateCurrentStreak()
    const perDay = this.calculateContributionsPerDay()
    const daysMissed = this.calculateContributionsDaysMissed()
    const totalContributes = this.calculateAllContributions()

    const achievements = this.calculateAchievements()
    const secretAchievements = this.calculateSecretAchievements()
    const activity = this.calculateActivity()
    const rating = this.calculateRating()

    const totalWeekContributes = Object.values(activity).reduce(
      (acc, day) => acc + day.count,
      0
    )

    return {
      stats: {
        currentStreak:
          typeof streak === 'number'
            ? `${streak} ${plural(streak, 'day', 'days')}`
            : null,
        contributionsPerDay: typeof perDay === 'number' ? `${perDay}` : null,
        daysMissed: typeof daysMissed === 'number' ? `${daysMissed}` : null,
        totalContributes:
          typeof totalContributes === 'number' ? `${totalContributes}` : null,
        totalWeekContributes:
          typeof totalWeekContributes === 'number'
            ? `${totalWeekContributes}`
            : null
      },
      achievements,
      secretAchievements,
      rating,
      activity
    }
  }

  async fetchContributes() {
    const { user } = await this.#fetchInfo()

    this._contributions = Challenger.#getYearContributionsMap(
      user?.contributionsCollection?.contributionCalendar?.weeks
    )
  }

  async #fetchInfo() {
    return await githubGraphQLClient.request(
      gql`
        query ($userName: String!, $from: DateTime!, $to: DateTime!) {
          user(login: $userName) {
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
      `,
      {
        userName: this._github,
        from: this?.meta?.startDate || new Date('2022-01-01'),
        to: (() => {
          const today = new Date()
          const yearEnd = this?.meta?.endDate

          return today > yearEnd ? yearEnd.toISOString() : today.toISOString()
        })()
      }
    )
  }

  static #getYearContributionsMap(contributionsCalendarWeeks) {
    return contributionsCalendarWeeks.reduce((map, week) => {
      week.contributionDays.forEach((day) => {
        map.set(day.date.toString(), day.contributionCount)
      })
      return map
    }, new Map())
  }

  checkHaveContributesToday() {
    return [...this._contributions.values()].slice(-1)[0] !== 0
  }

  calculateCurrentStreak() {
    const values = [...this._contributions.values()]
    const streak = values
      .slice(0, values.length - 1)
      .reduce((count, current) => {
        return current !== 0 ? count + 1 : 0
      }, 0)

    const lastDayContributed = values[values.length - 1] ? 1 : 0

    return streak + lastDayContributed
  }

  calculateContributionsPerDay() {
    const total = [...this._contributions.values()].reduce(
      (count, current) => count + current,
      0
    )
    if (!this._contributions.size) return 0

    return +(total / this._contributions.size).toFixed(2)
  }

  calculateContributionsDaysMissed() {
    const values = [...this._contributions.values()]

    return values.slice(0, values.length - 1).filter((count) => count === 0)
      .length
  }

  calculateAchievements() {
    const contributesTotal = (() => {
      return [...this._contributions.values()].reduce(
        (acc, cur) => acc + cur,
        0
      )
    })()

    const maxContributesDaysInARow = (() => {
      let count = 0
      let lastIdx = 0

      const streaks = [...this._contributions.values()].reduce(
        (acc, cur, idx, arr) => {
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

          return acc
        },
        []
      )

      return streaks.length ? Math.max(...streaks) : 0
    })()

    const maxContributesInADay = (() => {
      return Math.max(...this._contributions.values())
    })()

    const getProgress = (progress) => {
      if (typeof progress !== 'number') return 0
      progress *= 100

      if (progress > 100) return 100
      if (progress < 0) return 0
      return progress
    }

    const achievementMap = {
      '1-day-contribute-in-a-row': maxContributesDaysInARow / 1,
      '7-day-contribute-in-a-row': maxContributesDaysInARow / 7,
      '30-day-contribute-in-a-row': maxContributesDaysInARow / 30,
      '90-day-contribute-in-a-row': maxContributesDaysInARow / 90,
      '180-day-contribute-in-a-row': maxContributesDaysInARow / 180,
      '365-day-contribute-in-a-row': maxContributesDaysInARow / 365,

      '5-contributes-in-a-day': maxContributesInADay / 5,
      '10-contributes-in-a-day': maxContributesInADay / 10,
      '15-contributes-in-a-day': maxContributesInADay / 15,
      '20-contributes-in-a-day': maxContributesInADay / 20,
      '30-contributes-in-a-day': maxContributesInADay / 30,
      '50-contributes-in-a-day': maxContributesInADay / 50,

      '25-contributes-total': contributesTotal / 25,
      '100-contributes-total': contributesTotal / 100,
      '250-contributes-total': contributesTotal / 250,
      '500-contributes-total': contributesTotal / 500,
      '1000-contributes-total': contributesTotal / 1000,
      '2000-contributes-total': contributesTotal / 2000
    }

    const achievements = [...this.achievements]

    return achievements.reduce((acc, achievement) => {
      const progress = getProgress(achievementMap[achievement.code])

      acc[achievement.code] = {
        progress,
        completed: progress === 100,
        name: achievement.name,
        description: achievement.description
      }

      return acc
    }, {})
  }

  calculateSecretAchievements() {
    const values = [...this._contributions.values()]
    const secretAchievements = [...this.secretAchievements]

    secretAchievements.forEach((secretAchievement) => {
      switch (secretAchievement.code) {
        case 'takes-it-easy':
          const slice = values.slice(6)

          if (slice.length === 0) {
            return
          }

          const oneContributeIn7DaysInARow = slice.some((day7, idx) => {
            const startIdx = idx
            const endIdx = startIdx + 6

            const week = [...values.slice(startIdx, endIdx), day7]

            return (
              week.length === 7 &&
              week.every((dayContributes) => dayContributes === 1)
            )
          })

          secretAchievement.progress = oneContributeIn7DaysInARow ? 100 : 0
          secretAchievement.completed = secretAchievement.progress === 100

          return
        case 'birthday-commit':
          const birthdayDate = this?.info?.birthday
          if (!(birthdayDate instanceof Date)) return

          const birthdayYear = String(birthdayDate.getFullYear())
          const birthdayMonth = String(birthdayDate.getMonth() + 1).padStart(
            2,
            '0'
          )
          const birthdayDay = String(birthdayDate.getDate()).padStart(2, '0')

          const birthdayContribution = this._contributions.get(
            `${birthdayYear}-${birthdayMonth}-${birthdayDay}`
          )
          const isCommitedInBirthday =
            typeof birthdayContribution === 'number' &&
            birthdayContribution >= 1

          secretAchievement.progress = isCommitedInBirthday ? 100 : 0
          secretAchievement.completed = secretAchievement.progress === 100

          return
      }
    })

    return secretAchievements.reduce((acc, achievement) => {
      acc[achievement.code] = {
        progress: achievement.progress,
        completed: achievement.progress === 100
      }

      return acc
    })
  }

  calculateRating() {
    const lastWeekContributionsCount = [...this._contributions.values()]
      .slice(-7)
      .reduce((acc, cur) => acc + cur, 0)

    if (lastWeekContributionsCount >= 40) return 5
    if (lastWeekContributionsCount >= 32) return 4
    if (lastWeekContributionsCount >= 24) return 3
    if (lastWeekContributionsCount >= 16) return 2
    if (lastWeekContributionsCount >= 8) return 1

    return 0
  }

  calculateActivity() {
    const lastWeekContributes = [...this._contributions].slice(-7)
    return lastWeekContributes.reduce((acc, [date, count]) => {
      const day = new Date(date).toDateString().slice(0, 3)
      const activity = (() => {
        if (count >= 6) return 6
        if (count >= 5) return 5
        if (count >= 4) return 4
        if (count >= 3) return 3
        if (count >= 2) return 2
        if (count >= 1) return 1

        return 0
      })()
      acc[day] = {
        count,
        activity,
        date: `${day} (${date})`,
        contributes:
          count === 0
            ? 'No contributes'
            : `${count} ${plural(count, 'contribute', 'contributes')}`
      }
      return acc
    }, {})
  }

  calculateAllContributions() {
    if (!this._contributions.size) return 0

    return [...this._contributions.values()].reduce(
      (count, current) => count + current,
      0
    )
  }

  get github() {
    return this._github
  }

  get vk() {
    return this._vk
  }
}

module.exports = Challenger
