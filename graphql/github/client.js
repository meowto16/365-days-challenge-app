const { GraphQLClient } = require("graphql-request");

const githubClient = new GraphQLClient('https://api.github.com/graphql', {
  headers: {
    authorization: `Bearer ${process.env.GITHUB_API_KEY}`,
  },
})

module.exports = githubClient
