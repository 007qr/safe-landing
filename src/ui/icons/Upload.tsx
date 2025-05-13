import { Component } from 'solid-js'

const UploadIcon: Component<{ width?: string; height?: string; class?: string }> = (props) => {
    return (
        <>
            <svg
                width={props.width ?? '16'}
                height={props.height ?? '16'}
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M4 13.3332H12M8 10.6665V2.6665M8 2.6665L10.3333 4.99984M8 2.6665L5.66667 4.99984"
                    stroke="#1D1D1F"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        </>
    )
}

export default UploadIcon;
