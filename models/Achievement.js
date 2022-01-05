class Achievement {
  constructor(code, name, description, icon) {
    this.code = code
    this.name = name
    this.description = description
    this.icon = icon
    this.completed = false
    this.progress = 0
  }
}

module.exports = Achievement
