import { Component } from 'solid-js'
import AuthGuard from '~/components/auth/AuthGuard'
import DescriptorWidget from '~/components/descriptor/Descriptor'
import { DescriptorProvider } from '~/components/descriptor/DescriptorProvider'

interface Props {}

const ThirdLandingPage: Component<Props> = () => {
    return (
        <>
            <div class="flex items-center justify-center h-screen w-full">
                <AuthGuard>
                    <DescriptorProvider>
                        <DescriptorWidget />
                    </DescriptorProvider>
                </AuthGuard>
            </div>
        </>
    )
}

export default ThirdLandingPage
