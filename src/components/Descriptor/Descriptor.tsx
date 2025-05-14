import { Show } from 'solid-js'

import { Card } from '~/ui/base/Card'
import { FluidGradientContainer } from './FluidGradientContainer'
import { createDescriptorStore, useDescriptorStore } from './Descriptor.store'
import First from './Screens/First'
import Second from './Screens/Second'
import Third from './Screens/Third'
import Fourth from './Screens/Fourth'
import { Presence } from 'solid-motionone'
import AddBulkDescriptor from './Screens/AddBulkDescriptor'
import Default from './Screens/Default'
import ListDescriptor from './Screens/ListDescriptor'

const DescriptorWidget = () => {
    let store = createDescriptorStore()
    const descriptorStore = useDescriptorStore()

    return (
        <>
            <Card
                classList={{ 'p-[16px]': descriptorStore.getFlow() === 'add_bulk' }}
                style="box-shadow: 0px 4px 2px 0px rgba(0, 0, 0, 0.02);"
            >
                <FluidGradientContainer currentFlow={descriptorStore.getFlow()}>
                    <Show when={descriptorStore.getFlow() === 'first'}>
                        <First next={descriptorStore.next} />
                    </Show>

                    <Show when={descriptorStore.getFlow() === 'second'}>
                        <Second next={descriptorStore.next} goBack={descriptorStore.goBack} />
                    </Show>
                    <Show when={descriptorStore.getFlow() === 'third'}>
                        <Third goBack={descriptorStore.goBack} navigateTo={descriptorStore.navigateTo} />
                    </Show>
                    <Show when={descriptorStore.getFlow() === 'fourth'}>
                        <Fourth next={descriptorStore.next} />
                    </Show>
                    <Presence exitBeforeEnter>
                        <Show when={descriptorStore.getFlow() === 'add_bulk'}>
                            <AddBulkDescriptor
                                navigateTo={descriptorStore.navigateTo}
                                isRegistered={descriptorStore.isRegistered}
                            />
                        </Show>
                    </Presence>
                    <Show when={descriptorStore.getFlow() === 'default'}>
                        <Default next={descriptorStore.next} />
                    </Show>
                    <Show when={descriptorStore.getFlow() === 'list_descriptors'}>
                        <ListDescriptor
                            next={descriptorStore.next}
                            goBack={descriptorStore.goBack}
                            navigateTo={descriptorStore.navigateTo}
                        />
                    </Show>
                </FluidGradientContainer>

                <Show when={['second', 'third', 'fourth'].includes(descriptorStore.getFlow())}>
                    <button
                        on:click={descriptorStore.next}
                        class="cursor-pointer absolute w-[332px] mx-[16px] outline-none bottom-[16px] text-[13px] bg-[#ececec] rounded-[12px] p-[12px] leading-[110%] tracking-[-2%] font-medium font-inter"
                    >
                        {
                            {
                                second: 'Continue',
                                third: 'Finish Setup',
                                fourth: 'Done',
                            }[descriptorStore.getFlow()]
                        }
                    </button>
                </Show>
            </Card>
        </>
    )
}

export default DescriptorWidget
