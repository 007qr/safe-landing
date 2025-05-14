import { createResource, createSignal, createEffect } from 'solid-js'

interface Descriptor {
    id: string
    payment_descriptor: string
    payment_descriptor_contact: string
    status: string
    partner_merchant_id: string
    start_date: string
}

const API = import.meta.env.VITE_STOPPER_API_ENDPOINT;

const fetchDescriptorsByMerchantId = async (merchantId: string): Promise<Descriptor[]> => {
    const response = await fetch(`${API}/merchants/${merchantId}/descriptors`, { method: 'GET' })
    if (!response.ok) throw new Error('getDescriptorsForMerchant Error')
    return (await response.json()) as Descriptor[]
}

export const createListDescriptorStore = (merchantId: string) => {
    const [refetchKey, setRefetchKey] = createSignal(1)

    const [descriptors, { mutate }] = createResource<Descriptor[], { merchantId: string; refetchKey: number }>(
        () => ({ merchantId, refetchKey: refetchKey() }),
        (state) => state.refetchKey && fetchDescriptorsByMerchantId(state.merchantId),
        { initialValue: [] }
    )

    const [selectedDescriptor, setSelectedDescriptor] = createSignal<Descriptor | null>(null)

    const refetchDescriptors = async () => {
        setRefetchKey((key) => key + 1)
        while (descriptors.loading) {
            await new Promise((resolve) => setTimeout(resolve, 100))
        }
    }

    const getDescriptorById = (id: string) => descriptors().find((d) => d.id === id)

    const clear = () => {
        mutate([]) // Clear descriptors
        setSelectedDescriptor(null)
    }

    createEffect(() => {
        if (descriptors().length > 0 && !selectedDescriptor()) {
            setSelectedDescriptor(descriptors()[0])
        }
    })

    return {
        descriptors,
        selectedDescriptor,
        setSelectedDescriptor,
        getDescriptorById,
        refetchDescriptors,
        clear,
    }
}
