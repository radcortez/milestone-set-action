const core = require('@actions/core');
const github = require('@actions/github');

try {
    const pullRequestNumber = github.context.payload.pull_request.number
    console.log(`Pull Request Number ${pullRequestNumber}`);

    const octokit = new github.GitHub(core.getInput('github-token'));
    octokit.issues.listMilestonesForRepo({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        state: 'open',
        sort: 'due_on',
        direction: 'asc',
    }).then(({data}) => {

        let milestone = data.shift();

        if (milestone == null) {
            console.log(`No Milestones found!`);
            return;
        }

        console.log(`Found Milestone ${milestone.title}`);

        octokit.issues.get({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            issue_number: pullRequestNumber,
        }).then(issue => {
            if (issue.data.milestone != null) {
                console.log(`Pull Request ${pullRequestNumber} already has the Milestone set to ${issue.data.milestone.title}`);
                return;
            }

            console.log(`Setting Milestone ${milestone.title} to Pull Request ${pullRequestNumber}`);

            octokit.issues.update({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                issue_number: pullRequestNumber,
                milestone: milestone.number
            })
        });

    }).catch((error) => {
        console.debug(error);
        core.setFailed('Unknown Error!')
    })

} catch (error) {
    core.setFailed(error.message);
}
