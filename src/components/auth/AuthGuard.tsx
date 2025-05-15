import { Navigate } from '@solidjs/router'
import { createMemo, createSignal, ParentComponent, Show } from 'solid-js'
import { provideAuth } from './AuthProvider'
import { useAuthStore } from './Auth.store'
import { navigateUtil } from '~/lib/navigate'
// import ScreenOnBoarding from '~/pages/dashboard/ScreenOnBoarding'

const AuthGuard: ParentComponent<{ navigatePathIfFailed?: string }> = (props) => {
    const authStore = provideAuth()
    const [ready, setReady] = createSignal(true)
    const shouldShow = createMemo(() => authStore.isAuthenticated())
    const onBoarded = createMemo(() => {
        if (ready()) {
            return true
        }
        return isOnboarded()
    })

    function isOnboarded() {
        const onboardedStr = localStorage.getItem('onboarded')
        if (onboardedStr) {
            const onboarded = JSON.parse(onboardedStr) as boolean
            if (onboarded) {
                return true
            }
        }
        return false
    }

    return (
        <Show when={shouldShow()} fallback={<Navigate href={props.navigatePathIfFailed ?? '/lp3'} />}>
            <Show when={onBoarded()} fallback={<Navigate href={props.navigatePathIfFailed ?? '/lp3'}/>}>
                {props.children}
            </Show>
        </Show>
    )
}

export function withAuth<Fn extends (...args: any[]) => any>(fn: Fn) {
    return async (...args: Parameters<Fn>): Promise<Awaited<ReturnType<Fn>>> => {
        const authStore = useAuthStore()
        try {
            return await fn(...args)
        } catch (error) {
            if (error instanceof Response) {
                const status = error.status
                if (status === 401 || status === 403) {
                    try {
                        const authTokens = await authStore.refreshAuthTokens()
                        authStore.setAuthTokens(authTokens)
                        authStore.saveAuthTokensToLocalStorage(authTokens)
                        return await fn(...args)
                    } catch (refreshError) {
                        authStore.logout()
                        navigateUtil.reloadPage()
                        setTimeout(() => {
                            navigateUtil.navigateTo('/', { replace: true })
                        }, 50)
                        throw new Error('Unauthorized. Please login agian.')
                    }
                }
            }
            throw error
        }
    }
}

export default AuthGuard
