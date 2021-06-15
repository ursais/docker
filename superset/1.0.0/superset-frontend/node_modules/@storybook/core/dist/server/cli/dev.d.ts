import { CommanderStatic } from 'commander';
export interface DevCliOptions {
    port?: number;
    host?: number;
    staticDir?: string[];
    configDir?: string;
    https?: boolean;
    sslCa?: string[];
    sslCert?: string;
    sslKey?: string;
    smokeTest?: boolean;
    ci?: boolean;
    loglevel?: string;
    quiet?: boolean;
    versionUpdates?: boolean;
    releaseNotes?: boolean;
    dll?: boolean;
    docs?: boolean;
    docsDll?: boolean;
    uiDll?: boolean;
    debugWebpack?: boolean;
    previewUrl?: string;
}
export declare function getDevCli(packageJson: {
    version: string;
    name: string;
}): Promise<CommanderStatic & DevCliOptions>;
