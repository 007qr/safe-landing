import { Show } from "solid-js"
import { DisputeStates } from "./AIResponse.types"
import ThreeDots from "~/ui/icons/ThreeDots"

const  DisputeState = ({ disputeState }: { disputeState: DisputeStates }) => {
    return (
        <div class="flex gap-[8px]">
            <div class="relative w-[36px] h-[36px]">
                <svg
                    class={`absolute top-0 left-0 w-full h-full transform -rotate-90 ${
                        disputeState.state === 'pending_response_from_bank' && 'animate-spin'
                    }`}
                    viewBox="0 0 36 36"
                >
                    <circle
                        class="text-[#F2F2F2]"
                        stroke-width="4"
                        stroke="currentColor"
                        fill="none"
                        cx="18"
                        cy="18"
                        r="16"
                    />
                    <circle
                        class={`${disputeState.state === 'won' && 'text-[#0B9925]'} ${
                            (disputeState.state === 'lost' || disputeState.state === 'not_responded') && 'text-[#990B0B]'
                        } ${disputeState.state === 'pending_response_from_bank' && 'text-[#D4D4D4]'}`}
                        stroke-width="4"
                        stroke-dasharray="100"
                        stroke-linecap="round"
                        stroke="currentColor"
                        fill="none"
                        cx="18"
                        cy="18"
                        r="16"
                        style={`${
                            disputeState.state === 'won' || disputeState.state == 'lost'
                                ? 'stroke-dashoffset: calc(100.48 * (1 - 1))'
                                : ''
                        } ${
                            disputeState.state === 'pending_response_from_bank'
                                ? 'stroke-dashoffset: calc(100.48 * (1 - 0.15))'
                                : ''
                        } ${disputeState.state === 'not_responded' ? 'stroke-dashoffset: calc(100.48 * (1 - 0.55))' : ''}`}
                    />
                </svg>

                <div class="absolute inset-0 mt-[1px] flex items-center justify-center">
                    <Show when={disputeState.state === 'not_responded'}>
                        <svg class="mt-[2px] ml-[5px]" width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M10.0003 17.0832C13.9123 17.0832 17.0837 13.9119 17.0837 9.99984C17.0837 6.08782 13.9123 2.9165 10.0003 2.9165C6.08831 2.9165 2.91699 6.08782 2.91699 9.99984C2.91699 13.9119 6.08831 17.0832 10.0003 17.0832Z"
                                stroke="black"
                            />
                            <path
                                d="M10 5.83301V9.99967L12.3333 12.333"
                                stroke="black"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </Show>
                    <Show when={disputeState.state === 'pending_response_from_bank'}>
                        <svg
                            class="-mt-[2px] ml-[1px]"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M17.0388 13.3831C17.0778 13.4602 17.0919 13.5476 17.079 13.6331C17.0662 13.7186 17.0271 13.798 16.9671 13.8602C16.9071 13.9225 16.8292 13.9646 16.7443 13.9806C16.6593 13.9967 16.5715 13.9859 16.493 13.9498L14.4096 12.9889C12.6677 12.1855 10.7585 11.8115 8.84212 11.8981C8.81959 12.5109 8.78597 13.1232 8.74129 13.7348L8.68379 14.5164C8.67594 14.625 8.64002 14.7297 8.57956 14.8202C8.51909 14.9107 8.43615 14.9839 8.33887 15.0327C8.24158 15.0815 8.13328 15.1042 8.02458 15.0986C7.91588 15.093 7.81051 15.0592 7.71879 15.0006C5.97871 13.8875 4.46558 12.4543 3.25962 10.7773L2.87629 10.2439C2.82529 10.173 2.79785 10.0879 2.79785 10.0006C2.79785 9.91327 2.82529 9.82815 2.87629 9.75726L3.25962 9.22393C4.4655 7.54655 5.97864 6.11315 7.71879 4.99977C7.81045 4.94118 7.91575 4.90741 8.02439 4.90173C8.13302 4.89606 8.24127 4.91869 8.33854 4.96741C8.4358 5.01612 8.51875 5.08926 8.57927 5.17965C8.63979 5.27005 8.6758 5.37461 8.68379 5.4831L8.74129 6.26643C8.77962 6.79143 8.80962 7.31643 8.83129 7.84143H9.36795C10.8313 7.84154 12.2661 8.24726 13.5128 9.01354C14.7595 9.77981 15.7695 10.8767 16.4305 12.1823L17.0388 13.3831Z"
                                fill="black"
                            />
                        </svg>
                    </Show>
                    <Show when={disputeState.state === 'lost'}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M15 15L5 5M15 5L5 15"
                                stroke="#990B0B"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </Show>
                    <Show when={disputeState.state === 'won'}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M16.667 5.8335L8.33366 14.1668L4.16699 10.0002"
                                stroke="#0B9925"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </Show>
                </div>
            </div>

            <div class="border border-[#1D1D1F14] w-[36px] h-[36px] flex items-center justify-center rounded-[64px] p-[4px] cursor-pointer">
                <ThreeDots />
            </div>
        </div>
    )
}

export default DisputeState;
