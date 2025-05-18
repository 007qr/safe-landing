import { For } from "solid-js";

export default function RadarAnimation() {
    const ripples = Array.from({ length: 5 });

    return (
        <div class="relative w-[170px] h-[170px] flex items-center justify-center">
            {/* Static radar background with grid lines */}
            <div class="absolute w-full h-full rounded-full border-2 border-gray-500 opacity-30" />

            {/* Radar sweep animation */}
            <div class="absolute w-full h-full rounded-full overflow-hidden z-9">
                <div
                    class="w-full h-full absolute origin-center animate-spin"
                    style={{
                        "animation-duration": "4s",
                        "animation-timing-function": "linear",
                        "animation-iteration-count": "infinite",
                        "transform-origin": "center",
                        background:
                            "conic-gradient(rgba(75, 85, 99, 0.9) 0deg, rgba(75, 85, 99, 0.6) 30deg, rgba(75, 85, 99, 0.3) 60deg, transparent 90deg, transparent 360deg)",
                    }}
                ></div>
            </div>

            {/* Synchronized blips */}
            <span
                class="absolute z-11 w-1.5 h-1.5 bg-gray-800 rounded-full transition-opacity animate-blink"
                style={{
                    top: "35%",
                    left: "40%",
                    opacity: 1,
                    "animation-delay": "150ms"
                }}
            />

            <span
                class="absolute z-11 w-1.5 h-1.5 bg-gray-800 rounded-full transition-opacity animate-blink"
                style={{
                    top: "20%",
                    left: "20%",
                    opacity: 1,
                    "animation-delay": "250ms"
                }}
            />

            
            <span
                class="absolute z-11 w-1.5 h-1.5 bg-gray-800 rounded-full transition-opacity animate-blink"
                style={{
                    top: "30%",
                    left: "80%",
                    opacity: 1,
                    "animation-delay": "1250ms"
                }}
            /> {/* This is on the right side */}

            <span
                class="absolute z-11 w-1.5 h-1.5 bg-gray-800 rounded-full transition-opacity animate-blink"
                style={{
                    top: "45%",
                    left: "20%",
                    opacity: 1,
                    "animation-delay": "450ms"
                }}
            />

            <span
                class="absolute z-11 w-1.5 h-1.5 bg-gray-800 rounded-full transition-opacity animate-blink"
                style={{
                    top: "35%",
                    left: "40%",
                    "animation-delay": "550ms"
                }}
            />

            <span
                class="absolute z-11 w-1.5 h-1.5 bg-gray-800 rounded-full transition-opacity animate-blink"
                style={{
                    top: "35%",
                    left: "70%",
                    "animation-delay": "1300ms"
                }}
            /> {/* This is on the right side */}

            {/* Ripple effects */}
            <For each={ripples}>
                {(_, index) => (
                    <span
                        class="absolute w-full h-full rounded-full border border-gray-300 bg-gray-200 animate-ripple opacity-0"
                        style={{
                            "animation-delay": `${index() * 1.5}s`,
                            "animation-duration": "6s",
                        }}
                    />
                )}
            </For>

            {/* Center point */}
            <div class="w-2 h-2 rounded-full z-10 bg-gray-600 shadow-lg">
                <div class="absolute inset-0 bg-gray-300 rounded-full opacity-90" />
            </div>

            {/* Light blur effect */}
            <div class="w-[300px] h-[170px] blur-md bg-white absolute top-1/2 z-10"></div>
        </div>
    );
}
