import { Component } from 'solid-js'
import { IconProps } from './Icon.type'
import { cn } from '~/lib/utils'

const SuccessIcon: Component<IconProps> = (props) => {
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
                d="M2.5 6L5 8.5L9.5 4"
                stroke="#F5F5F5"
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    )
}

export default SuccessIcon
