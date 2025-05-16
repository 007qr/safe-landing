import { Component, createSignal } from "solid-js";

interface Props {}

const Button: Component<Props> = () => {
    const [counter, setCounter] = createSignal(0);
    return (
        <>
            <p>{counter()}</p>
            <button on:click={() => setCounter(v => v + 1)}>
                Click me!
            </button>
        </>
    )
}

export default Button;