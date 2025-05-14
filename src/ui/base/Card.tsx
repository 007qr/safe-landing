import type { Component, ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'
import { cn } from '~/lib/utils'

const Card: Component<ComponentProps<'div'>> = (props) => {
    const [local, others] = splitProps(props, ['class'])

    return (
        <div
            class={cn(
                'w-[364px] h-[364px] bg-white rounded-[24px] border border-[#1D1D1F14] flex flex-col relative',
                local.class
            )}
            {...others}
        />
    )
}

export { Card }
