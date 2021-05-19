import * as core from '@actions/core';
import { exec } from '@actions/exec';
import { createTemplateContext } from './pull_requests';
import {WritableStream} from 'memory-streams';

async function getPreviousTag(currentTag: string): Promise<string> {
    const outputStream = new WritableStream();
    await exec("bash", ["-c", "git tag --sort=-creatordate | grep -A 1 second | tail -n 1"], { outStream: outputStream })
    return outputStream.toString()
}

async function listPRs(tag1: string, tag2: string): Promise<Array<string>> {
    const outputStream = new WritableStream();
    await exec("bash", ["-c", "git tag --sort=-creatordate | grep -A 1 second | tail -n 1"], { outStream: outputStream })
    return outputStream.toString().split("\n").map(line => line.replace("#", ""))
}

async function renderTemplate(template: string, context: any): Promise<string> {
    return template
}

async function main() {
    // Input
    const token = core.getInput('token');
    const latestTag = core.getInput('latest');
    const template = core.getInput('template');
    // Calculated Values
    core.info("Calculating previous Tag")
    const previousTag = await getPreviousTag(latestTag);
    core.info("List Pull Requests")
    const prIds = await listPRs(previousTag, latestTag);
    core.info("Create Template Context")
    const context = await createTemplateContext(token, prIds);
    // Parse Template
    core.info("Render Template")
    const content = renderTemplate(template, context);
    core.setOutput("content", content);
    return null;
}
main().catch((error) => {
    core.setFailed(error.message);
})