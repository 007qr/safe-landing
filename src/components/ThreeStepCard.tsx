import { createSignal, onCleanup, onMount, For, Show, JSX } from "solid-js";
import { Motion, Presence } from "solid-motionone";
import ArrowForward from "../ui/icons/ArrowForward";
// import { EditorElement } from "../providers/editor-provider";

interface Step {
    id: number;
    title: string;
    subTitle: string;
    icon: () => JSX.Element;
}

interface Props {
    // element: EditorElement
    altText: string;
    steps: Step[];
    nextButton: boolean;
    nextButtonUrl?: string;
    onNextClick?: () => void;
}

export default function ThreeStepCard(props: Props) {
    const [activeStep, setActiveStep] = createSignal<number>(
        props.steps[0]?.id ?? 0
    );
    let animationFrameId: number | null = null;
    const intervalDuration = 3000;
    let lastTimestamp = 0;

    const cycleSteps = (timestamp: number) => {
        if (!lastTimestamp) lastTimestamp = timestamp;

        if (timestamp - lastTimestamp >= intervalDuration) {
            setActiveStep((prev) => {
                const currentIndex = props.steps.findIndex(
                    (step) => step.id === prev
                );
                return props.steps[(currentIndex + 1) % props.steps.length].id;
            });
            lastTimestamp = timestamp;
        }

        animationFrameId = requestAnimationFrame(cycleSteps);
    };

    onMount(() => {
        if (props.steps.length === 0) return;
        animationFrameId = requestAnimationFrame(cycleSteps);

        onCleanup(() => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        });
    });

    return (
        <div class="overflow-hidden bg-white relative max-lg:min-w-[362px] max-lg:min-h-[473px] max-lg:w-full max-lg:h-full min-w-[740px] min-h-[473px] w-[740px] h-[632px] rounded-[48px] lg:p-[40px]">
            <div class="flex flex-col gap-[8px] max-lg:px-[40px] max-lg:pt-[40px]">
                <h2 class="text-[33px] leading-[110%] tracking-[-2%] font-semibold text-[#1D1D1F99] max-lg:text-[21px]">
                    {props.altText}
                </h2>
                <h1 class="text-[#1D1D1F] text-[64px] leading-[110%] tracking-[-2%] font-semibold max-lg:text-[40px]">
                    3 steps.
                </h1>
            </div>

            <div class="flex max-lg:flex-col-reverse justify-between mt-[40px]">
                {/* Desktop Version */}
                <div class="flex flex-col gap-[20px] max-lg:hidden">
                    <For each={props.steps}>
                        {(step) => (
                            <div class="w-[290px] gap-[20px] flex flex-col p-[20px] bg-[#F5F5F5] rounded-[24px] transition-all duration-300 ease-in-out">
                                {step.icon()}
                                <div class="flex flex-col gap-[8px]">
                                    <h3 class="text-[33px] leading-[120%] tracking-[-2%] font-medium max-lg:text-[21px]">
                                        {step.title}
                                    </h3>
                                    <div
                                        classList={{
                                            "!max-h-[200px]":
                                                activeStep() === step.id,
                                        }}
                                        class="transition-[max-height] duration-500 ease-in-out overflow-hidden max-h-0"
                                    >
                                        <Presence exitBeforeEnter>
                                            {activeStep() === step.id && (
                                                <Motion.p
                                                    animate={{
                                                        opacity: [0, 1],
                                                    }}
                                                    transition={{
                                                        duration: 0.5,
                                                        easing: "ease-in-out",
                                                    }}
                                                    exit={{ opacity: 0 }}
                                                    class="text-[15px] leading-[130%] tracking-[0%] font-normal pb-2"
                                                >
                                                    {step.subTitle}
                                                </Motion.p>
                                            )}
                                        </Presence>
                                    </div>
                                </div>
                            </div>
                        )}
                    </For>
                </div>
                {/* Mobile Version */}
                <div class="pl-[40px] mb-[40px] flex overflow-x-scroll lg:hidden">
                    <For each={props.steps}>
                        {(step) => (
                            <div class="mr-[16px] flex-shrink-0 w-[207px] h-[177px] gap-[20px] flex flex-col p-[20px] bg-[#F5F5F5] rounded-[24px] transition-all duration-300 ease-in-out">
                                {step.icon()}
                                <div class="flex flex-col gap-[8px]">
                                    <h3 class="leading-[120%] tracking-[-2%] font-medium text-[21px]">
                                        {step.title}
                                    </h3>
                                    <div class="leading-[130%] tracking-[0%] font-normal pb-2 text-[15px]">
                                        {step.subTitle}
                                    </div>
                                </div>
                            </div>
                        )}
                    </For>
                </div>
                <div class="w-[316px] h-[322px] mx-auto">
                    <video autoplay muted loop class="w-full h-full">
                        <source src="/disputer_cards1.webm" type="video/webm" />
                    </video>
                </div>
            </div>

            {props.nextButton && (
                <button
                    on:click={props.onNextClick}
                    class="absolute right-[40px] bottom-[20px] shadow-lg bg-white rounded-[64px] max-lg:hidden"
                >
                    <div class="p-[32px] flex items-center justify-center">
                        <ArrowForward />
                    </div>
                </button>
            )}
        </div>
    );
}
