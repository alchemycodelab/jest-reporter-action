const { setFailed } = require('@actions/core');
module.exports = class Reporter {
  onRunComplete(contexts, results) {
    results.testResults.forEach(suiteResult => {
      suiteResult.testResults
        .filter(({ status }) => status === 'failed')
        .forEach(({ failureMessages, location }) => {
          setFailed(`${suiteResult.testFilePath} ${location.line}:${location.column} ${failureMessages.join('')}\n\n%\n\n`);
        });
    });
  }
};
