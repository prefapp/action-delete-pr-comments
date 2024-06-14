const core = require('@actions/core');
const github = require('@actions/github');
const debug = require('debug')('delete-comments');

async function main() {
    try {

        debug('Starting delete-comments action')

        debug('Parsing inputs')
        // `github_token` input defined in action metadata file
        const token = core.getInput('github_token');
        // `pr_number` input defined in action metadata file
        const prNumber = core.getInput('pr_number');

        debug('Initializing octokit')
        // List the pull request comments in the issue
        const octokit = github.getOctokit(token);

        debug('Fetching comments')
        const { data: comments } = await octokit.rest.issues.listComments({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            issue_number: prNumber
        });

        debug('Filtering comments')
        // Filter the comments
        const filter = core.getInput('filter');
        const filteredComments = filter
            ? comments.filter(comment => comment.body.includes(filter))
            : comments;

        debug('Deleting comments')
        // Delete the comments
        // ...
    } catch (error) {
        core.setFailed(error.message);
    }
}

main();
