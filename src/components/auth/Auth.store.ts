import { Base85Crypt } from '~/lib/crypt'
import {
    AuthErrors,
    AuthState,
    AuthTokens,
    createLoginValidationErrors,
    createRegisterValidationErrors,
    EmailOTPResponse,
    EmailOTPVerify,
    LoginValidationMessages,
    PendingRequest,
    RegisterValidationMessages,
    TempLoginState,
    TempUserInfo,
} from './Auth.types'
import { User } from '../user/User.types'
import { createStore } from 'solid-js/store'
import { ValidRegex } from '~/lib/regex'
import { createSignal } from 'solid-js'
// import blocklistText from '~/assets/conf/disposable_email_blocklist.conf?raw'

const API = import.meta.env.VITE_USER_SERVICE_ENDPOINT

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    authTokens: null,
    roles: [],
}

const initialTempLoginState: TempLoginState = {
    lastEmailOTPResponse: null,
    tempUser: {
        email: null,
        phone: null,
        full_name: null,
        merchant_accs: 0,
        user_id: null,
    },
}

let authStateStore: ReturnType<typeof createStore<AuthState>> | null = null
let tempLoginStore: ReturnType<typeof createStore<TempLoginState>> | null = null
let isRequestPendingSignal: ReturnType<typeof createSignal<boolean>> | null = null
let pendingRequestsStore: ReturnType<typeof createStore<PendingRequest[]>> | null = null
/**
 * Singleton Auth store, created in AuthProvider and accessed by any component
 */
export const useAuthStore = () => {
    if (!authStateStore || !tempLoginStore || !isRequestPendingSignal || !pendingRequestsStore) {
        throw new Error('AuthStore has not been initialized. Call createAuthStore() first.')
    }
    return createAuthStore()
}

