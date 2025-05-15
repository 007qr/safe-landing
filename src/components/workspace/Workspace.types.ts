export type Workspace = {
    created_at: string
    id: string
    name: string
    updated_at: string
    user_id: string
    quota_data: string
}

export type WorkspaceTier = {
    usage_quota: {
        dispute_responses_sent: number
        disputes_responses_sent_last_reset_date: string
        pending_charges: number
    }
    disputer_plan: {
        name: string
        dispute_responses_limit: number
    }
}
