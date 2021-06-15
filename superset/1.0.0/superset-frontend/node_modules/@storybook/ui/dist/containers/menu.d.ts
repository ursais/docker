import { API } from '@storybook/api';
export declare const useMenu: (api: API, isFullscreen: boolean, showPanel: boolean, showNav: boolean, enableShortcuts: boolean) => ({
    id: string;
    title: string;
    onClick: () => Promise<void>;
    left: JSX.Element;
} | {
    id: string;
    title: string;
    onClick: () => void;
    right: JSX.Element;
    left: string | JSX.Element;
})[];
