import { Component } from 'solid-js'
import { DescriptorFlow } from '../Descriptor.types'
import Receipt from '~/ui/icons/Receipt'
import RadarAnimation from '../RadarAnimtion'

interface Props {
    next: () => DescriptorFlow
}

const Default: Component<Props> = (props) => {
    return (
        <div class='w-full h-full flex items-center justify-center'>
            <RadarAnimation />
            <span
                on:click={() => {
                    props.next();
                }}
                class="cursor-pointer rounded-[64px] absolute w-[36px] h-[36px] bg-white flex items-center justify-center top-[16px] right-[16px]"
                style="box-shadow: 0px 4px 32px 0px rgba(29, 29, 31, 0.12);"
            >
                <Receipt />
            </span>
        </div>
    )
}

export default Default;
