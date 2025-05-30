import { Component } from 'solid-js'
import { IconProps } from './Icon.type'
import { cn } from '~/lib/utils'

const Share: Component<IconProps> = (props) => {
    return (
        <svg
            class={cn(props.class)}
            xmlns="http://www.w3.org/2000/svg"
            width={props.width ?? '32'}
            height={props.height ?? '32'}
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                d="M19.59 12L15 7.41v2.46l-.86.13c-4.31.61-7.23 2.87-8.9 6.33c2.32-1.64 5.2-2.43 8.76-2.43h1v2.69m-2-1.69v.02c-4.47.21-7.67 1.82-10 5.08c1-5 4-10 11-11V5l7 7l-7 7v-4.1c-.33 0-.66.01-1 .02Z"
            />
        </svg>
    )
}

export default Share
