const { getInput, info, setFailed } = require('@actions/core');
const { execSync } = require('child_process');

try {
  const flags = getInput('flags');
  info(`##[add-matcher]${__dirname}/jest.json`)
  const output = execSync(`npm run test -- --reporters="default" --reporters="${__dirname}/Reporter.js" ${flags}`, { encoding: 'utf8' });
  info(output);
} catch(err) {
  setFailed(err.message);
}
