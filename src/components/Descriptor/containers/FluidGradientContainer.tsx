import type { Component, ComponentProps } from 'solid-js'
import { createEffect, createSignal, splitProps } from 'solid-js'
import { cn } from '~/lib/utils'
import { Motion } from 'solid-motionone'
import { DescriptorFlow } from '../DescriptorFlow.types'
import { first, fourth, second, third, addBulk, defaultAnimation } from './FluidGradientContainer.types'


const FluidGradientContainer: Component<ComponentProps<'div'> & { currentFlow: DescriptorFlow }> = (props) => {
    const [local, others] = splitProps(props, ['class', 'currentFlow'])
    const [animation, setAnimation] = createSignal(first);

    createEffect(() => {
        switch (local.currentFlow) {
            case 'first':
                setAnimation(first);
                break;
            case 'second':
                setAnimation(second);
                break;
            case 'third':
                setAnimation(third);
                break;
            case 'fourth':
                setAnimation(fourth);
                break;
            case 'add_bulk':
                setAnimation(addBulk);
                break;
            case 'default':
                setAnimation(defaultAnimation);
                break;
            case 'list_descriptors':
                break;
        }
    })

    return (
        <Motion.div
            animate={animation()}
            classList={{
                'rounded-b-none p-[16px]': ['second', 'third', 'fourth'].includes(local.currentFlow),
            }}
            class={cn(' w-full flex flex-col gap-[16px] rounded-[24px] ', local.class)}
            {...others}
        />
    )
}

export { FluidGradientContainer }
