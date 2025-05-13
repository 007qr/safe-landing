export default function CloseIcon({ isActive }: { isActive: boolean }) {
    return (
        <svg
            width="47"
            height="47"
            viewBox="0 0 47 47"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class={`absolute w-full h-full top-0 shrink-0 left-0  ${
                !isActive ? "opacity-0" : "opacity-100"
            }`}
            id="close-btn-icon"
        >
            <title>Close menu</title>
            <circle cx="23.3004" cy="23.3004" r="23.3004" fill="black"></circle>
            <line
                x1="16.4023"
                y1="16.3457"
                x2="30.3908"
                y2="30.3342"
                stroke="white"
                stroke-width="1.95139"
                stroke-linecap="round"
            ></line>
            <line
                x1="16.3455"
                y1="30.334"
                x2="30.3339"
                y2="16.3456"
                stroke="white"
                stroke-width="1.95139"
                stroke-linecap="round"
            ></line>
        </svg>
    );
}