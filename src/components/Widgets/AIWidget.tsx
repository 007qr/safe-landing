import { createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { Presence, Motion } from "solid-motionone";
import AIGif from "~/ui/icons/AIGif";
import SaveIcon from "~/ui/icons/SaveIcon";
import MasterCard from "./MasterCard";
import ThreeDots from "~/ui/icons/ThreeDots";

type DisputeStates =
    | "not_responded"
    | "pending_response_from_bank"
    | "lost"
    | "won";

export default function AIWidget({
    disputeStates,
}: {
    disputeStates: DisputeStates;
}) {
    let ref!: HTMLButtonElement;
    const [aiThinking, setAIThinking] = createSignal(false);
    const [visibleSteps, setVisibleSteps] = createSignal<string[]>([
        "Terms",
        "Privacy policy",
        "Refund policy",
    ]);

    const aiText = `Let’s win this dispute for you. For this reason, we need to provide Terms, refund policy and refund reason`;

    const handleOnClick = () => {
        setAIThinking((v) => !v);
    };

    return (
        <div
            class="w-[364px] p-[16px] text-[#1D1D1F] h-[170px] bg-white border border-[#1D1D1F14] rounded-[24px] leading-[130%] tracking-[0%]"
            style={{
                "box-shadow": "0px 4px 2px 0px #00000005",
                "-ms-overflow-style": "none",
                "scrollbar-width": "none",

                "-webkit-mask-image": aiThinking()
                    ? "linear-gradient(transparent -22%, black, transparent 113%)"
                    : "none",
                "mask-image": aiThinking()
                    ? "linear-gradient(transparent -22%, black, transparent 113%)"
                    : "none",
                "overflow-y": aiThinking() ? "auto" : "hidden",
            }}
        >
            <div class="flex flex-col justify-between">
                <div class="flex relative justify-between items-center">
                    <Presence exitBeforeEnter>
                        <Show when={!aiThinking()}>
                            <Motion.div
                                class="flex gap-[8px] items-center"
                                animate={{ opacity: 1 }}
                                exit={{
                                    opacity: 0,
                                    transition: {
                                        duration: 0.35,
                                        easing: "ease-in-out",
                                    },
                                }}
                            >
                                <MasterCard number={4435} />
                                <div>
                                    <p class="text-[13px] font-inter font-medium">
                                        Leslie Alexander
                                    </p>
                                    <h2 class="text-[15px] font-inter font-medium">
                                        Product not as described
                                    </h2>
                                </div>
                            </Motion.div>
                        </Show>
                    </Presence>

                    <button
                        ref={ref}
                        onClick={handleOnClick}
                        class={`outline-none cursor-pointer transition-transform duration-500 ease-in-out absolute right-0 top-0 ${
                            aiThinking()
                                ? "-translate-x-[300px] scale-70"
                                : "translate-x-0"
                        }`}
                    >
                        <AIGif  width="36" height="36" />
                    </button>
                </div>

                <Presence exitBeforeEnter>
                    <Show when={!aiThinking()}>
                        <Motion.div
                            class="flex justify-between items-end mt-[18%]"
                            animate={{ opacity: 1 }}
                            exit={{
                                opacity: 0,
                                transition: {
                                    duration: 0.35,
                                    easing: "ease-in-out",
                                },
                            }}
                        >
                            <div class="flex flex-col gap-[2px]">
                                <h2 class="text-[21px] font-inter font-medium text-[#990B0B]">
                                    -$520.08
                                </h2>
                            </div>
                            <DisputeState disputeState={disputeStates} />
                        </Motion.div>
                    </Show>
                </Presence>
            </div>

            <div class="w-[200px] flex flex-col mx-auto gap-[14px] pb-[60px] pt-[30px]">
                <Show when={aiThinking()}>
                    <div class="flex flex-col">
                        <div>
                            <AIGeneratedText aiText={aiText} />
                        </div>
                        <div class="flex flex-col gap-[14px] pt-[8px]">
                            <For each={visibleSteps()}>
                                {(step, index) => {
                                    return (
                                        <AISteps
                                            stepText={step}
                                            delay={index()}
                                        />
                                    );
                                }}
                            </For>
                        </div>
                    </div>
                </Show>
            </div>
        </div>
    );
}

function DisputeState({ disputeState }: { disputeState: DisputeStates }) {
    return (
        <div class="flex gap-[8px]">
            <div class="relative w-[36px] h-[36px]">
                <svg
                    class={`absolute top-0 left-0 w-full h-full transform -rotate-90 ${
                        disputeState === "pending_response_from_bank" &&
                        "animate-spin"
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
                        class={`${disputeState === "won" && "text-[#0B9925]"} ${
                            (disputeState === "lost" ||
                                disputeState === "not_responded") &&
                            "text-[#990B0B]"
                        } ${
                            disputeState === "pending_response_from_bank" &&
                            "text-[#D4D4D4]"
                        }`}
                        stroke-width="4"
                        stroke-dasharray="100"
                        stroke-linecap="round"
                        stroke="currentColor"
                        fill="none"
                        cx="18"
                        cy="18"
                        r="16"
                        style={`${
                            disputeState === "won" || disputeState == "lost"
                                ? "stroke-dashoffset: calc(100.48 * (1 - 1))"
                                : ""
                        } ${
                            disputeState === "pending_response_from_bank"
                                ? "stroke-dashoffset: calc(100.48 * (1 - 0.15))"
                                : ""
                        } ${
                            disputeState === "not_responded"
                                ? "stroke-dashoffset: calc(100.48 * (1 - 0.55))"
                                : ""
                        }`}
                    />
                </svg>

                <div class="absolute inset-0 mt-[1px] flex items-center justify-center">
                    <Show when={disputeState === "not_responded"}>
                        <svg
                            class="mt-[2px] ml-[5px]"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
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
                    <Show when={disputeState === "pending_response_from_bank"}>
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
                    <Show when={disputeState === "lost"}>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M15 15L5 5M15 5L5 15"
                                stroke="#990B0B"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </Show>
                    <Show when={disputeState === "won"}>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
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
    );
}

function AIGeneratedText({ aiText }: { aiText: string }) {
    return (
        <For each={aiText.split(" ")}>
            {(word, i) => (
                <>
                    <span
                        class="animate-fade-in whitespace-pre inline-block"
                        style={{ "animation-delay": `${i() * 100}ms` }}
                    >
                        {word}
                    </span>
                    <span class="whitespace-pre inline-block"> </span>
                </>
            )}
        </For>
    );
}

function AISteps({
    stepText,
    delay = 0,
}: {
    stepText: string;
    delay?: number;
}) {
    let ref!: HTMLDivElement;
    const [doneThinking, setDoneThinking] = createSignal(false);

    onMount(() => {
        const delayTimeout = 1000 * delay + 3500;

        setTimeout(() => {
            if (ref) {
                ref.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, delayTimeout - 1250);

        const timeout = setTimeout(() => {
            setDoneThinking(true);
        }, delayTimeout);

        onCleanup(() => clearTimeout(timeout));
    });

    return (
        <Presence>
            <Motion.div
                ref={ref}
                animate={{
                    opacity: [0, 1],
                    transition: { duration: 0, delay: delay + 2 },
                }}
            >
                <div class="gap-[4px] flex items-center text-[12px] font-inter leading-[130%]">
                    <Presence>
                        <Show when={!doneThinking()} fallback={<SaveIcon />}>
                            <Motion.span class="animate-spin">
                                <Spinner />
                            </Motion.span>
                        </Show>
                    </Presence>
                    {stepText}
                </div>
            </Motion.div>
        </Presence>
    );
}

function Spinner() {
    return (
        <svg
            width="20"
            height="20"
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
