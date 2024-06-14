const core = require('@actions/core');
const github = require('@actions/github');

async function main() {
    try {
        // `pr_number` input defined in action metadata file
        const prNumber = core.getInput('pr_number');

        // List the pull request comments in the issue
        const octokit = github.getOctokit(this.ctx.token);

        const { data: comments } = await octokit.rest.issues.listComments({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            issue_number: prNumber
        });

        // Filter the comments
        const filter = core.getInput('filter');
        const filteredComments = filter
            ? comments.filter(comment => comment.body.includes(filter))
            : comments;

        // Delete the comments
        // ...
    } catch (error) {
        core.setFailed(error.message);
    }
}

main();
