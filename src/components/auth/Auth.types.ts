import { type User } from '~/components/user/User.types'
import { ErrorBase } from '~/lib/error'

export enum AuthSteps {
    Login,
    Register,
    OTPEmail,
    OTPPhone,
}

export enum AuthOTPKind {
    Email,
    Phone,
}

export type AuthTokens = {
    token: string
    refresh_token: string
    exp: Date | string
}

export type AuthState = {
    isAuthenticated: boolean
    user: User | null
    authTokens: AuthTokens | null
    roles?: { role: string; tenant: string }[]
}

export type PendingRequest = (newTokens: AuthTokens | null) => void

export type EmailOTPResponse = {
    already_a_user: boolean
    /**
     * Later to be used as {@link EmailOTPResponse.email_id}
     */
    email_id: string
    request_id: string
    status_code: number
    user_created: boolean
    user_id: string
}

export type EmailOTPVerify = {
    /**
     * Basically the same as {@link EmailOTPResponse.email_id}
     */
    method_id: string
    /**
     * OTP verification code from user's email inbox
     */
    code: string
}

export type TempLoginState = {
    lastEmailOTPResponse: EmailOTPResponse | null
    tempUser: TempUserInfo | null
}

export type TempUserInfo = {
    email?: string
    phone?: string
    merchant_accs?: number
    full_name?: string
    /**
     * The same as {@link EmailOTPResponse.user_id}
     */
    user_id?: string
}

export enum RegisterValidationMessages {
    NameLength = '3 < Name < 32 (characters)',
    NameFormat = 'No special characters allowed',
    PhoneLength = '3 < Phone < 32 (characters)',
    PhoneFormat = 'Only numbers are allowed',
}

export type RegisterValidationErrors = {
    name: RegisterValidationMessages[]
    phone: RegisterValidationMessages[]
    count: number
}

export function createRegisterValidationErrors(): RegisterValidationErrors {
    return {
        name: [],
        phone: [],
        count: 0,
    }
}

export enum LoginValidationMessages {
    EmailLength = '3 < Email < 32 (characters)',
    EmailFormat = 'Invalid email format',
    EmailDisposable = 'Disposable emails not allowed'
}

export type LoginValidationErrors = {
    email: LoginValidationMessages[]
    count: number
}

export function createLoginValidationErrors(): LoginValidationErrors {
    return {
        email: [],
        count: 0,
    }
}

// Errors
type AuthErrorName =
    | 'USER_NOT_FOUND'
    | 'USER_CREATION_FAILED'
    | 'JSON_PARSE_FAILED'
    | 'TOKEN_INVALID'
    | 'TOKEN_EXPIRED'
    | 'INTERNAL_SERVER_ERROR'

export class AuthErrorBase extends ErrorBase<AuthErrorName> {}

export const AuthErrors = {
    UserNotFound: (message?: string) => new AuthErrorBase({ name: 'USER_NOT_FOUND', message, status: 404 }),
    UserCreationFailed: (message?: string) => new AuthErrorBase({ name: 'USER_CREATION_FAILED', message, status: 400 }),
    JsonParseFailed: (message?: string) => new AuthErrorBase({ name: 'JSON_PARSE_FAILED', message, status: 422 }),
    TokenInvalid: (message?: string) => new AuthErrorBase({ name: 'TOKEN_INVALID', message, status: 404 }),
    TokenExpired: (message?: string) => new AuthErrorBase({ name: 'TOKEN_EXPIRED', message, status: 401 }),
    UnknownError: (message?: string) => new AuthErrorBase({ name: 'INTERNAL_SERVER_ERROR', message, status: 500 }),
}
