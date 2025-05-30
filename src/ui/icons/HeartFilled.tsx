import { Component } from 'solid-js'
import { IconProps } from './Icon.type'
import { cn } from '~/lib/utils'

const HeartFilled: Component<IconProps> = (props) => {
    return (
        <svg class={cn(props.class)} xmlns="http://www.w3.org/2000/svg" width={props.width ?? "32"} height={props.height ?? "32"} viewBox="0 0 24 24">
            <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M4.536 5.778a5 5 0 0 1 7.07 0q.275.274.708.682q.432-.408.707-.682a5 5 0 0 1 7.125 7.016L13.02 19.92a1 1 0 0 1-1.414 0L4.48 12.795a5 5 0 0 1 .055-7.017z"
            />
        </svg>
    )
}

export default HeartFilled;
