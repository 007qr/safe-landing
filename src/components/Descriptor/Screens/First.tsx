import { Component } from 'solid-js'
import { DescriptorFlow } from '../Descriptor.types'
import ArrowRight from '~/ui/icons/ArrowRight'

interface Props {
    next: () => DescriptorFlow
}

const First: Component<Props> = (props) => {
    return (
        <div class="items-center flex justify-center w-full h-full bg-transparent">
            <h1
                class="w-[222px] text-center font-bold text-[33px] leading-[110%] tracking-[0%] text-[rgba(0,0,0,0.6)] "
                style="backdrop-filter: blur(48px)"
            >
                Prevent Chargebacks with AI
            </h1>
            <div class="absolute flex justify-end max-w-[374px] w-full mt-auto z-10 bottom-[16px] right-[16px]">
                <button
                    on:click={() => props.next()}
                    class="bg-black cursor-pointer  w-[56px] h-[56px] flex items-center justify-center rounded-full mt-auto self-end"
                >
                    <ArrowRight class="w-[24px h-[24px]" />
                </button>
            </div>
        </div>
    )
}

export default First
