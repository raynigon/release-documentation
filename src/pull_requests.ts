import * as github from '@actions/github';
import * as core from '@actions/core';

async function fetchPullRequest(token: string, pr: string): Promise<any> {
  core.info(`fetch ${pr}`);
  const oktokit = github.getOctokit(token);
  const response: any = await oktokit.graphql(`query {
        repository(owner: "${github.context.repo.owner}", name: "${github.context.repo.repo}") {
            pullRequest(number: ${pr}) {
                id,
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
  core.info(`received ${pr}: ${JSON.stringify(response)}`);
  return {
    "id": response["data"]["repository"]["id"],
    "title": response["data"]["repository"]["title"],
    "labels": (response["data"]["repository"]["labels"]["edges"] as Array<any>).map(it => it["node"]["name"])
  }
}

export async function createTemplateContext(token: string, prs: Array<string>): Promise<any> {
  core.info("start fetch");
  const pullRequest = await Promise.all(prs.map(it => fetchPullRequest(token, it)));
  core.info(JSON.stringify(pullRequest));
  return {};
}