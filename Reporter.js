const { info } = require('@actions/core');
const { GitHub } = require('@actions/github');

const octocat = new GitHub(TOKEN);

module.exports = class Reporter {
  onRunComplete(contexts, results) {
    console.log(process.env.GITHUB_TOKEN);
    const annotations = results.testResults
      .flatMap(suiteResult => suiteResult.testResults
          .filter(({ status }) => status === 'failed')
          .map(({ failureMessages, location }) => ({
            path: suiteResult.testFilePath,
            start_line: location.line,
            end_line: location.line,
            start_column: location.column,
            end_column: location.column,
            annotation_lever: 'failure',
            message: failureMessages.join('')
          })));

    return octocat.checks.update({
      output: {
        annotations
      }
    })
  }
};
