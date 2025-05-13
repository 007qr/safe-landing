import { Component } from 'solid-js'
import { cn } from '~/lib/utils';

const ArrowRight: Component<{ width?: string; height?: string; class?: string }> = (props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class={cn(props.class)}
            width={props.width ?? '32'}
            height={props.height ?? '32'}
            viewBox="0 0 24 24"
        >
            <path
                fill="white"
                d="M15.187 12L7.47 4.285q-.221-.221-.218-.532q.003-.31.224-.532Q7.698 3 8.009 3q.31 0 .532.221l7.636 7.643q.242.242.354.54t.111.596t-.111.596t-.354.54L8.535 20.78q-.222.221-.53.218q-.307-.003-.528-.224t-.221-.532t.221-.531z"
            />
        </svg>
    )
}

export default ArrowRight;
