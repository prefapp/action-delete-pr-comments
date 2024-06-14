const core = require('@actions/core');
const github = require('@actions/github');
const debug = require('debug')('delete-comments');

async function main() {
    try {

        debug('Starting delete-comments action')

        debug('Parsing inputs')
        // `github_token` input defined in action metadata file
        const token = core.getInput('github_token');
        if (!token) throw new Error('Missing `github_token` input');
        // `pr_number` input defined in action metadata file
        const prNumber = core.getInput('pr_number');
        if (!prNumber) throw new Error('Missing `pr_number` input');

        debug('Initializing octokit')
        // List the pull request comments in the issue
        const octokit = github.getOctokit(token);

        const { owner, repo } = github.context.repo;

        debug(`Fetching comments in https://github.com/${owner}/${repo}/pull/${prNumber}`)

        const { data: comments } = await octokit.rest.issues.listComments({
            owner,
            repo,
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

        for (const comment of filteredComments) {
            await octokit.rest.issues.deleteComment({
                owner,
                repo,
                comment_id: comment.id
            });
        }

    } catch (error) {
        core.setFailed(error.message);
    }
}

main();
