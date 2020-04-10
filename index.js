const { info, setFailed } = require('@actions/core');

try {
  info(`##[add-matcher]${__dirname}/jest.json`)
} catch(err) {
  setFailed(err.message);
}
