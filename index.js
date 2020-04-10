const { getInput, info, setFailed } = require('@actions/core');
const fs = require('fs')

try {
  const token = getInput('token');
  const reporter = fs.readFileSync('./Reporter.js', { encoding: 'utf8' }).replace('TOKEN', token);
  fs.writeFileSync(`${process.env.GITHUB_WORKSPACE}/Reporter.js`, reporter);
  fs.writeFileSync(`${process.env.GITHUB_WORKSPACE}/jest.config.js`, `
module.exports = {
  reporters: ['default', \`<rootDir>/Reporter.js\`]
}`)
} catch(err) {
  setFailed(err.message);
}
