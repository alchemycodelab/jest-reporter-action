const { getInput, info, setFailed } = require('@actions/core');
const fs = require('fs');
const { execSync } = require('child_process');

try {
  execSync('npm i @actions/core @actions/github');
  const token = getInput('token');
  const { jest } = JSON.parse(fs.readFileSync(`${process.env.GITHUB_WORKSPACE}/package.json`, { encoding: 'utf8' }))
  const config = {
    ...jest,
    reporters: ['default', '<rootDir>/Reporter.js']
  }
  const reporter = fs.readFileSync(`${__dirname}/Reporter.js`, { encoding: 'utf8' })
    .replace('TOKEN', token);
  fs.writeFileSync(`${process.env.GITHUB_WORKSPACE}/Reporter.js`, reporter);
  fs.writeFileSync(`${process.env.GITHUB_WORKSPACE}/jest.config.js`, `
module.exports = ${JSON.stringify(config)}`);
} catch(err) {
  setFailed(err.message);
}
