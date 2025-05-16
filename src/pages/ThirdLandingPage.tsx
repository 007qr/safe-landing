import { Component } from 'solid-js'
import DescriptorWidget from '~/components/descriptor/Descriptor'
import { DescriptorFlowProvider } from '~/components/descriptor/DescriptorFlowProvider'

interface Props {}

const ThirdLandingPage: Component<Props> = () => {
    return (
        <>
            <div class="flex items-center justify-center h-screen w-full">
                    <DescriptorFlowProvider>
                        <DescriptorWidget />
                    </DescriptorFlowProvider>
            </div>
        </>
    )
}

export default ThirdLandingPage
