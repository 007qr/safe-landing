import { createSignal } from 'solid-js'
import { DescriptorFlow } from './Descriptor.types'

let descriptorStore: ReturnType<typeof createActualDescriptorStore> | null = null

export const useDescriptorStore = () => {
    if (!descriptorStore) {
        throw new Error('DescriptorStore has not been initialized. Call createDescriptorStore first.')
    }
    return descriptorStore
}

export const createDescriptorStore = () => {
    if (!descriptorStore) {
        descriptorStore = createActualDescriptorStore()
    }

    return descriptorStore
}

const createActualDescriptorStore = () => {
    const setupFlowPattern = ['first', 'second', 'third', 'fourth', 'default', 'add_bulk'] as DescriptorFlow[]
    const registeredFlowPattern = ['default', 'list_descriptors', 'add_bulk'] as DescriptorFlow[]

    // This state tracks which pattern we're using and our position within it
    const [isRegistered, setIsRegistered] = createSignal(false)
    const [currentIndex, setCurrentIndex] = createSignal<number>(0)

    // Get the currently active flow pattern based on registration status
    const getActivePattern = () => {
        return isRegistered() ? registeredFlowPattern : setupFlowPattern
    }

    // Get the current step in the flow
    function getFlow(): DescriptorFlow {
        return getActivePattern()[currentIndex()]
    }

    // Move backward in the flow while respecting the active pattern
    function goBack(): DescriptorFlow | undefined {
        if (currentIndex() - 1 < 0) return undefined
        setCurrentIndex((v) => v - 1)
        return getFlow()
    }

    // Move forward in the flow while respecting the active pattern
    function next(): DescriptorFlow | undefined {
        const pattern = getActivePattern()
        if (currentIndex() + 1 >= pattern.length) return undefined
        setCurrentIndex((v) => v + 1)

        // If we reach 'default' step and we're in setup flow, mark as registered
        if (getFlow() === 'default' && !isRegistered()) {
            setIsRegistered(true)
            setCurrentIndex(0)
        }

        return getFlow()
    }

    function navigateTo(targetFlow: DescriptorFlow): DescriptorFlow | undefined {
        const pattern = getActivePattern()
        const index = pattern.indexOf(targetFlow)

        // Special case for unregistered users trying to access add_bulk
        if (targetFlow === 'add_bulk' && !isRegistered()) {
            // Find add_bulk in the unregistered flow pattern
            const addBulkIndex = setupFlowPattern.indexOf('add_bulk')
            if (addBulkIndex !== -1) {
                setCurrentIndex(addBulkIndex)
                return getFlow()
            }
        }

        // Check if the requested flow exists in current pattern
        if (index === -1) {
            console.warn(`Flow "${targetFlow}" not available in current pattern`)
            return undefined
        }

        setCurrentIndex(index)
        return getFlow()
    }

    // For debugging
    function getAvailableFlows() {
        return getActivePattern()
    }

    return {
        getFlow,
        goBack,
        next,
        navigateTo,
        isRegistered,
        setIsRegistered,
        getAvailableFlows
    }
}
