import { For } from "solid-js";

export default function RippleCircle() {
    const ripples = Array.from({ length: 6 }); // Number of ripples

    return (
        <div class="w-full h-screen flex justify-center items-center bg-[#0d0d0d]">
            <div class="relative w-16 h-16 flex items-center justify-center">
                {/* Ripple waves */}
                <span class="absolute w-full h-full rounded-full border-2 border-[#53c186] bg-[#121212] z-9" />
                <span class="absolute z-10 animate-blink w-1 h-1 bg-[#54c186] -translate-[50px] rounded-full" style="animation-delay: 3400ms" />
                <span class="absolute z-10 animate-blink w-1 h-1 bg-[#54c186] -translate-y-[50px] rounded-full" style="animation-delay: 3600ms"/>
                <span class="absolute z-10 animate-blink w-1 h-1 bg-[#54c186] -translate-x-[50px] rounded-full" style="animation-delay: 3800ms"/>
                <span class="w-full h-full absolute rounded-full scale-[3.6] animate-radar" style="background: conic-gradient(#0d0d0d 0deg, #0d0d0d 90deg, #0d0d0d 180deg, #0d0d0d 270deg, #161616 360deg); animation-duration: 4s"></span>
                <For each={ripples}>
                    {(_, index) => (
                        <span
                            class="absolute w-full h-full rounded-full border border-[#3d3d3d] animate-ripple bg-[#242424]"
                            style={{
                                "animation-delay": `${index() * 0.6}s`, // staggered start
                            }}
                        ></span>
                    )}
                </For>
                {/* Center circle */}
                <div class="w-2 h-2 rounded-full z-10 bg-[#53c186] shadow-lg">
                <div class="top-[17%] absolute bg-[#0d0d0d] w-[250px] h-[150px] blur-[18px] -translate-x-1/2">

                </div>
                </div>
            </div>
        </div>
    );
}
