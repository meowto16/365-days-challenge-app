module.exports = () => {
  if (!process.env.GITHUB_API_KEY) {
    console.error('You should set GITHUB_API_KEY in .env. More: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token')

    process.exit(1)
  }
}
