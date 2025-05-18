import { Show } from 'solid-js'
import { Card } from '~/ui/base/Card'
import { FluidGradientContainer } from '~/components/Descriptor/container/FluidGradientContainer';
import First from '~/components/Descriptor/screens/First';
import Second from '~/components/Descriptor/screens/Second'
import Third from '~/components/Descriptor/screens/Third'
import Fourth from '~/components/Descriptor/screens/Fourth'
import { Presence } from 'solid-motionone'
import AddBulkDescriptor from '~/components/Descriptor/screens/AddBulkDescriptor'
import Default from '~/components/Descriptor/screens/Default'
import ListDescriptor from '~/components/Descriptor/screens/ListDescriptor'
import { provideDescriptorFlow } from '~/components/Descriptor/DescriptorFlowProvider';
import { TokenProvider } from '~/lib/auth'

const Descriptor = (tokenProvider: TokenProvider) => {
    const descriptorFlowStore = provideDescriptorFlow()

    return (
        <>
            <Card
                classList={{ 'p-[16px]': descriptorFlowStore.getFlow() === 'add_bulk' }}
                style="box-shadow: 0px 4px 2px 0px rgba(0, 0, 0, 0.02);"
            >
                {/* <FluidGradientContainer currentFlow={descriptorFlowStore.getFlow}> */}
                    <Show when={descriptorFlowStore.getFlow() === 'first'}>
                        <First next={descriptorFlowStore.next} />
                    </Show>

                    <Show when={descriptorFlowStore.getFlow() === 'second'}>
                        <Second next={descriptorFlowStore.next} goBack={descriptorFlowStore.goBack} />
                    </Show>
                    <Show when={descriptorFlowStore.getFlow() === 'third'}>
                        <Third goBack={descriptorFlowStore.goBack} navigateTo={descriptorFlowStore.navigateTo} tokenProvider={tokenProvider} />
                    </Show>
                    <Show when={descriptorFlowStore.getFlow() === 'fourth'}>
                        <Fourth next={descriptorFlowStore.next} />
                    </Show>
                    <Presence exitBeforeEnter>
                        <Show when={descriptorFlowStore.getFlow() === 'add_bulk'}>
                            <AddBulkDescriptor
                                navigateTo={descriptorFlowStore.navigateTo}
                                isRegistered={descriptorFlowStore.isRegistered}
                                tokenProvider={tokenProvider}
                            />
                        </Show>
                    </Presence>
                    <Show when={descriptorFlowStore.getFlow() === 'default'}>
                        <Default next={descriptorFlowStore.next} />
                    </Show>
                    <Show when={descriptorFlowStore.getFlow() === 'list_descriptors'}>
                        <ListDescriptor
                            next={descriptorFlowStore.next}
                            goBack={descriptorFlowStore.goBack}
                            navigateTo={descriptorFlowStore.navigateTo}
                            tokenProvider={tokenProvider}
                        />
                    </Show>
                {/* </FluidGradientContainer> */}

                <Show when={['second', 'third', 'fourth'].includes(descriptorFlowStore.getFlow())}>
                    <button
                        on:click={() =>{ console.log("next button clicked: "); descriptorFlowStore.next()}}
                        class="cursor-pointer absolute w-[332px] mx-[16px] outline-none bottom-[16px] text-[13px] bg-[#ececec] rounded-[12px] p-[12px] leading-[110%] tracking-[-2%] font-medium font-inter"
                    >
                        {
                            {
                                second: 'Continue',
                                third: 'Finish Setup',
                                fourth: 'Done',
                            }[descriptorFlowStore.getFlow() as 'second' | 'third' | 'fourth']
                        }
                    </button>
                </Show>
            </Card>
        </>
    )
}

export default Descriptor
