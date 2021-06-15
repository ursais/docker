import type { TransformOptions } from '@babel/core';
import type { Configuration } from 'webpack';
import type { StorybookOptions } from './types';
export declare function babel(config: TransformOptions, { typescriptOptions }: StorybookOptions): TransformOptions;
export declare function webpackFinal(config: Configuration, { typescriptOptions }: StorybookOptions): Configuration;
