import { createSignal } from 'solid-js'
import { ApolloClient, InMemoryCache, createHttpLink, gql } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { DisputeEvidenceInfoInput, GetDisputeEvidenceInfoResponse } from './AIResponse.types'


// GraphQL queries
const GET_DISPUTE_EVIDENCE_INFO = gql`
    query GetDisputeEvidenceInfo($input: GetDisputeEvidenceInput!) {
        getDisputeEvidenceInfo(input: $input) {
            disputeId
            connectionId
            disputeEvidenceId
        }
    }
`

export function createAIWidgetStore(authToken: string) {
    // State signals
    const [aiThinking, setAIThinking] = createSignal(false)
    const [availableSteps, setAvailableSteps] = createSignal<string[]>([
        'Terms',
        'Privacy policy',
        'Refund policy',
        'Customer details',
        'Transaction history',
    ])
    const [visibleSteps, setVisibleSteps] = createSignal<string[]>(['Terms', 'Privacy policy', 'Refund policy'])
    const [isLoading, setIsLoading] = createSignal(false)
    const [error, setError] = createSignal<Error | null>(null)

    // Default dispute input
    const defaultDisputeInput: DisputeEvidenceInfoInput = {
        disputeId: 'dp_1Qf4Z3SETqISJyPbZKOzZuBo',
        connectionId: 'b4657254-1a14-48d1-8a59-578e5893c406',
        provider: 'stripe',
    }

    const httpLink = createHttpLink({
        uri: 'https://dispute-response-service.safeapp.workers.dev/graphql',
    })

    const authLink = setContext((_, { headers }) => {
        return {
            headers: {
                ...headers,
                authorization: `Bearer ${authToken}`,
            },
        }
    })

    const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
    })

    // Fetch dispute evidence info
    async function fetchDisputeInfo(input: DisputeEvidenceInfoInput = defaultDisputeInput) {
        setIsLoading(true)
        setError(null)

        try {
            const { data } = await client.query({
                query: GET_DISPUTE_EVIDENCE_INFO,
                variables: { input },
                fetchPolicy: 'network-only', // Bypass cache for fresh data
            })

            setIsLoading(false)
            return data as GetDisputeEvidenceInfoResponse
        } catch (err) {
            const error = err instanceof Error ? err : new Error('An unknown error occurred')
            setError(error)
            setIsLoading(false)
            throw error
        }
    }

    // Toggle AI thinking state
    function toggleAIThinking() {
        setAIThinking((prev) => !prev)
    }

    // Add a step to visible steps
    function addVisibleStep(step: string) {
        setVisibleSteps((prev) => [...prev, step])
    }

    // Remove a step from visible steps
    function removeVisibleStep(step: string) {
        setVisibleSteps((prev) => prev.filter((s) => s !== step))
    }

    // Reset visible steps to initial state
    function resetVisibleSteps() {
        setVisibleSteps(['Terms', 'Privacy policy', 'Refund policy'])
    }

    // Fetch dispute with custom input
    function fetchDispute(input: DisputeEvidenceInfoInput) {
        return fetchDisputeInfo(input)
    }

    return {
        // State
        aiThinking,
        visibleSteps,
        availableSteps,

        isLoading,
        error,

        // Actions
        toggleAIThinking,
        addVisibleStep,
        removeVisibleStep,
        resetVisibleSteps,
        fetchDispute,
    }
}

// Create a singleton store instance
export const aiWidgetStore = (authToken: string) => createAIWidgetStore(authToken);
