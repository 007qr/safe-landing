import type { Component, ComponentProps } from "solid-js";
import { createMemo } from "solid-js";
import { cn } from "~/lib/utils";
import { Motion } from "solid-motionone";
import { DescriptorFlow } from "../DescriptorFlow.types";
import {
  first,
  fourth,
  second,
  third,
  addBulk,
  defaultAnimation,
} from "./FluidGradientContainer.types";

const animMap: Record<DescriptorFlow, typeof first> = {
  first,
  second,
  third,
  fourth,
  add_bulk: addBulk,
  default: defaultAnimation,
  list_descriptors: defaultAnimation,
};

const FluidGradientContainer: Component<
  ComponentProps<"div"> & { currentFlow: () => DescriptorFlow }
> = (props) => {
  const animation = createMemo(
    () => animMap[props.currentFlow()] ?? defaultAnimation
  );

  return (
    <Motion.div
      animate={animation()}
      class={cn(
        "p-[16px] h-full w-full flex flex-col gap-[16px] rounded-[24px]",
        props.class
      )}
      {...props}
    />
  );
};

export { FluidGradientContainer };
