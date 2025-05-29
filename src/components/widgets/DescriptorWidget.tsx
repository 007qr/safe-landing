import { createSignal, onMount, Show } from "solid-js";
import { Motion } from "solid-motionone";

export default function DescriptorWidget() {
    const [videoCompleted, setVideoCompleted] = createSignal(false);

    onMount(() => {
        // setTimeout(() => setVideoCompleted(true), 5000);
    });

    return (
        <div
            class="w-[364px] h-[364px] bg-white rounded-[24px] overflow-hidden relative"
            style="box-shadow: 0px 4px 2px 0px rgba(0, 0, 0, 0.02);"
        >
            <Motion.div
                initial={{
                    height: "364px",
                    background: "#00000055",
                }}
                animate={{
                    height: videoCompleted() ? "170px" : "364px",
                    background: videoCompleted()
                        ? "linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)"
                        : "#00000055",
                }}
                transition={{
                    duration: 1,
                    easing: "ease-in-out",
                }}
                class="w-full overflow-hidden"
            />

            <Show when={!videoCompleted()}>
                <div class="absolute flex justify-end max-w-[374px] w-full mt-auto z-10 bottom-[16px] right-[16px]">
                    <button
                        on:click={() =>setVideoCompleted(true)}
                        class="bg-black w-[56px] h-[56px] flex items-center justify-center rounded-full mt-auto self-end"
                    >
                        <img
                            src="/arrow-right.svg"
                            alt=""
                            class="w-[24px] h-[24px]"
                        />
                    </button>
                </div>
            </Show>

            <Motion.div>
                <div class="flex flex-col gap-[12px] mt-[30px] mx-[16px]">
                    <div class="flex gap-[2px] flex-col">
                        <h5 class="text-[15px] leading-[130%] tracking-[0%] font-inter font-medium text-[#1D1D1F]">
                            Descriptor
                        </h5>
                        <p class="font-inter text-[13px] leading-[130%] tracking-[0%] font-normal text-[#494949]">
                            Enter the Payment Descriptor that appears on your
                            customer’s statement
                        </p>
                    </div>
                    <div class="bg-[#F5F5F5] flex flex-col gap-0.5 justify-center p-[12px] rounded-[16px] w-full max-w-[332px] h-[58px] tracking-[0%] leading-[130%]">
                        <p class="text-[#6B6B6B] text-[13px] font-inter">
                            Your name
                        </p>
                        <input
                            type="text"
                            class="font-inter text-[15px] outline-none border-none text-[##1D1D1F]"
                            placeholder="type here"
                        />
                    </div>
                </div>
            </Motion.div>
        </div>
    );
}
