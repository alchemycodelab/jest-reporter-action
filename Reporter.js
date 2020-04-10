const { info } = require('@actions/core');
const { GitHub } = require('@actions/github');

const octocat = new GitHub('TOKEN');

module.exports = class Reporter {
  onRunComplete(contexts, results) {
    const annotations = results.testResults
      .flatMap(suiteResult => suiteResult.testResults
          .filter(({ status }) => status === 'failed')
          .map(({ failureMessages, location }) => ({
            path: suiteResult.testFilePath,
            start_line: location.line,
            end_line: location.line,
            start_column: location.column,
            end_column: location.column,
            annotation_level: 'failure',
            message: failureMessages.join('')
          })));

    return octocat.checks.listForRef({
      ref: process.env.GITHUB_SHA,
      owner: process.env.GITHUB_REPOSITORY.split('/')[0],
      repo: process.env.GITHUB_REPOSITORY.split('/')[1]
    })
      .then(checks => {
        console.log(checks)
        return checks.data.check_runs.find(({ name }) => name === 'build')
      })
      .then(check => {
        return octocat.checks.update({
          check_run_id: check.id,
          owner: process.env.GITHUB_REPOSITORY.split('/')[0],
          repo: process.env.GITHUB_REPOSITORY.split('/')[1],
          output: {
            summary: 'build and test node app',
            title: 'build',
            annotations
          }
        })
      })
      .then(console.log)
    
  }
};
