import * as core from '@actions/core';
import { exec, ExecOptions } from '@actions/exec';
import { createTemplateContext } from './pull_requests';
import Mustache from 'mustache';
import { constants } from 'fs';
import { readFile, access } from 'fs/promises';

function checkFileExists(filepath: string): Promise<boolean>{
    return access(filepath, constants.F_OK)
    .then(() => true)
    .catch(() => false)
  }  

interface ExecReturnOptions {
    stdout(): string
    stderr(): string
}

function execOptions(): ExecOptions & ExecReturnOptions {
    let myOutput = '';
    let myError = '';

    const options = {
        listeners: {
            stdout: (data: Buffer) => {
                myOutput += data.toString();
            },
            stderr: (data: Buffer) => {
                myError += data.toString();
            }
        },
        stdout: () => myOutput,
        stderr: () => myOutput,
    };
    return options
}

function notNull<TValue>(value: TValue | null): value is TValue {
    return value !== null && value !== undefined;
}

async function getPreviousTag(currentTag: string): Promise<string> {
    core.debug(`Find previous tag for: ${currentTag}`)
    const options = execOptions()
    await exec("git", ["tag", "--sort=-creatordate"], options)
    const tags = options.stdout().split("\n")
    core.debug(`Found tags: ${tags}`)
    const currentIndex = tags.findIndex(it => it == currentTag)
    if (tags.length < (currentIndex + 1))
        return ""
    return tags[currentIndex + 1]
}

async function listPRs(tag1: string, tag2: string): Promise<Array<string>> {
    core.debug(`List Pull Requests for range ${tag1}..${tag2}`)
    if (tag1 == "" || tag2 == "") {
        return []
    }
    const options = execOptions()
    await exec("git", ["log", `${tag1}..${tag2}`, "--reverse", "--merges", "--oneline"], options)
    const prPattern = /.* Merge pull request #([0-9]{1,}) .*/is;
    const prs = options.stdout()
        .split("\n")
        .map(line => prPattern.exec(line))
        .filter(notNull)
        .map(it => it[1])
    core.debug(`Found PRs: ${prs} with stdout: ${options.stdout()}`);
    return prs
}

function renderTemplate(template: string, context: any): string {
    return Mustache.render(template, context);
}

async function getTemplate(template: string, templateFile: string): Promise<string> {
    if (!templateFile){
        core.debug("Use template content from variable instead of file")
        return template
    }
    const fileExists = checkFileExists(templateFile)
    if (!fileExists){
        core.info(`Template file does not exist: ${templateFile}`)
        return template
    }
    return await readFile(templateFile, { encoding: 'utf8' })
}

async function main() {
    // Input
    const token = core.getInput('token');
    const latestTag = core.getInput('latest');
    const template = core.getInput('template');
    const templateFile = core.getInput('templateFile');
    // Template Content
    const templateContent = await getTemplate(template, templateFile)
    // Calculated Values
    const previousTag = await getPreviousTag(latestTag);
    const prIds = await listPRs(previousTag, latestTag);
    const context = await createTemplateContext(token, prIds);
    // Parse Template
    core.debug("Render Template")
    const content: string = renderTemplate(templateContent, context);
    core.setOutput("content", content);
    return null;
}
main().catch((error) => {
    core.setFailed(error.message);
})