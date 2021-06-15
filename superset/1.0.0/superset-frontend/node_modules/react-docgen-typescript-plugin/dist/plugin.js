"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const docGen = tslib_1.__importStar(require("react-docgen-typescript"));
const micromatch_1 = require("micromatch");
const generateDocgenCodeBlock_1 = require("./generateDocgenCodeBlock");
const debugExclude = debug_1.default("docgen:exclude");
const debugInclude = debug_1.default("docgen:include");
const debugDocs = debug_1.default("docgen:docs");
/** Run the docgen parser and inject the result into the output */
function processModule(parser, webpackModule, tsProgram, loaderOptions) {
    if (!webpackModule) {
        return;
    }
    const componentDocs = parser.parseWithProgramProvider(webpackModule.userRequest, () => tsProgram);
    if (!componentDocs.length) {
        return;
    }
    const docs = generateDocgenCodeBlock_1.generateDocgenCodeBlock(Object.assign({ filename: webpackModule.userRequest, source: webpackModule.userRequest, componentDocs }, loaderOptions)).substring(webpackModule.userRequest.length);
    debugDocs(docs);
    // eslint-disable-next-line no-underscore-dangle
    let source = webpackModule._source._value;
    source += `\n${docs}\n`;
    // eslint-disable-next-line no-underscore-dangle, no-param-reassign
    webpackModule._source._value = source;
}
/** Get the contents of the tsconfig in the system */
function getTSConfigFile(tsconfigPath) {
    try {
        const basePath = path_1.default.dirname(tsconfigPath);
        const configFile = typescript_1.default.readConfigFile(tsconfigPath, typescript_1.default.sys.readFile);
        return typescript_1.default.parseJsonConfigFileContent(configFile.config, typescript_1.default.sys, basePath, {}, tsconfigPath);
    }
    catch (error) {
        return {};
    }
}
/** Create a glob matching function. */
const matchGlob = (globs) => {
    const matchers = globs.map((g) => micromatch_1.matcher(g));
    return (filename) => Boolean(filename && matchers.find((match) => match(filename)));
};
/** Inject typescript docgen information into modules at the end of a build */
class DocgenPlugin {
    constructor(options = {}) {
        this.name = "React Docgen Typescript Plugin";
        this.options = options;
    }
    apply(compiler) {
        const _a = this.options, { tsconfigPath = "./tsconfig.json", docgenCollectionName = "STORYBOOK_REACT_CLASSES", setDisplayName = true, typePropName = "type", compilerOptions: userCompilerOptions, exclude = [], include = ["**/**.tsx"] } = _a, docgenOptions = tslib_1.__rest(_a, ["tsconfigPath", "docgenCollectionName", "setDisplayName", "typePropName", "compilerOptions", "exclude", "include"]);
        const isExcluded = matchGlob(exclude);
        const isIncluded = matchGlob(include);
        let compilerOptions = {
            jsx: typescript_1.default.JsxEmit.React,
            module: typescript_1.default.ModuleKind.CommonJS,
            target: typescript_1.default.ScriptTarget.Latest,
        };
        if (userCompilerOptions) {
            compilerOptions = Object.assign(Object.assign({}, compilerOptions), userCompilerOptions);
        }
        else {
            const { options } = getTSConfigFile(tsconfigPath);
            compilerOptions = Object.assign(Object.assign({}, compilerOptions), options);
        }
        const parser = docGen.withCompilerOptions(compilerOptions, docgenOptions);
        compiler.hooks.make.tap(this.name, (compilation) => {
            compilation.hooks.seal.tap(this.name, () => {
                const modulesToProcess = [];
                compilation.modules.forEach((module) => {
                    if (!module.built) {
                        debugExclude(`Ignoring un-built module: ${module.userRequest}`);
                        return;
                    }
                    if (module.external) {
                        debugExclude(`Ignoring external module: ${module.userRequest}`);
                        return;
                    }
                    if (!module.rawRequest) {
                        debugExclude(`Ignoring module without "rawRequest": ${module.userRequest}`);
                        return;
                    }
                    if (isExcluded(module.userRequest)) {
                        debugExclude(`Module not matched in "exclude": ${module.userRequest}`);
                        return;
                    }
                    if (!isIncluded(module.userRequest)) {
                        debugExclude(`Module not matched in "include": ${module.userRequest}`);
                        return;
                    }
                    debugInclude(module.userRequest);
                    modulesToProcess.push(module);
                });
                const tsProgram = typescript_1.default.createProgram(modulesToProcess.map((v) => v.userRequest), compilerOptions);
                modulesToProcess.forEach((m) => processModule(parser, m, tsProgram, {
                    docgenCollectionName,
                    setDisplayName,
                    typePropName,
                }));
            });
        });
    }
}
exports.default = DocgenPlugin;
//# sourceMappingURL=plugin.js.map