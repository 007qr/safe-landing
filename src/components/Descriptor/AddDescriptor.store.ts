import { createStore } from 'solid-js/store'
import { onCleanup } from 'solid-js'
import {
    DescriptorStatus,
    DescriptorPayload,
    Descriptor,
    DescriptorValidationErrors,
    DescriptorValidationMessages,
    createDescriptorValidationErrors,
} from './AddDescriptor.types' // Adjust import path as needed

function getFormattedDate(): string {
    return new Date().toISOString().split('T')[0]
}

export default function createDescriptorStore(instanceId = 'default') {
    const [store, setStore] = createStore<{
        instanceId: string
        merchantId: string
        paymentDescriptor: string
        paymentDescriptorContact: string
    }>({
        instanceId,
        merchantId: '',
        paymentDescriptor: '',
        paymentDescriptorContact: '',
    })

    const controller = new AbortController()
    const API = 'https://stopper-service.safeapp.workers.dev/api'

    onCleanup(() => controller.abort())

    const setMerchantId = (merchantId: string) => setStore('merchantId', merchantId)
    const setPaymentDescriptor = (paymentDescriptor: string) => setStore('paymentDescriptor', paymentDescriptor)
    const setPaymentDescriptorContact = (paymentDescriptorContact: string) =>
        setStore('paymentDescriptorContact', paymentDescriptorContact)

    const validate = (errorCode?: number): DescriptorValidationErrors => {
        const errors = createDescriptorValidationErrors()

        // Merchant ID
        if (!store.merchantId.trim()) {
            errors.merchantId.push(DescriptorValidationMessages.MerchantIdRequired)
            errors.count++
        }

        // Payment Descriptor
        const pd = store.paymentDescriptor.trim()
        if (pd.length < 4 || pd.length > 22) {
            errors.paymentDescriptor.push(DescriptorValidationMessages.PaymentDescriptorLength)
            errors.count++
        }

        // Contact
        const contact = store.paymentDescriptorContact.trim()
        if (contact.length < 8 || contact.length > 14) {
            errors.paymentDescriptorContact.push(DescriptorValidationMessages.PaymentDescriptorContactLength)
            errors.count++
        }
        if (!/^[\d()+\-\s]+$/.test(contact)) {
            errors.paymentDescriptorContact.push(DescriptorValidationMessages.PaymentDescriptorContactFormat)
            errors.count++
        }

        // API conflict
        if (errorCode === 409) {
            errors.global.push(DescriptorValidationMessages.ConflictError)
            errors.count++
        }

        return errors
    }

    const createDescriptor = async (
        payload: Omit<DescriptorPayload, 'status' | 'startDate' | 'appliedBy' | 'name' | 'partnerDescriptorId'>
    ): Promise<Descriptor> => {
        const partner_descriptor_id = Math.round(Math.random() * 1_000_000).toString()
        const name = `curiouslytech${payload.paymentDescriptor}${payload.paymentDescriptorContact.slice(-4)}`

        const fullPayload = {
            partner_merchant_id: payload.merchantId,
            partner_descriptor_id,
            name,
            applied_by: 'GATEWAY',
            payment_descriptor: payload.paymentDescriptor,
            payment_descriptor_contact: payload.paymentDescriptorContact,
            status: DescriptorStatus.ENABLED,
            start_date: getFormattedDate(),
        }

        const res = await fetch(`${API}/merchants/${payload.merchantId}/descriptors`, {
            method: 'POST',
            body: JSON.stringify(fullPayload),
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal
        })

        if (!res.ok) {
            const text = await res.text()
            throw new Error(`${res.status}: ${text}`)
        }

        return (await res.json()) as Descriptor
    }

    return {
        store,
        setMerchantId,
        setPaymentDescriptor,
        setPaymentDescriptorContact,
        validate,
        createDescriptor,
    }
}
