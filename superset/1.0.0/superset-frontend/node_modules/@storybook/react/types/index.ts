import { StorybookConfig as BaseConfig } from '@storybook/core/types';

/**
 * The interface for Storybook configuration in `main.ts` files.
 */
export interface StorybookConfig extends BaseConfig {
  reactOptions?: {
    fastRefresh?: boolean;
    strictMode?: boolean;
  };
}
