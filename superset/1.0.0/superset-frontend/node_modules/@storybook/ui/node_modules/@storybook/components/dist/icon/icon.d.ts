import { FunctionComponent, ComponentProps } from 'react';
import { IconKey } from './icons';
import Svg from './svg';
export interface IconsProps extends ComponentProps<typeof Svg> {
    icon: IconKey;
}
export declare const Icons: FunctionComponent<IconsProps>;
