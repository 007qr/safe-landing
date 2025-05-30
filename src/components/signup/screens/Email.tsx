import { Accessor, Component, createSignal, Show } from 'solid-js'
import { Setter } from 'solid-js'
import { SignUpModalFlow } from './Screens.types'
import { Loader } from '~/components/widgets/FirstLandingPage/BigCard'
import { cn } from '~/lib/utils'
import {requestOtp} from '~/lib/authApi';

interface Props {
    email: Accessor<string>
    setFlow: Setter<SignUpModalFlow>
    setEmail: Setter<string>
    setMethodId: Setter<string>
    setUserId: Setter<string>
    class?: string
}

const Email: Component<Props> = (props) => {
    const [isLoading, setIsLoading] = createSignal<boolean>(false)
    const [emailError, setEmailError] = createSignal<string>('')

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(props.email())) {
            setEmailError('Please enter a valid email address')
            return false
        }
        setEmailError('')
        return true
    }

    const handleClick = async () => {
        if (validateEmail()) {
            setIsLoading(true)
            try {
                const response = await requestOtp(props.email());
                props.setMethodId(response.email_id);
                props.setUserId(response.user_id);
                props.setFlow('otp');
            } catch (err) {
                setEmailError('Failed to send OTP. Please try again.')
                console.error(err);
            } finally {
                setIsLoading(false)
            }
        }
    }
    return (
        <Show when={!isLoading()} fallback={<Loader />}>
            <div class={cn("flex flex-col h-full w-full mt-[16px] bg-white p-[70px] max-md:p-[20px]", props.class)}>
                <div class="">
                    <h3 class="text-[31px] font-semibold tracking-tighter leading-[150%]">Enter your email</h3>
                    <p class="text-black/60 text-sm leading-[150%]">We will send you a 6 digit code</p>
                </div>
                <div
                    class={`bg-[#EBEBEB] text-black/90 p-[12px] rounded-[12px] mt-[12px] ${
                        emailError() ? 'border border-red-500' : ''
                    }`}
                >
                    <input
                        type="text"
                        value={props.email()}
                        onInput={(e) => props.setEmail(e.target.value)}
                        class="w-full bg-transparent outline-none border-none"
                        placeholder="Email"
                    />
                </div>
                <p class="text-[13px] text-red-500 ml-2">{emailError()}</p>
                <button
                    onClick={handleClick}
                    class="bg-black text-white leading-[20px] rounded-[16px] py-[16px] mt-[16px] disabled:opacity-80"
                >
                    Continue
                </button>
            </div>
        </Show>
    )
}

export default Email;
