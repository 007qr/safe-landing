import { Component } from 'solid-js'
import { Motion } from 'solid-motionone'
import { DescriptorFlow } from '../Descriptor.types'
import LeftArrow from '~/ui/icons/LeftArrow'
import Receipt from '~/ui/icons/Receipt'

import DescriptorField from '../DescriptorField'

interface Props {
    goBack: () => DescriptorFlow
    navigateTo: (newFlow: DescriptorFlow) => DescriptorFlow
}

const Third: Component<Props> = (props) => {
    return (
        <>
            <div class="flex flex-col gap-[16px]">
                <div class="flex justify-between w-full items-center">
                    <button on:click={() => props.goBack()} class="self-start cursor-pointer">
                        <LeftArrow />
                    </button>
                </div>
                <div class="flex flex-col gap-[16px]">
                    <div class="">
                        <DescriptorText name="NETFLIX.COM" />
                    </div>
                </div>

                <Motion.div
                    animate={{ opacity: [0, 1], transition: { duration: 0.5, easing: 'ease-in-out' } }}
                    class="flex flex-col p-[16px] gap-[16px] absolute w-full h-full top-[124px] left-1/2 -translate-x-1/2"
                >
                    <div class="flex justify-between w-full">
                        <p class="text-[15px] font-inter font-medium text-[#1d1d1f]">Add Descriptor</p>
                        <p
                            class="text-[13px] font-inter font-medium text-[#1d1d1f] cursor-pointer"
                            on:click={(e) => props.navigateTo('add_bulk')}
                        >
                            + Add bulk
                        </p>
                    </div>
                    <DescriptorField />
                </Motion.div>
            </div>
        </>
    )
}

const DescriptorText = ({ name }: { name: string }) => {
    return (
        <>
            <div
                class="w-max mx-auto flex justify-center items-center gap-[4px] font-inter text-[13px] font-mediumleading-[130%] tracking-[0%] p-[4px] rounded-[64px] bg-white"
                style="box-shadow: 0px 4px 32px 0px rgba(29, 29, 31, 0.12);"
            >
                <div class="flex gap-[4px] px-[7px]">
                    <Receipt />
                    {name}
                </div>
            </div>
        </>
    )
}

export default Third
