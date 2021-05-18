import * as core from '@actions/core';
import * as github from '@actions/github';
import { exec } from '@actions/exec'
import * as stream from 'stream';

function streamToString(stream: stream): Promise<string> {
    const chunks: any[] = [];
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on('error', (err) => reject(err));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    })
}

async function getPreviousTag(currentTag: string): Promise<string> {
    const outputStream = new stream.Writable();
    const resultPromise = streamToString(outputStream);
    exec("bash", ["-c", "git tag --sort=-creatordate | grep -A 1 second | tail -n 1"], { outStream: outputStream })
    return resultPromise
}

function listPRs(tag1: string, tag2: string): Array<string> {
    return []
}

async function createTemplateContext(token: string, prs: Array<string>): Promise<any> {
    const oktokit = github.getOctokit(token);
    return null;
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
    const previousTag = await getPreviousTag(latestTag);
    const prIds = listPRs(previousTag, latestTag);
    const context = createTemplateContext(token, prIds);
    // Parse Template
    const content = renderTemplate(template, context);
    core.setOutput("content", content);
    return null;
}
main().catch((error) => {
    core.setFailed(error.message);
})