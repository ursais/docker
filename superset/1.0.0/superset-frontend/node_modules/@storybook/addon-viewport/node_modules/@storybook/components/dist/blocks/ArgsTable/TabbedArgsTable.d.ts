import { FC } from 'react';
import { ArgsTableProps } from './ArgsTable';
export interface TabbedArgsTableProps {
    tabs: Record<string, ArgsTableProps>;
}
export declare const TabbedArgsTable: FC<TabbedArgsTableProps>;
