import { Component } from 'solid-js'
import { IconProps } from './Icon.type';
import { cn } from '~/lib/utils';

const Minimize: Component<IconProps> = (props) => {
    return (
        <svg class={cn(props.class)} xmlns="http://www.w3.org/2000/svg" width={props.width ?? "32"} height={props.height ?? "32"} viewBox="0 0 16 16">
            <path
                fill="currentColor"
                d="M11 4a1 1 0 0 0 1 1h1.5a.5.5 0 0 1 0 1H12a2 2 0 0 1-2-2V2.5a.5.5 0 0 1 1 0zm0 8a1 1 0 0 1 1-1h1.5a.5.5 0 0 0 0-1H12a2 2 0 0 0-2 2v1.5a.5.5 0 0 0 1 0zm-7-1a1 1 0 0 1 1 1v1.5a.5.5 0 0 0 1 0V12a2 2 0 0 0-2-2H2.5a.5.5 0 0 0 0 1zm1-7a1 1 0 0 1-1 1H2.5a.5.5 0 0 0 0 1H4a2 2 0 0 0 2-2V2.5a.5.5 0 0 0-1 0z"
            />
        </svg>
    )
}

export default Minimize;
