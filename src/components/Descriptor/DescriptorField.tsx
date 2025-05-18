import { createSignal, Show, onMount, createMemo, batch } from 'solid-js'
import EditIcon from '~/ui/icons/Edit'
import SuccessIcon from '~/ui/icons/Success'
import LoadingLightIcon from '~/ui/icons/LoadingLight'
import ArrowRight from '~/ui/icons/ArrowRight'
import { createDescriptorStore } from './Descriptor.store'
import { TokenProvider } from '~/lib/auth'

export default function DescriptorField(props: {
    id?: string
    merchantId?: string
    instanceId?: string
    tokenProvider: TokenProvider
}) {
    const descriptorStore = createDescriptorStore(props.tokenProvider)
    const [isEditingContact, setIsEditingContact] = createSignal(false)
    const [showDescriptorLabel, setShowDescriptorLabel] = createSignal(true)
    const [error, setError] = createSignal('')
    const [buttonState, setButtonState] = createSignal<'next' | 'loading' | 'success'>('next')
    const [isCompleted, setIsCompleted] = createSignal(false)

    const descriptorWidth = createMemo(() => `${(descriptorStore.store.paymentDescriptor || 'Descriptor').length + (isEditingContact() ? 1 : 10)}ch`);
    const contactWidth = createMemo(() => `${(descriptorStore.store.paymentDescriptorContact || 'Contact').length + 4}ch`)

    let descriptorRef: HTMLDivElement | undefined

    onMount(() => {
        descriptorStore.setMerchantId(props.merchantId || '415439')
    })

    const triggerAnimation = (direction: 'up' | 'reverse') => {
        if (!descriptorRef) return

        descriptorRef.classList.remove('animate-move-up', 'animate-move-up-reverse')
        void descriptorRef.offsetWidth // force reflow

        descriptorRef.classList.add(direction === 'up' ? 'animate-move-up' : 'animate-move-up-reverse')
    }

    const handleNextButton = async () => {
        if (isCompleted()) return

        if (isEditingContact()) {
            setError('')

            const validationErrors = descriptorStore.validate()
            const firstError =
                validationErrors.paymentDescriptor[0] ||
                validationErrors.paymentDescriptorContact[0] ||
                validationErrors.merchantId[0] ||
                validationErrors.global[0]

            if (firstError) {
                setError(firstError)
                setButtonState('next')
                return
            }

            try {
                setButtonState('loading')
                await descriptorStore.createDescriptor({
                    merchantId: descriptorStore.store.merchantId,
                    paymentDescriptor: descriptorStore.store.paymentDescriptor,
                    paymentDescriptorContact: descriptorStore.store.paymentDescriptorContact,
                })

                batch(() => {
                    setButtonState('success')
                    setIsCompleted(true)
                })
            } catch (e: any) {
                console.error('Error creating descriptor: ', e)

                const errorCode = e.message?.includes('409') ? 409 : undefined
                const validationErrorsWithApi = descriptorStore.validate(errorCode)

                batch(() => {
                    setError(validationErrorsWithApi.global[0] || 'Failed to create descriptor. Please try again.')
                    setButtonState('next')
                })
            }
        } else {
            triggerAnimation('up')
            batch(() => {
                setIsEditingContact(true)
                setButtonState('next')
            })
            setTimeout(() => setShowDescriptorLabel(false), 300)
        }
    }

    return (
        <div
            class={`bg-[#F5F5F5] min-h-[54px] relative flex flex-col justify-center p-[8px] rounded-[16px] w-full max-w-[332px] h-[54px] tracking-[0%] leading-[130%] ${
                error() ? 'border border-red-500' : ''
            }`}
            id={props.id}
            classList={{ 'opacity-80': isCompleted() }}
        >
            <div>
                <p
                    class="text-[#6B6B6B] select-none text-[12px] font-inter absolute top-[8px] tracking-[0%] leading-[130%] transition-opacity duration-300"
                    style={{
                        opacity: showDescriptorLabel() ? 1 : 0,
                        'pointer-events': 'none',
                    }}
                    classList={{
                        'opacity-100': showDescriptorLabel(),
                        'opacity-0': !showDescriptorLabel()
                    }}
                >
                    {isCompleted() ? 'Descriptor Created' : 'Enter Descriptor'}
                </p>

                <div class="flex absolute top-[26px] z-10 bg-[#f5f5f5]" ref={descriptorRef}>
                    <input
                        disabled={isEditingContact() || isCompleted()}
                        value={descriptorStore.store.paymentDescriptor}
                        onInput={(e) => {
                            if (!isCompleted()) descriptorStore.setPaymentDescriptor(e.target.value ?? '')
                        }}
                        style={{ width: descriptorWidth() }}
                        name="descriptor_name"
                        type="text"
                        placeholder="Descriptor"
                        class="border-none outline-none font-inter text-[#1d1d1f] font-[15px] leading-[130%] tracking-[0%] max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis"
                    />

                    <Show when={isEditingContact() && !isCompleted()}>
                        <button
                            class="shrink-0 cursor-pointer"
                            onClick={() => {
                                triggerAnimation('reverse')
                                batch(() => {
                                    setIsEditingContact(false)
                                    setShowDescriptorLabel(true)
                                    setError('')
                                })
                            }}
                        >
                            <EditIcon />
                        </button>
                    </Show>
                </div>

                <div class="flex gap-[8px] absolute top-[26px]">
                    <input
                        disabled={!isEditingContact() || isCompleted()}
                        value={descriptorStore.store.paymentDescriptorContact}
                        onInput={(e) => {
                            if (!isCompleted()) descriptorStore.setPaymentDescriptorContact(e.currentTarget.value ?? '')
                        }}
                        style={{ width: contactWidth() }}
                        type="text"
                        name="descriptor_contact"
                        placeholder="Enter Contact"
                        class="border-none outline-none font-inter text-[#1d1d1f] font-[15px] leading-[130%] tracking-[0%] max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis"
                    />
                </div>
            </div>

            <Show when={error() !== ''}>
                <p class="text-red-500 text-xs absolute bottom-[-22px] left-[8px]">{error()}</p>
            </Show>

            <button
                onClick={handleNextButton}
                disabled={buttonState() === 'loading' || isCompleted()}
                class="absolute bottom-[8px] right-[8px] w-[20px] h-[20px] flex items-center justify-center rounded-[24px]"
                classList={{
                    'opacity-80': isCompleted(),
                    'cursor-pointer': !isCompleted(),
                    'bg-green-500': buttonState() === 'success',
                    'bg-black': buttonState() !== 'success',
                }}
            >
                <Show when={buttonState() === 'loading'}>
                    <LoadingLightIcon class="animate-spin" />
                </Show>
                <Show when={buttonState() === 'next'}>
                    <ArrowRight class="w-[12px] h-[12px]" />
                </Show>
                <Show when={buttonState() === 'success'}>
                    <SuccessIcon />
                </Show>
            </button>
        </div>
    )
}
