import type ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import type { PluginOptions } from 'react-docgen-typescript-plugin';
import { Configuration } from 'webpack';

type Preset = string | { name: string };

/**
 * The interface for Storybook configuration in `main.ts` files.
 */
export interface StorybookConfig {
  /**
   * Sets the addons you want to use with Storybook.
   *
   * @example `['@storybook/addon-essentials']` or `[{ name: '@storybook/addon-essentials', options: { backgrounds: false } }]`
   */
  addons?: Array<
    | string
    | {
        name: string;
        options?: any;
      }
  >;
  /**
   * Tells Storybook where to find stories.
   *
   * @example `['./src/*.stories.@(j|t)sx?']`
   */
  stories: string[];
  /**
   * Controls how Storybook handles TypeScript files.
   */
  typescript?: Partial<TypescriptOptions>;
  /**
   * Modify or return a custom Webpack config.
   */
  webpackFinal?: (
    config: Configuration,
    options: StorybookOptions
  ) => Configuration | Promise<Configuration>;
}

/**
 * The internal options object, used by Storybook frameworks and addons.
 */
export interface StorybookOptions {
  configType: 'DEVELOPMENT' | 'PRODUCTION';
  presetsList: Preset[];
  typescriptOptions: TypescriptOptions;
  [key: string]: any;
}

/**
 * Options for TypeScript usage within Storybook.
 */
export interface TypescriptOptions {
  /**
   * Enables type checking within Storybook.
   *
   * @default `false`
   */
  check: boolean;
  /**
   * Configures `fork-ts-checker-webpack-plugin`
   */
  checkOptions?: ForkTsCheckerWebpackPlugin['options'];
  /**
   * Sets the type of Docgen when working with React and TypeScript
   *
   * @default `'react-docgen-typescript'`
   */
  reactDocgen: 'react-docgen-typescript' | 'react-docgen' | false;
  /**
   * Configures `react-docgen-typescript-plugin`
   *
   * @default
   * @see https://github.com/storybookjs/storybook/blob/next/lib/core/src/server/config/defaults.js#L4-L6
   */
  reactDocgenTypescriptOptions: PluginOptions;
}
