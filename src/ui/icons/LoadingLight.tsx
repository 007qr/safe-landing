import { Component } from 'solid-js'
import { IconProps } from './Icon.type'
import { cn } from '~/lib/utils'

const LoadingLightIcon: Component<IconProps> = (props) => {
    return (
        <svg
            class={cn(props.class)}
            width={props.width ?? '12'}
            height={props.height ?? '12'}
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M6 1C3.24 1 1 3.24 1 6C1 8.76 3.24 11 6 11C8.76 11 11 8.76 11 6"
                stroke="#F5F5F5"
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    )
}

export default LoadingLightIcon
