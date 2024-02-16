# Milestone Set action

The purpose of this action is to set the Milestone of a merged Pull Request. The Milestone is automatically selected 
to the next open and due date Milestone.  

This action is only intended to run with Pull Request events for now.

## Inputs

### `github-token`

**Required** The GitHub Token used to create an authenticated client. The Github Token is already set by the Github
Action itself. Use this if you want to pass in your own Personal Access Token.

**Default** `${{github.token}}`.

## Example usage

Set up the Action:

```yaml
name: Update Milestone

on:
  pull_request_target:
    types: [closed]

jobs:
  update:
    runs-on: ubuntu-latest
    name: update-milestone
    if: ${{github.event.pull_request.merged == true}}

    steps:
      - uses: radcortez/milestone-set-action@main
        name: milestone set
        with:
          github-token: ${{secrets.GITHUB_TOKEN}}
```
