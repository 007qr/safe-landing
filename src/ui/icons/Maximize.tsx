import { Component } from "solid-js";
import { IconProps } from "./Icon.type";
import { cn } from "~/lib/utils";

const Maximize: Component<IconProps> = (props) => {

  return (
    <svg class={cn(props.class)} xmlns="http://www.w3.org/2000/svg" width={props.width ?? "32"} height={props.height ?? "32"} viewBox="0 0 28 28"><path fill="currentColor" d="M3 5.75A2.75 2.75 0 0 1 5.75 3h3.5a.75.75 0 0 1 0 1.5h-3.5c-.69 0-1.25.56-1.25 1.25v3.5a.75.75 0 0 1-1.5 0zm15-2a.75.75 0 0 1 .75-.75h3.5A2.75 2.75 0 0 1 25 5.75v3.5a.75.75 0 0 1-1.5 0v-3.5c0-.69-.56-1.25-1.25-1.25h-3.5a.75.75 0 0 1-.75-.75M3.75 18a.75.75 0 0 1 .75.75v3.5c0 .69.56 1.25 1.25 1.25h3.5a.75.75 0 0 1 0 1.5h-3.5A2.75 2.75 0 0 1 3 22.25v-3.5a.75.75 0 0 1 .75-.75m20.5 0a.75.75 0 0 1 .75.75v3.5A2.75 2.75 0 0 1 22.25 25h-3.5a.75.75 0 0 1 0-1.5h3.5c.69 0 1.25-.56 1.25-1.25v-3.5a.75.75 0 0 1 .75-.75"/></svg>
  );
};


export default Maximize;
