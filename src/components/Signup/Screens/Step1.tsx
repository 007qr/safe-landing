import { Setter } from "solid-js";
import ArrowForward from "~/ui/icons/ArrowForward";
import { SignUpModalFlow } from "~/utils/types";

interface Props {
    title: string;
    setFlow: Setter<SignUpModalFlow>;
}

export default function Step1(props: Props) {
    return (
        <>
            {/* <video
                autoplay
                muted
                loop
                class="absolute w-[90%] h-[90%] object-cover"
            >
                <source src="/masked-video.webm" type="video/webm" />
            </video> */}

            <h1
                class="max-lg:text-[48px] text-[64px] font-bold leading-[110%] tracking-[-2%] p-[32px] lg:p-[75px]  whitespace-pre-line"
                style={{
                    "background-image":
                        "linear-gradient(to right, #67e8f9, #3b82f6, #1d4ed8)",
                    "-webkit-background-clip": "text",
                    "-moz-background-clip": "text",
                    "background-clip": "text",
                    color: "transparent",
                    "-webkit-text-fill-color": "transparent",
                    // "text-fill-color": "transparent",
                }}
            >
                {props.title}
            </h1>
            {/* <h1 class="[transform:translate3d(0,0,0)] rounded-[48px] max-lg:text-[48px] break-words flex items-center justify-center p-[32px] lg:p-[75px] text-[64px] absolute top-0 left-0 w-full h-full bg-white text-black font-bold leading-[110%] tracking-[-2%] mix-blend-screen">
                {props.title}
            </h1> */}

            {/* Button */}
            <button
                on:click={() => props.setFlow("email")}
                class="text-[17px] leading-[110%] tracking-[-2%] absolute flex gap-[10px] items-center bg-black py-[32px] px-[96px] max-lg:px-[72px] max-lg:py-[28px] w-max text-white rounded-[64px] bottom-[20px] left-1/2 -translate-x-1/2 z-10 "
            >
                Start for free <ArrowForward stroke="white" />
            </button>
        </>
    );
}
