import { TransformOptions } from '@babel/core';
export default function (configDir: string, getDefaultConfig: () => TransformOptions): Promise<TransformOptions>;
