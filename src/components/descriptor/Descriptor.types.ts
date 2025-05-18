export enum DescriptorStatus {
    ENABLED = 'ENABLED',
    DISABLED = 'DISABLED',
}

export type DescriptorState = {
    merchantId: string
    partnerDescriptorId: string
    name: string
    paymentDescriptor: string
    paymentDescriptorContact: string
    status: string
    startDate: string
}

export type DescriptorPayload = {
    merchantId: string
    partnerDescriptorId?: string
    name?: string
    appliedBy?: string
    paymentDescriptor: string
    paymentDescriptorContact: string
    status?: string
    startDate?: string
}

export interface Descriptor {
    applied_by: string
    created_at: number
    id: string
    name: string
    partner_descriptor_id: string
    partner_merchant_id: string
    payment_descriptor: string
    payment_descriptor_contact: string
    start_date: string
    status: string
    updated_at: number
    verifi_id: string
    verifi_location: string
}

export enum DescriptorValidationMessages {
    MerchantIdRequired = 'Merchant ID is required',
    PaymentDescriptorLength = '3 < Payment Descriptor < 22 (characters)',
    PaymentDescriptorContactLength = '7 < Payment Descriptor Contact < 15 (characters)',
    PaymentDescriptorContactFormat = 'Payment Descriptor Contact must include only: numbers + ( - )',
    ConflictError = 'This descriptor is already in use.',
    ApiError = 'An error occurred while processing your request.',
}

export type DescriptorValidationErrors = {
    merchantId: DescriptorValidationMessages[]
    paymentDescriptor: DescriptorValidationMessages[]
    paymentDescriptorContact: DescriptorValidationMessages[]
    global: DescriptorValidationMessages[]  // For API-level errors that don't belong to a specific field
    count: number
}

export function createDescriptorValidationErrors(): DescriptorValidationErrors {
    return {
        merchantId: [],
        paymentDescriptor: [],
        paymentDescriptorContact: [],
        global: [],
        count: 0,
    }
}
