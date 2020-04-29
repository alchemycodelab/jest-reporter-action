const { info } = require('@actions/core');
const { GitHub } = require('@actions/github');

const [owner, repo] = process.env.GITHUB_REPOSITORY;
const ref = process.env.GITHUB_SHA;
const workingDirectory = process.env.GITHUB_WORKSPACE;

module.exports = class Reporter {
  onRunComplete(contexts, results) {
    if(!results.testResults.length) return;
    const octocat = new GitHub('TOKEN');

    const annotations = results.testResults
      .flatMap(suiteResult => suiteResult.testResults
          .filter(({ status }) => status === 'failed')
          .map(({ failureMessages, location }) => ({
            path: suiteResult.testFilePath.replace(`${workingDirectory}/`, ''),
            start_line: location.line,
            end_line: location.line,
            start_column: location.column,
            end_column: location.column,
            annotation_level: 'failure',
            message: failureMessages.join('')
          })));

    return octocat.checks.listForRef({
      ref,
      owner,
      repo
    })
      .then(checks => checks.data.check_runs.find(({ name }) => name === 'build'))
      .then(check => octocat.checks.update({
          check_run_id: check.id,
          owner,
          repo,
          output: {
            summary: 'build and test node app',
            title: 'build',
            annotations
          }
        }));
  }
};
