import { createContext, ParentComponent, useContext } from 'solid-js'
import { createDescriptorFlowStore } from './DescriptorFlow.store'
import { createAddDescriptorStore } from './AddDescriptor.store'

const DescriptorFlowContext = createContext<ReturnType<typeof createDescriptorFlowStore>>()
const AddDescriptorContext = createContext<ReturnType<typeof createAddDescriptorStore>>()

export const DescriptorProvider: ParentComponent = (props) => {
  const addDescriptorStore = createAddDescriptorStore()
  const descriptorFlow = createDescriptorFlowStore()

  return (
    <DescriptorFlowContext.Provider value={descriptorFlow}>
      <AddDescriptorContext.Provider value={addDescriptorStore}>
        {props.children}
      </AddDescriptorContext.Provider>
    </DescriptorFlowContext.Provider>
  )
}

export const provideAddDescriptor = () => {
  const context = useContext(AddDescriptorContext)
  if (!context) {
    throw new Error('provideAddDescriptor must be used within a <DescriptorProvider>')
  }
  return context
}

export const provideDescriptorFlow = () => {
  const context = useContext(DescriptorFlowContext)
  if (!context) {
    throw new Error('provideDescriptorFlow must be used within a <DescriptorProvider>')
  }
  return context
}

// export const provideDescriptorList = () => {
//   const context = useContext(DescriptorListContext)
//   if (!context) {
//     throw new Error('provideDescriptorList must be used within a <DescriptorProvider>')
//   }
//   return context
// }
