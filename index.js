const { getInput, info, setFailed } = require('@actions/core');

try {
  const token = getInput('token');
  console.log(token)
  info(`##[add-matcher]${__dirname}/jest.json`)
} catch(err) {
  setFailed(err.message);
}
