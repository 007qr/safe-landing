import { createSignal } from 'solid-js'
import ReceiptLight from '~/ui/icons/ReceiptLight'
import ThreeDots from '~/ui/icons/ThreeDots'
import { createDescriptorStore } from './Descriptor.store'
import { TokenProvider } from '~/lib/auth'

interface Props {
    contact: string
    descriptor_name: string
    status: boolean
    merchant_id: string
    descriptor_id: string
    tokenProvider: TokenProvider
}

const DescriptorRow = ({ contact, descriptor_name, merchant_id, descriptor_id, status, tokenProvider }: Props) => {
    const [checked, setChecked] = createSignal<boolean>(status)
    const descriptorStore = createDescriptorStore(tokenProvider)
    const handleChecked = (
        e: Event & {
            currentTarget: HTMLInputElement
            target: HTMLInputElement
        }
    ) => {
        setChecked((v) => !v)
        descriptorStore.updateDescriptor({
            status: e.target.checked ? 'ENABLED' : 'DISABLED',
            merchantId: merchant_id,
            partnerDescriptorId: descriptor_id,
        })
    }

    return (
        <>
            <div class="hover:bg-[#F5F5F5] p-[8px] rounded-[12px] leading-[130%] tracking-[0%] flex justify-between">
                <div class="flex gap-[8px] items-center">
                    <ReceiptLight />
                    <div>
                        <h5 class="font-inter text-[#1D1D1F] text-[13px] font-medium text-ellipsis overflow-hidden whitespace-nowrap w-[192px]">
                            {descriptor_name}
                        </h5>
                        <p class="text-[#494949] text-[13px] font-normal font-inter">{contact}</p>
                    </div>
                </div>
                <div class="flex gap-[8px] items-center">
                    <div class="w-[36px] h-[36px] border border-[#1D1D1F14] flex items-center justify-center rounded-[48px] rotate-90">
                        <ThreeDots />
                    </div>

                    <div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                value=""
                                checked={checked()}
                                onChange={handleChecked}
                                class="sr-only peer"
                            />
                            <div class="w-[36px] h-[20.25px] bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-[#0B9925] transition-colors"></div>
                            <div class="absolute translate-x-[15%] -translate-y-[52%] top-[50%] bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-[110%]"></div>
                        </label>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DescriptorRow;
