import { Component, For } from 'solid-js'
import { DescriptorFlow } from '../Descriptor.types'
import LeftArrow from '~/ui/icons/LeftArrow'

interface Props {
    next: () => DescriptorFlow
    goBack: () => DescriptorFlow
}

const Second: Component<Props> = (props) => {
    const text1 = 'Here’s how it works —'
    const text2 =
        'We monitor the name your customers see on their bank statements. Then, we intercept any disputes before they hurt you.'
    return (
        <div class="flex flex-col gap-[16px]">
            <div class="flex justify-between w-full items-center">
                <button on:click={() => props.goBack()} class="self-start cursor-pointer">
                    <LeftArrow />
                </button>
                <button
                    class="cursor-pointer font-inter text-[13px] font-medium text-[#494949] self-end"
                    on:click={() => props.next()}
                >
                    Skip
                </button>
            </div>
            <div class="flex flex-col gap-[16px]">
                <span>
                    <For each={text1.split(' ')}>
                        {(el, index) => {
                            const isBold = el === 'how' || el === 'it' || el === 'works' || el === '—'
                            return (
                                <>
                                    <span
                                        style={{
                                            'animation-delay': `${300 + index() * 150}ms`,
                                            'font-weight': `${isBold ? '500' : ''}`,
                                        }}
                                        class="animate-fade-in whitespace-pre text-[15px] leading-[150%] tracking-[0] text-[#1d1df] font-inter   "
                                    >
                                        {el}
                                    </span>
                                    <span> </span>
                                </>
                            )
                        }}
                    </For>
                </span>
                <span>
                    <For each={text2.split(' ')}>
                        {(el, index) => {
                            const isBold = el === 'monitor' || el === 'intercept'
                            return (
                                <>
                                    <span
                                        style={{
                                            'animation-delay': `${800 + index() * 150}ms`,
                                            'font-weight': `${isBold ? '500' : ''}`,
                                        }}
                                        class="animate-fade-in whitespace-pre text-[15px] leading-[150%] tracking-[0] text-[#1d1df] font-inter   "
                                    >
                                        {el}
                                    </span>
                                    <span> </span>
                                </>
                            )
                        }}
                    </For>
                </span>
            </div>
        </div>
    )
}

export default Second
