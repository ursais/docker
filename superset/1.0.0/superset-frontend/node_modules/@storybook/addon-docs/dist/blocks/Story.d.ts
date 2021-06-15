import { FunctionComponent, ReactNode, ComponentProps } from 'react';
import { Story as PureStory } from '@storybook/components';
import { DocsContextProps } from './DocsContext';
export declare const storyBlockIdFromId: (storyId: string) => string;
declare type PureStoryProps = ComponentProps<typeof PureStory>;
interface CommonProps {
    height?: string;
    inline?: boolean;
}
declare type StoryDefProps = {
    name: string;
    children: ReactNode;
} & CommonProps;
declare type StoryRefProps = {
    id?: string;
} & CommonProps;
export declare type StoryProps = StoryDefProps | StoryRefProps;
export declare const lookupStoryId: (storyName: string, { mdxStoryNameToKey, mdxComponentMeta }: DocsContextProps) => string;
export declare const getStoryProps: (props: StoryProps, context: DocsContextProps) => PureStoryProps;
declare const Story: FunctionComponent<StoryProps>;
export { Story };
