import { createContext, ParentComponent, useContext } from 'solid-js'
import { createDescriptorFlowStore } from './DescriptorFlow.store'

const DescriptorFlowContext = createContext<ReturnType<typeof createDescriptorFlowStore>>()

export const DescriptorProvider: ParentComponent = (props) => {
    const descriptorFlowStore = createDescriptorFlowStore()

    return (
        <>
            <DescriptorFlowContext.Provider value={descriptorFlowStore}>
                {props.children}
            </DescriptorFlowContext.Provider>
        </>
    )
}

export const provideDescriptorFlow = () => {
    const context = useContext(DescriptorFlowContext)
    if (!context) {
        throw new Error('provideDescriptorFlow must be used within an <DescriptorProvider>')
    }
    return context
}
