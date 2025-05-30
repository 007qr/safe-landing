import { Component } from 'solid-js'
import { IconProps } from './Icon.type'
import { cn } from '~/lib/utils'

const Play: Component<IconProps> = (props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class={cn(props.class)}
            width={props.width ?? '32'}
            height={props.height ?? '32'}
            viewBox="0 0 16 16"
        >
            <path
                fill="currentColor"
                d="M5.745 3.064A.5.5 0 0 0 5 3.5v9a.5.5 0 0 0 .745.436l8-4.5a.5.5 0 0 0 0-.871zM4 3.5a1.5 1.5 0 0 1 2.235-1.307l8 4.5a1.5 1.5 0 0 1 0 2.615l-8 4.5A1.5 1.5 0 0 1 4 12.5z"
            />
        </svg>
    )
}

export default Play;
