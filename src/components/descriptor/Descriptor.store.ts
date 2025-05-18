import { createStore } from 'solid-js/store'
import { onCleanup } from 'solid-js'
import {
    DescriptorStatus,
    DescriptorPayload,
    Descriptor,
    DescriptorValidationErrors,
    DescriptorValidationMessages,
    createDescriptorValidationErrors,
} from './Descriptor.types'
import { TokenProvider } from '~/lib/auth'

export const createDescriptorStore = (token: TokenProvider) => {
    return createActualDescriptorStore(token)
}

function createActualDescriptorStore(tokenProvider: TokenProvider) {
    const [store, setStore] = createStore<{
        merchantId: string
        paymentDescriptor: string
        paymentDescriptorContact: string
    }>({
        merchantId: '',
        paymentDescriptor: '',
        paymentDescriptorContact: '',
    })

    const controller = new AbortController()
    const API = import.meta.env.VITE_STOPPER_API_ENDPOINT

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

    function getFormattedDate(): string {
        return new Date().toISOString().split('T')[0]
    }

    async function authenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
        // Get auth tokens from token provider
        const tokens = await tokenProvider.getAuthTokens();
        if (!tokens) {
            throw new Error("Not authenticated");
        }

        // Create request with auth header
        const authOptions: RequestInit = {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${tokens.authTokens?.token}`,
                'Content-Type': 'application/json',
            },
            signal: controller.signal,
        };

        // Send request
        let response = await fetch(url, authOptions);

        // Handle 401 token expiration
        if (response.status === 401) {
            // Try to refresh token
            const refreshed = await tokenProvider.refreshAuthTokens();
            if (refreshed) {
                // Get new tokens and retry request
                const newTokens = await tokenProvider.getAuthTokens();
                if (!newTokens) {
                    throw new Error("Unable to refresh authentication");
                }

                const retryOptions: RequestInit = {
                    ...options,
                    headers: {
                        ...options.headers,
                        'Authorization': `Bearer ${newTokens.authTokens?.token}`,
                        'Content-Type': 'application/json',
                    },
                    signal: controller.signal,
                };

                response = await fetch(url, retryOptions);
            }
        }

        return response;
    }

    async function createDescriptor(
        payload: Omit<DescriptorPayload, 'status' | 'startDate' | 'appliedBy' | 'name' | 'partnerDescriptorId'>
    ): Promise<Descriptor> {
        const tokens = await tokenProvider.getAuthTokens();
        if (!tokens) {
            throw new Error("Not authenticated");
        }
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

        const res = await authenticatedRequest(
            `${API}/merchants/${payload.merchantId}/descriptors`,
            {
                method: 'POST',
                body: JSON.stringify(fullPayload),
            }
        );

        if (!res.ok) {
            const text = await res.text()
            throw new Error(`${res.status}: ${text}`)
        }

        return (await res.json()) as Descriptor
    }

    async function updateDescriptor(payload: Pick<DescriptorPayload, 'partnerDescriptorId' | 'merchantId' | 'status'>) {
        const data = {
            partner_merchant_id: payload.merchantId,
            partner_descriptor_id: payload.partnerDescriptorId,
            status: payload.status,
        }

        const res = await authenticatedRequest(
            `${API}/merchants/${payload.merchantId}/descriptors/${payload.partnerDescriptorId}`,
            {
                method: 'PUT',
                body: JSON.stringify(data),
            }
        );

        if (!res.ok) {
            const text = await res.text()
            throw new Error(`${res.status}: ${text}`)
        }

        return (await res.json()) as Descriptor
    }

    async function listDescriptor({ merchantId }: { merchantId: string }) {
        const res = await authenticatedRequest(
            `${API}/merchants/${merchantId}/descriptors`,
            { method: 'GET' }
        );

        const jsonRes = await res.json()

        return jsonRes.data as Descriptor[]
    }

    return {
        store,
        setMerchantId,
        setPaymentDescriptor,
        setPaymentDescriptorContact,
        validate,
        createDescriptor,
        updateDescriptor,
        listDescriptor
    }
}
