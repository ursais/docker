export declare const includePaths: string[];
export declare const nodeModulesPaths: string;
export declare function loadEnv(options?: {
    production?: boolean;
}): {
    stringified: Record<string, string>;
    raw: Record<string, object>;
};
