import * as github from '@actions/github';
import * as core from '@actions/core';

interface PullRequest {
  id: string
  number: number
  title: string,
  state: string,
  labels: Array<string>
}

interface TemplateContext {
  pull_requests: { [key: string]: Array<PullRequest> },
}

async function fetchPullRequest(token: string, pr: string): Promise<PullRequest> {
  core.debug(`Fetch Pull Request ${pr}`);
  const oktokit = github.getOctokit(token);
  const response: any = await oktokit.graphql(`query {
        repository(owner: "${github.context.repo.owner}", name: "${github.context.repo.repo}") {
            pullRequest(number: ${pr}) {
                id,
                number,
                title,
                labels(first: 100) {
                  edges {
                    node {
                      id,
                      name
                    }
                  }
                }
            }
        }
      }`)
  core.debug(`Received Pull Request ${pr}: ${JSON.stringify(response)}`);
  const pullRequest = response["repository"]["pullRequest"]
  return {
    "id": pullRequest["id"],
    "number": pullRequest["number"],
    "title": pullRequest["title"],
    "state": pullRequest["state"], 
    "labels": (pullRequest["labels"]["edges"] as Array<any>).map(it => it["node"]["name"])
  }
}

export async function createTemplateContext(token: string, prs: Array<string>): Promise<any> {
  core.debug("Creating Template Context");
  const pullRequests = (await Promise.all(prs.map(it => fetchPullRequest(token, it)))).filter(pr=>pr.state != "MERGED");
  const labels = [...new Set(pullRequests.flatMap(it => it.labels))]
  const context: TemplateContext = {
    "pull_requests": {
      "_all": pullRequests
    }
  };
  labels.forEach(it => context.pull_requests[it] = [])
  pullRequests.forEach(it => {
    for (const label of it.labels) {
      context.pull_requests[label].push(it)
    }
  });
  labels.forEach(it => context.pull_requests[it].sort((a, b) => a.number - b.number))
  core.debug(`Template Context: ${JSON.stringify(context)}`);
  return context
}