export const createAuthStore = () => {
    if (!authStateStore) {
        authStateStore = createStore(initialState)
    }
    if (!tempLoginStore) {
        tempLoginStore = createStore(initialTempLoginState)
    }
    if (!isRequestPendingSignal) {
        isRequestPendingSignal = createSignal(false)
    }
    if (!pendingRequestsStore) {
        pendingRequestsStore = createStore<PendingRequest[]>([])
    }

    const [authState, setAuthState] = authStateStore
    const [tempLogin, setTempLogin] = tempLoginStore
    const [isRequestPending, setRequestPending] = isRequestPendingSignal
    const [pendingRequests, setPendingRequests] = pendingRequestsStore

    // const [blocklist] = createSignal(
    //     blocklistText
    //         .split('\n')
    //         .map((line) => line.trim())
    //         .filter((line) => line && !line.startsWith('#')) // Remove empty lines and comments
    // )

    const isAuthenticated = () => authState.isAuthenticated
    const getCurrentUser = () => authState.user
    const getAuthTokens = () => {
        if (!authState.authTokens) {
            const savedAuthTokens = getAuthTokensFromLocalStorage()
            setAuthState((prev) => ({
                ...prev,
                authTokens: savedAuthTokens,
            }))
            return savedAuthTokens
        }
        return authState.authTokens
    }

    function isDisposable(email: string) {
        if (import.meta.env.BUILD_ENV !== 'production') {
            return false
        }
        const emailDomain = email.split('@')[1]?.toLowerCase() // Extract domain
        // const isBlocked = emailDomain && blocklist().includes(emailDomain)

        return emailDomain
    }

    function login(user: User): void {
        setAuthState({ user, isAuthenticated: true })
    }

    function logout(): void {
        localStorage.removeItem('auth_tokens')
        localStorage.removeItem('user')
        // localStorage.removeItem('workspace')
        // localStorage.clear()
        localStorage.setItem('onboarded', 'true')

        setAuthState({ user: null, isAuthenticated: false, authTokens: null, roles: [] })
        setTempLogin({
            lastEmailOTPResponse: null,
            tempUser: {
                email: null,
                phone: null,
                full_name: null,
                merchant_accs: 0,
                user_id: null,
            },
        })
    }

    function setAuthTokens(authTokens: AuthTokens) {
        setAuthState((prev) => ({
            ...prev,
            authTokens,
        }))
    }

    async function fetchOTPEmail(
        formEmail: string,
        abort: AbortSignal = new AbortController().signal
    ): Promise<EmailOTPResponse> {
        // ! toLowerCase() could be a source of bug for non-ascii characters
        // TODO: Find a solution
        try {
            const email = formEmail.trim().toLowerCase()
            const response = await fetch(`${API}/signup/get-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
                signal: abort,
            })
            // Allow too many requests response from CloudFlare
            if (!response.ok && response.status !== 429) {
                throw response
            }

            const lastEmailOTPResponse: EmailOTPResponse = await response.json()
            if (!lastEmailOTPResponse) {
                throw AuthErrors.JsonParseFailed('Failed to parse email otp response')
            }

            setTempLogin((prev) => ({
                ...prev,
                lastEmailOTPResponse,
            }))
            return tempLogin.lastEmailOTPResponse
        } catch (err) {
            console.error(err)
        }
    }

    async function verifyOTPEmail(
        formOTP: string,
        email: string,
        abort: AbortSignal = new AbortController().signal
    ): Promise<boolean> {
        const code = formOTP.trim().toLowerCase()
        const body = JSON.stringify({
            method_id: tempLogin.lastEmailOTPResponse.email_id,
            code,
            email: email,
        } as EmailOTPVerify)
        const response = await fetch(`${API}/authenticate/jwt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Email': tempLogin.tempUser.email,
            },
            body,
            signal: abort,
        })

        if (!response.ok) {
            if (response.status === 404 || response.status === 400) {
                throw AuthErrors.TokenInvalid()
            } else if (response.status === 401) {
                throw AuthErrors.TokenExpired()
            } else {
                throw AuthErrors.UnknownError()
            }
        }

        const authTokens: AuthTokens = await response.json()
        if (!authTokens) {
            throw AuthErrors.JsonParseFailed()
        }

        setAuthState((prev) => ({
            ...prev,
            authTokens,
            isAuthenticated: true,
        }))
        saveAuthTokensToLocalStorage(authTokens)
        return true
    }

    async function refreshAuthTokens(): Promise<AuthTokens> {
        const response = await fetch(`${API}/token/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authState.authTokens.refresh_token}`,
            },
        })
        if (!response.ok) {
            throw new Error('Failed to refresh auth tokens')
        }

        const authTokens = (await response.json()) as AuthTokens
        if (!authTokens) {
            throw AuthErrors.JsonParseFailed()
        }

        setAuthTokens(authTokens)
        saveAuthTokensToLocalStorage(authTokens)
        return authTokens
    }

    async function registerTempUser(abort: AbortSignal = new AbortController().signal): Promise<string> {
        try {
            const response = await fetch(`${API}/api/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Provider': tempLogin.tempUser.user_id,
                    Authorization: `Bearer ${authState.authTokens.token}`,
                },
                body: JSON.stringify(tempLogin.tempUser),
                signal: abort,
            })
            if (!response.ok) {
                const error = await response.text()
                throw AuthErrors.UserCreationFailed(JSON.stringify(error))
            }

            const data = await response.json()
            return data.data.user_id
        } catch (err) {
            console.error(err)
        }
    }

    function fillTempUser(info: TempUserInfo): void {
        const email = info.email && info.email.trim().length > 0 ? info.email.trim().toLowerCase() : null
        const phone = info.phone && info.phone.trim().length > 0 ? info.phone.trim().toLowerCase() : null
        const full_name = info.full_name && info.full_name.trim().length > 0 ? info.full_name.trim() : null
        const merchant_accs = info.merchant_accs && info.merchant_accs >= 0 ? info.merchant_accs : 0
        const user_id = info.user_id && info.user_id.trim().length > 0 ? info.user_id.trim().toLowerCase() : null
        setTempLogin((prev) => ({
            ...prev,
            tempUser: {
                email: email ?? prev.tempUser.email,
                phone: phone ?? prev.tempUser.phone,
                full_name: full_name ?? prev.tempUser.full_name,
                merchant_accs: merchant_accs,
                user_id: user_id ?? prev.tempUser.user_id,
            },
        }))
    }

    async function fetchUserInfo(abort: AbortSignal = new AbortController().signal): Promise<User> {
        const response = await fetch(`${API}/user/jwt`, {
            method: 'GET',
            signal: abort,
        })
        if (!response.ok) {
            throw await response.text()
        }

        const responseData = await response.json()
        if (!responseData) {
            throw AuthErrors.JsonParseFailed()
        }

        // Store roles in the auth state for later use
        setAuthState((prev) => ({
            ...prev,
            user: responseData.user,
            roles: responseData.roles || [],
        }))


        // Save to localStorage
        saveUserToLocalStorage(responseData.user)

        return responseData.user
    }

    function saveUserToLocalStorage(user: User): boolean {
        if (user) {
            const hashedUser = Base85Crypt().crypt(JSON.stringify(user))
            if (hashedUser && hashedUser.length > 0) {
                localStorage.setItem('user', hashedUser)
                return true
            }
        }
        return false
    }

    function saveAuthTokensToLocalStorage(tokens: AuthTokens): boolean {
        if (tokens) {
            const hashedAuthTokens = Base85Crypt().crypt(JSON.stringify(tokens))
            if (hashedAuthTokens && hashedAuthTokens.length > 0) {
                localStorage.setItem('auth_tokens', hashedAuthTokens)
                return true
            }
        }
        return false
    }

    function getUserFromLocalStorage(): User | null {
        const userStringEncrypted = localStorage.getItem('user')
        if (userStringEncrypted && userStringEncrypted.length > 0) {
            const userString = Base85Crypt().decrypt(userStringEncrypted)
            if (userString && userString.length > 0) {
                return JSON.parse(userString) as User
            }
        }
        return null
    }

    function getAuthTokensFromLocalStorage(): AuthTokens {
        const authTokensStringEncrypted = localStorage.getItem('auth_tokens')
        if (authTokensStringEncrypted && authTokensStringEncrypted.length > 0) {
            const authTokensString = Base85Crypt().decrypt(authTokensStringEncrypted)
            if (authTokensString && authTokensString.length > 0) {
                return JSON.parse(authTokensString) as AuthTokens
            }
        }
        return null
    }

    function getAlreadyRegistered() {
        return tempLogin.lastEmailOTPResponse.already_a_user
    }

    const validateLogin = (email: string) => {
        let errors = createLoginValidationErrors()
        const trimmedEmail = email.trim()
        if (trimmedEmail.length < 3 || trimmedEmail.length > 32) {
            errors.email.push(LoginValidationMessages.EmailLength)
            errors.count += 1
        }
        if (!trimmedEmail.match(ValidRegex.Email)) {
            errors.email.push(LoginValidationMessages.EmailFormat)
            errors.count += 1
        }
        if (isDisposable(trimmedEmail)) {
            errors.email.push(LoginValidationMessages.EmailDisposable)
            errors.count += 1
        }
        return errors
    }

    const validateRegister = (name: string, phone: string) => {
        let errors = createRegisterValidationErrors()

        if (name.length < 3 || name.length > 32) {
            errors.name.push(RegisterValidationMessages.NameLength)
            errors.count += 1
        }
        if (name.match(ValidRegex.InvalidName)) {
            errors.name.push(RegisterValidationMessages.NameFormat)
            errors.count += 1
        }
        if (phone.length < 3 || phone.length > 32) {
            errors.phone.push(RegisterValidationMessages.PhoneLength)
            errors.count += 1
        }
        if (!phone.match(ValidRegex.Phone)) {
            errors.phone.push(RegisterValidationMessages.PhoneFormat)
            errors.count += 1
        }

        return errors
    }

    function addToPendingRequests(req: PendingRequest) {
        setPendingRequests((prev) => [...prev, req])
    }

    return {
        login,
        logout,
        isAuthenticated,
        getCurrentUser,
        getAuthTokens,
        setAuthTokens,
        getAuthState: () => authState,
        fetchOTPEmail,
        verifyOTPEmail,
        refreshAuthTokens,
        registerTempUser,
        tempLogin,
        fillTempUser,
        fetchUserInfo,
        saveUserToLocalStorage,
        saveAuthTokensToLocalStorage,
        getUserFromLocalStorage,
        getAuthTokensFromLocalStorage,
        getAlreadyRegistered,
        validateRegister,
        validateLogin,
        request: {
            isRequestPending,
            setRequestPending,
            pendingRequests,
            setPendingRequests,
            addToPendingRequests,
        },
    }
}
