import { IconsProps } from '@storybook/components';
import { ArgType } from '@storybook/api';
export interface ToolbarItem {
    value: string;
    icon?: IconsProps['icon'];
    left?: string;
    right?: string;
    title?: string;
}
export interface NormalizedToolbarConfig {
    icon?: IconsProps['icon'];
    items: ToolbarItem[];
}
export declare type NormalizedToolbarArgType = ArgType & {
    toolbar: NormalizedToolbarConfig;
};
export declare type ToolbarConfig = NormalizedToolbarConfig & {
    items: string[] | ToolbarItem[];
};
export declare type ToolbarArgType = ArgType & {
    toolbar: ToolbarConfig;
};
