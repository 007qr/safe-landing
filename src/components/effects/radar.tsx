import { For, createSignal, onMount, onCleanup } from "solid-js";

export default function RadarAnimation() {
    const ripples = Array.from({ length: 5 });

    // Create signals for blips visibility
    const [isBlip1Visible, setBlip1Visible] = createSignal(false);
    const [isBlip2Visible, setBlip2Visible] = createSignal(false);
    const [isBlip3Visible, setBlip3Visible] = createSignal(false);

    const blip1Angle = 135; 
    const blip2Angle = 45; 
    const blip3Angle = 225;

    const calculateSweepAngle = (timestamp: any) => {
        const anglePerMs = 360 / 4000;
        return (timestamp % 4000) * anglePerMs;
    };

    const isSweepNearAngle = (
        sweepAngle: any,
        targetAngle: any,
        tolerance = 20
    ) => {
        return Math.abs(sweepAngle - targetAngle) < tolerance;
    };

    onMount(() => {
        let animationFrame: any;

        const updateBlips = (timestamp: any) => {
            const currentAngle = calculateSweepAngle(timestamp);

            setBlip1Visible(isSweepNearAngle(currentAngle, blip1Angle));
            setBlip2Visible(isSweepNearAngle(currentAngle, blip2Angle));
            setBlip3Visible(isSweepNearAngle(currentAngle, blip3Angle));

            animationFrame = requestAnimationFrame(updateBlips);
        };

        animationFrame = requestAnimationFrame(updateBlips);

        onCleanup(() => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        });
    });

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
                class="absolute z-11 w-1.5 h-1.5 bg-gray-800 rounded-full transition-opacity duration-300 animate-blink"
                style={{
                    top: "35%",
                    left: "40%",
                    opacity: 1,
                    "animation-delay": "100ms"
                }}
            />

            <span
                class="absolute z-11 w-1.5 h-1.5 bg-gray-800 rounded-full transition-opacity duration-300 animate-blink"
                style={{
                    top: "20%",
                    left: "20%",
                    opacity: 1,
                    "animation-delay": "200ms"
                }}
            />

            
            <span
                class="absolute z-11 w-1.5 h-1.5 bg-gray-800 rounded-full transition-opacity duration-300 animate-blink"
                style={{
                    top: "30%",
                    left: "80%",
                    opacity: 1,
                    "animation-delay": "1000ms"
                }}
            />

            <span
                class="absolute z-11 w-1.5 h-1.5 bg-gray-800 rounded-full transition-opacity duration-300 animate-blink"
                style={{
                    top: "45%",
                    left: "20%",
                    opacity: 1,
                    "animation-delay": "400ms"
                }}
            />

            <span
                class="absolute z-11 w-1.5 h-1.5 bg-gray-800 rounded-full transition-opacity duration-300 animate-blink"
                style={{
                    top: "35%",
                    left: "40%",
                    "animation-delay": "800ms"
                }}
            />

            <span
                class="absolute z-11 w-1.5 h-1.5 bg-gray-800 rounded-full transition-opacity duration-300 animate-blink"
                style={{
                    top: "35%",
                    left: "70%",
                    "animation-delay": "800ms"
                }}
            />

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
