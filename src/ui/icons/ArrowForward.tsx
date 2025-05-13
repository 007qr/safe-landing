import { Component } from 'solid-js'
import { cn } from '~/lib/utils';

const ArrowForward: Component<{ width?: string; height?: string; stroke?: string; class?: string }> = (props) => {
    return (
        <svg
            class={cn(props.class)}
            width={props.width ?? '32'}
            height={props.height ?? '32'}
            viewBox={`0 0 32 32`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M11.3335 6.66658L20.6668 15.9999L11.3335 25.3333"
                stroke={props.stroke ?? '#1d1d1f'}
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    )
}

export default ArrowForward;
