import { Component } from 'solid-js'
import DescriptorWidget from '~/components/descriptor/Descriptor'
import { DescriptorProvider } from '~/components/descriptor/DescriptorProvider'

interface Props {}

const ThirdLandingPage: Component<Props> = () => {
    return (
        <>
            <div class="flex items-center justify-center h-screen w-full">
                <DescriptorProvider>
                    <DescriptorWidget />
                </DescriptorProvider>
            </div>
        </>
    )
}

export default ThirdLandingPage
