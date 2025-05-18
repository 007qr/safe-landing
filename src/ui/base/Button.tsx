import { Component, createSignal } from "solid-js";
import { Motion } from "solid-motionone";

interface Props {}

const Button: Component<Props> = () => {
  const [counter, setCounter] = createSignal(0);
  const [bg, setBg] = createSignal(500);
  return (
    <>
      <Motion.div animate={{ height: `${bg()}px` }} class="bg-red-500">
        <p>{counter()}</p>
        <button on:click={() => {
            setCounter((v) => v + 1);
            setBg(1000);
        }}>Click me!</button>
      </Motion.div>
    </>
  );
};

export default Button;
