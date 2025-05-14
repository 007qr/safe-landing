import { createSignal, Show, onMount } from 'solid-js'
import EditIcon from '~/ui/icons/Edit'
import SuccessIcon from '~/ui/icons/Success'
import LoadingLightIcon from '~/ui/icons/LoadingLight'
import ArrowRight from '~/ui/icons/ArrowRight'
import { createDescriptorStore } from './Descriptor.store'


export default function DescriptorField(
    props: {
        id?: string
        merchantId?: string
        instanceId?: string
    } = {}
) {
    const descriptorStore = createDescriptorStore();

    const [isEditingContact, setIsEditingContact] = createSignal(false)
    const [showDescriptorLabel, setShowDescriptorLabel] = createSignal(true)
    const [error, setError] = createSignal<string>('')
    const [buttonState, setButtonState] = createSignal<'next' | 'loading' | 'success'>('next')
    const [isCompleted, setIsCompleted] = createSignal(false)

    let descriptorRef: HTMLDivElement | undefined

    onMount(() => {
        // If merchantId is provided via props, set it in the store
        if (props.merchantId) {
            descriptorStore.setMerchantId(props.merchantId)
        } else {
            // Default merchant ID if not provided
            descriptorStore.setMerchantId('415439')
        }
    })

    const triggerAnimation = (direction: 'up' | 'reverse') => {
        if (!descriptorRef) return

        descriptorRef.classList.remove('animate-move-up', 'animate-move-up-reverse')
        void descriptorRef.offsetWidth // force reflow

        if (direction === 'up') {
            descriptorRef.classList.add('animate-move-up')
        } else {
            descriptorRef.classList.add('animate-move-up-reverse')
        }
    }

    const handleNextButton = async () => {
        // Prevent actions if the form is completed
        if (isCompleted()) return

        if (isEditingContact()) {
            // user has submitted the contact details
            setError('') // Clear previous errors

            // Validate inputs using our store validation
            const validationErrors = descriptorStore.validate()

            if (validationErrors.count > 0) {
                // Show the first validation error - prioritize field-specific errors
                if (validationErrors.paymentDescriptor.length > 0) {
                    setError(validationErrors.paymentDescriptor[0])
                } else if (validationErrors.paymentDescriptorContact.length > 0) {
                    setError(validationErrors.paymentDescriptorContact[0])
                } else if (validationErrors.merchantId.length > 0) {
                    setError(validationErrors.merchantId[0])
                } else if (validationErrors.global.length > 0) {
                    setError(validationErrors.global[0])
                }
                setButtonState('next')
                return
            }

            try {
                setButtonState('loading')

                const descriptor = await descriptorStore.createDescriptor({
                    merchantId: descriptorStore.store.merchantId,
                    paymentDescriptor: descriptorStore.store.paymentDescriptor,
                    paymentDescriptorContact: descriptorStore.store.paymentDescriptorContact,
                })

                // If we get here, it succeeded
                setButtonState('success')
                setIsCompleted(true)
            } catch (e: any) {
                console.error('Error creating descriptor: ', e)

                // Check for specific error types
                let errorCode: number | undefined = undefined

                if (e.message && e.message.includes('409')) {
                    errorCode = 409
                }

                // Validate again with the error code to generate appropriate error messages
                const validationErrorsWithApi = descriptorStore.validate(errorCode)

                // Display appropriate error message
                if (validationErrorsWithApi.global.length > 0) {
                    setError(validationErrorsWithApi.global[0])
                } else {
                    setError('Failed to create descriptor. Please try again.')
                }

                setButtonState('next')
            }
        } else {
            triggerAnimation('up')
            setIsEditingContact(true)
            setButtonState('next')
            setTimeout(() => setShowDescriptorLabel(false), 300)
        }
    }

    return (
        <div
            class={`bg-[#F5F5F5] min-h-[54px] relative flex flex-col justify-center p-[8px] rounded-[16px] w-full max-w-[332px] h-[54px] tracking-[0%] leading-[130%] ${
                error() !== '' ? 'border border-red-500' : ''
            }`}
            id={props.id}
            classList={{ 'opacity-80': isCompleted() }}
        >
            <div>
                <p
                    class={`text-[#6B6B6B] select-none text-[12px] font-inter absolute top-[8px] tracking-[0%] leading-[130%] transition-opacity duration-300`}
                    style={{
                        opacity: showDescriptorLabel() ? 1 : 0,
                        'pointer-events': 'none',
                    }}
                >
                    {isCompleted() ? 'Descriptor Created' : 'Enter Descriptor'}
                </p>
                <div class="flex absolute top-[26px] z-10 bg-[#f5f5f5]" ref={descriptorRef}>
                    <input
                        disabled={isEditingContact() || isCompleted()}
                        value={descriptorStore.store.paymentDescriptor}
                        onInput={(e) => {
                            if (!isCompleted()) {
                                descriptorStore.setPaymentDescriptor(e.target.value ?? '')
                            }
                        }}
                        style={{
                            width: `${
                                !isEditingContact()
                                    ? (descriptorStore.store.paymentDescriptor || 'Descriptor').length + 10
                                    : (descriptorStore.store.paymentDescriptor || 'Descriptor').length + 1
                            }ch`, // +1 for buffer
                        }}
                        type="text"
                        placeholder="Descriptor"
                        class="border-none outline-none font-inter text-[#1d1d1f] font-[15px] leading-[130%] tracking-[0%]
           max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis"
                    />
                    <Show when={isEditingContact() && !isCompleted()}>
                        <button
                            class="shrink-0 cursor-pointer"
                            onClick={() => {
                                triggerAnimation('reverse')
                                setIsEditingContact(false)
                                setShowDescriptorLabel(true)
                                setError('')
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
                            if (!isCompleted()) {
                                descriptorStore.setPaymentDescriptorContact(e.currentTarget.value ?? '')
                            }
                        }}
                        style={{
                            width: `${(descriptorStore.store.paymentDescriptorContact || 'Contact').length + 4}ch`,
                        }}
                        type="text"
                        placeholder="Enter Contact"
                        class="border-none outline-none font-inter text-[#1d1d1f] font-[15px] leading-[130%] tracking-[0%] max-w-[200px]
overflow-hidden whitespace-nowrap text-ellipsis"
                    />
                </div>
            </div>

            <Show when={error() !== ''}>
                <p class="text-red-500 text-xs absolute bottom-[-22px] left-[8px]">{error()}</p>
            </Show>

            <button
                onClick={handleNextButton}
                disabled={buttonState() === 'loading' || isCompleted()}
                class={`absolute bottom-[8px] right-[8px] ${
                    isCompleted() ? 'opacity-80' : 'cursor-pointer'
                } w-[20px] h-[20px] flex items-center justify-center rounded-[24px] ${
                    buttonState() === 'success' ? 'bg-green-500' : 'bg-black'
                }`}
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
