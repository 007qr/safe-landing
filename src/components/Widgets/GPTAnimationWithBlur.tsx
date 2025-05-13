import { Accessor, For } from "solid-js";

export default function GPTAnimationWithBlur() {
    const firstLine = "Hey👋 You’re new here.";
    const secondLine = "Let’s get you setup.";
    return (
        <>
            <For each={firstLine.split(" ")}>
                {(item: string, index: Accessor<number>) => (
                    <>
                        <span
                            class={`staggered-animation whitespace-pre inline-block animate-fade-in ${
                                item === "new" ? "font-damion font-medium" : ""
                            }`}
                            style={{
                                "animation-delay": `${(index() + 1) * 200}ms`,
                            }}
                        >
                            {item}
                        </span>
                        <span
                            class="whitespace-pre inline-block animate-fade-in"
                            style={{
                                "animation-delay": `${(index() + 1) * 100}ms`,
                            }}
                            aria-hidden="true"
                        >
                            {" "}
                        </span>
                    </>
                )}
            </For>
            <br />
            <For each={secondLine.split(" ")}>
                {(item: string, index: Accessor<number>) => (
                    <>
                        <span
                            class={`staggered-animation whitespace-pre inline-block animate-fade-in ${
                                item === "setup."
                                    ? "font-damion font-medium"
                                    : ""
                            }`}
                            style={{
                                "animation-delay": `${(index() + 5) * 200}ms`,
                            }}
                        >
                            {item}
                        </span>
                        <span
                            class="whitespace-pre inline-block animate-fade-in"
                            style={{
                                "animation-delay": `${(index() + 1) * 100}ms`,
                            }}
                            aria-hidden="true"
                        >
                            {" "}
                        </span>
                    </>
                )}
            </For>
        </>
    );
}
