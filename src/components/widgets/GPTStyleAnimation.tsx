import { For } from "solid-js";

export default function GPTStyleAnimation() {
    const text1 =
        "Leslie Alexander initiated a dispute on 26th July 2025 at 5:30 PM";
    const text2 = "Dispute’s reason was “Product not as described”";
    const text3 = "For this reason, I suggest providing following evidences:";
    const text4 =
        "Currently, I’m able to prepare Terms, Privacy, Refund policies";
    const text5 =
        "I sent you an email at you@email.com asking for any further evidence you may provide";

    const texts = [text1, text2, text3, text4, text5];

    return (
        <>
            <div class="w-[260px] h-auto flex flex-col gap-[12px] text-[13px] font-normal leading-[130%] tracking-[0%]">
                <For each={texts}>
                    {(text, i) => {
                        const lineBaseDelay = i() * 1200; // Space between lines

                        return (
                            <div class="flex items-center gap-[12px]">
                                <div
                                    class="animate-fade-in"
                                    style={{
                                        "animation-delay": `${lineBaseDelay}ms`,
                                    }}
                                >
                                    <BulletPoint />
                                </div>

                                <div>
                                    <For each={text.split(" ")}>
                                        {(piece, j) => {
                                            const isBold =
                                                piece === "Leslie" ||
                                                piece === "Alexander" ||
                                                piece === "“Product" ||
                                                piece === "not" ||
                                                piece === "as" ||
                                                piece === "described”";

                                            const wordDelay =
                                                lineBaseDelay +
                                                400 +
                                                j() * 120;

                                            return (
                                                <>
                                                    <span
                                                        class={`animate-fade-in whitespace-pre inline-block font-inter ${
                                                            isBold
                                                                ? "font-medium"
                                                                : ""
                                                        }`}
                                                        style={{
                                                            "animation-delay": `${wordDelay}ms`,
                                                        }}
                                                    >
                                                        {piece}
                                                    </span>
                                                    <span
                                                        class="animate-fade-in whitespace-pre inline-block font-inter"
                                                        style={{
                                                            "animation-delay": `${wordDelay}ms`,
                                                        }}
                                                    >
                                                        {" "}
                                                    </span>
                                                </>
                                            );
                                        }}
                                    </For>
                                </div>
                            </div>
                        );
                    }}
                </For>
            </div>
        </>
    );
}

function BulletPoint() {
    return (
        <>
            <svg
                class="shrink-0"
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="4" cy="4" r="4" fill="#1D1D1F" />
            </svg>
        </>
    );
}
