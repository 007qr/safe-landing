export default function MasterCard() {
    return (
        <div class="flex gap-[10px]">
            <div class="w-[36px] h-[36px] rounded-[4px] border border-[#1D1D1F14] flex items-center justify-center overflow-hidden relative">
                <span class="absolute inset-0 flex items-center justify-center animate-mastercard-logo">
                    <MasterCardLogo />
                </span>
                <span class="absolute inset-0 flex items-center justify-center font-inter text-[13px] leading-[130%] tracking-[0%] text-[#494949] animate-mastercard-text">
                    4356
                </span>
            </div>
        </div>
    );
}

function MasterCardLogo() {
    return (
        <>
            <svg
                width="30"
                height="18"
                viewBox="0 0 30 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M15 15.8501C13.4113 17.1907 11.3503 18 9.0984 18C4.07347 18 0 13.9706 0 9.00003C0 4.02942 4.07347 0 9.0984 0C11.3503 0 13.4113 0.809325 15 2.15001C16.5888 0.809325 18.6497 0 20.9017 0C25.9265 0 30 4.02942 30 9.00003C30 13.9706 25.9265 18 20.9017 18C18.6497 18 16.5888 17.1907 15 15.8501Z"
                    fill="#ED0006"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M15 15.8501C16.9563 14.1993 18.1967 11.7429 18.1967 9.00003C18.1967 6.25706 16.9563 3.80073 15 2.15001C16.5888 0.809325 18.6497 0 20.9017 0C25.9265 0 30 4.02942 30 9.00003C30 13.9706 25.9265 18 20.9017 18C18.6497 18 16.5888 17.1907 15 15.8501Z"
                    fill="#F9A000"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M15 2.15001C16.9563 3.80073 18.1967 6.25706 18.1967 9.00003C18.1967 11.7429 16.9563 14.1993 15 15.8501C13.0438 14.1993 11.8034 11.7429 11.8034 9.00003C11.8034 6.25706 13.0438 3.8008 15 2.15001Z"
                    fill="#FF5E00"
                />
            </svg>
        </>
    );
}
