import { StorybookOptions as BaseOptions } from '@storybook/core/types';
/**
 * The internal options object, used by Storybook frameworks and addons.
 */
export interface StorybookOptions extends BaseOptions {
    reactOptions?: {
        fastRefresh?: boolean;
    };
}
