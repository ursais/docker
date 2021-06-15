export declare const DEFAULT_ADDONS: string[];
export declare const IGNORED_ADDONS: string[];
export declare const getPrebuiltDir: ({ configDir, options, }: {
    configDir: string;
    options: {
        managerCache?: boolean;
        smokeTest?: boolean;
    };
}) => Promise<string | false>;
