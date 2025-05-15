export type Tier = {
    created_at: string
    flat_rate: number
    id: string
    max_disputes: number
    name: string
    overflow_rate: number
    stripe_price_id: any
    supports_overflow: boolean
    discounted_price?: number
}

export enum TierEnum {
    Free = 'Free',
    Eco = 'Eco',
    Growth = 'Growth'
}
