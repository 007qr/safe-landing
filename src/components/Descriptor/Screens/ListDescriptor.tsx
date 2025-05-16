import { Component, createResource, For, Show } from 'solid-js'
import { DescriptorFlow } from '../DescriptorFlow.types'
import DescriptorRow from '../DescriptorRow'
import LoadingIcon from '~/ui/icons/Loading'
// import { listDescriptors } from '~/lib/descriptorApi'
import LeftArrow from '~/ui/icons/LeftArrow'
import { createDescriptorStore } from '../Descriptor.store'
import { TokenProvider } from '~/lib/auth'

interface Props {
    goBack: () => DescriptorFlow
    next: () => DescriptorFlow
    navigateTo: (newFlow: DescriptorFlow) => DescriptorFlow
    tokenProvider: TokenProvider
}

const ListDescriptor: Component<Props> = (props) => {
    const merchant_id = '415439'
    const descriptorStore = createDescriptorStore(props.tokenProvider)
    const [data] = createResource({ merchantId: merchant_id }, descriptorStore.listDescriptor)

    return (
        <>
            <div class="w-full h-full p-[16px]">
                <div class="flex justify-between items-center">
                    <button on:click={() => props.goBack()} class="self-start cursor-pointer">
                        <LeftArrow />
                    </button>
                    <h2 class="self-center font-medium text-[17px] leading-[130%] tracking-[0%] font-inter">
                        Descriptors
                    </h2>
                    <div class="w-[24px] h-[24px]"></div>
                </div>
                <div>
                    <div class="pt-[16px] h-[265px] overflow-y-auto custom-scrollbar">
                        <div
                            class="flex flex-col gap-[4px] "
                            classList={{
                                'items-center justify-center h-full': data.loading,
                            }}
                        >
                            <Show when={!data.loading} fallback={<LoadingIcon isLoading={true} />}>
                                <For each={data()}>
                                    {(item) => (
                                        <>
                                            <DescriptorRow
                                                descriptor_name={item.payment_descriptor}
                                                contact={item.payment_descriptor_contact}
                                                status={item.status === 'ENABLED' ? true : false}
                                                merchant_id={item.partner_merchant_id}
                                                descriptor_id={item.id}
                                            />
                                            <DescriptorRow
                                                descriptor_name={item.payment_descriptor}
                                                contact={item.payment_descriptor_contact}
                                                status={item.status === 'ENABLED' ? true : false}
                                                merchant_id={item.partner_merchant_id}
                                                descriptor_id={item.id}
                                            />
                                        </>
                                    )}
                                </For>
                            </Show>
                        </div>
                    </div>
                    <footer class="border-t-[#1D1D1F14] border-t mt-auto">
                        <button
                            on:click={() => props.next()}
                            class="w-max bg-[#F5F5F5] mt-[16px] cursor-pointer p-[4px] rounded-[24px] font-inter leading-[130%] tracking-[0%] text-[13px] font-medium"
                        >
                            + Add bulk
                        </button>
                    </footer>
                </div>
            </div>
        </>
    )
}

export default ListDescriptor
