export default function LoadingIcon({isLoading=false}: {isLoading?: boolean}) {
    return (
        <svg
            classList={{
                "animate-spin": isLoading
            }}
            width="40"
            height="40"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="flex-grow-0 flex-shrink-0 relative"
            preserveAspectRatio="xMidYMid meet"
        >
            <path
                d="M9.9987 3.33325V5.23801M14.7606 5.23801L13.332 6.66659M5.23679 5.23801L6.66536 6.66659M9.9987 16.6666V14.7618M14.7606 14.7618L13.332 13.3333M5.23679 14.7618L6.66536 13.3333M3.33203 9.99992H5.23679M14.7606 9.99992H16.6654"
                stroke="#1D1D1F"
                stroke-linecap="round"
                stroke-linejoin="round"
            ></path>
        </svg>
    );
}
