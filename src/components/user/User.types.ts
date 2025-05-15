import { Tier } from '~/components/billing/Billing.types'
import { Workspace } from '~/components/workspace/Workspace.types'

export type User = {
    id: string
    username: string
    full_name: string
    email: string
    last_login: Date | string
    merchant_accs: number
    phone: string
    created_at: Date | string
    updated_at: Date | string
}

export type UserMeta = {
    billing: Tier
    user: User
    workspace: Workspace
    /**only when any error happens while fetching @getCurrentuser */
    error?: string
}
