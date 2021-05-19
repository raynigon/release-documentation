"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
function getPreviousTag(currentTag) {
    return "";
}
function listPRs(tag1, tag2) {
    return [];
}
function createTemplateContext(token, prs) {
    return __awaiter(this, void 0, void 0, function* () {
        const oktokit = github.getOctokit(token);
        return null;
    });
}
function renderTemplate(template, context) {
    return __awaiter(this, void 0, void 0, function* () {
        return template;
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Input
        const token = core.getInput('token');
        const latestTag = core.getInput('latest');
        const template = core.getInput('template');
        // Calculated Values
        const previousTag = getPreviousTag(latestTag);
        const prIds = listPRs(previousTag, latestTag);
        const context = createTemplateContext(token, prIds);
        // Parse Template
        const content = renderTemplate(template, context);
        core.setOutput("content", content);
        return null;
    });
}
main().catch((error) => {
    core.setFailed(error.message);
});
