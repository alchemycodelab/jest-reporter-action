const { getInput, info, setFailed } = require('@actions/core');
const fs = require('fs')

try {
  const token = getInput('token');
  const reporter = fs.readFileSync(`${__dirname}/Reporter.js`, { encoding: 'utf8' }).replace('TOKEN', token);
  console.log(`${process.env.GITHUB_WORKSPACE}/Reporter.js`)
  fs.writeFileSync(`${process.env.GITHUB_WORKSPACE}/Reporter.js`, reporter);
  fs.writeFileSync(`${process.env.GITHUB_WORKSPACE}/jest.config.js`, `
module.exports = {
  reporters: ['default', \`<rootDir>/Reporter.js\`]
}`)
} catch(err) {
  setFailed(err.message);
}
