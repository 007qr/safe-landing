import { Component } from 'solid-js'
import { DescriptorFlow } from '../Descriptor.types'

interface Props {
    next: () => DescriptorFlow

}
const Fourth: Component<Props> = (props) => {
    return (
        <>
            <div class='flex flex-col justify-between h-full'>
                <h3 class="mt-[35px] text-[21px] font-medium leading-[130%] tracking-[0%] text-[#1D1D1F] font-inter text-center">
                    You’re all set!
                </h3>
                <p class="text-center font-inter text-[13px] leading-[130%] tracking-[0%] pb-[7px]">
                    Your Payment Descriptors are added. We’ll let you know if anything else is needed.
                </p>
            </div>
        </>
    )
}

export default Fourth
