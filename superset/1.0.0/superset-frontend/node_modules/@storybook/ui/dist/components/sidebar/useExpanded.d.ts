import { StoriesHash } from '@storybook/api';
import { Dispatch, MutableRefObject } from 'react';
import { Highlight } from './types';
export declare type ExpandedState = Record<string, boolean>;
export interface ExpandAction {
    ids: string[];
    value: boolean;
}
export interface ExpandedProps {
    containerRef: MutableRefObject<HTMLElement>;
    isBrowsing: boolean;
    refId: string;
    data: StoriesHash;
    rootIds: string[];
    highlightedRef: MutableRefObject<Highlight>;
    setHighlightedItemId: (storyId: string) => void;
    selectedStoryId: string | null;
    onSelectStoryId: (storyId: string) => void;
}
export declare const useExpanded: ({ containerRef, isBrowsing, refId, data, rootIds, highlightedRef, setHighlightedItemId, selectedStoryId, onSelectStoryId, }: ExpandedProps) => [Record<string, boolean>, Dispatch<ExpandAction>];
