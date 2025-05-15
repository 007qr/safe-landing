import { createSignal, onMount, ParentComponent, Show } from 'solid-js'
import { AuthProvider, provideAuth } from '~/components/auth/AuthProvider'
import LoadingIcon from '~/ui/icons/Loading'

const AppLayout: ParentComponent = (props) => {
    return (
            <AuthProvider>
                    <AppCheck>{props.children}</AppCheck>
            </AuthProvider>
    )
}

const AppCheck: ParentComponent = (props) => {
    const authStore = provideAuth()
    const [underMaintenance, setUnderMaintenance] = createSignal(false)
    const [ready, setReady] = createSignal(true)

    onMount(() => {
        const tokens = authStore.getAuthTokens()
        if (tokens) {
            const fetchUser = async () => {
                try {
                    const user = await authStore.fetchUserInfo()

                    authStore.saveUserToLocalStorage(user)
                    authStore.login(user)
                } catch (error) {
                    console.error('Fetch error:', error)
                } finally {
                    setReady(true)
                }
            }
            Promise.race([fetchUser(), new Promise((resolve) => setTimeout(resolve, 10000))]).then(() => {
                setReady(true)
            })
        } else {
            setReady(true)
        }
    })

    return (
        // Temporarily remove outer Transition to isolate the issue
        <Show
            when={ready()}
            fallback={
                <div class="h-screen w-screen flex flex-col absolute inset-0 z-50">
                    <LoadingIcon
                        width={45}
                        height={45}
                        isLoading={true}
                        class="border-none bg-transparent left-1/2 top-1/2"
                        style={{ transform: 'translate(-50%, -70%)' }}
                    />
                </div>
            }
        >
            <main class="bg-transparent">
                {/* Temporarily remove inner Transition */}
                {props.children}
                <AppLayoutAuthedOnly />
            </main>
        </Show>
    )
}

const AppLayoutAuthedOnly = () => {
    const authStore = provideAuth()

    return (
        <Show when={authStore.isAuthenticated() }>
            asd
        </Show>
    )
}

export default AppLayout
