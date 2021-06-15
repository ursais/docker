import { Configuration } from 'webpack';
import { ManagerWebpackOptions } from '../types';
export declare function managerWebpack(_: Configuration, options: ManagerWebpackOptions): Promise<Configuration>;
export declare function managerEntries(installedAddons: string[], options: {
    managerEntry: string;
    configDir: string;
}): Promise<string[]>;
export * from '../common/common-preset';
