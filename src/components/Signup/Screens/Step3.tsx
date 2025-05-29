import { Accessor, Component, createSignal, Setter, Show } from 'solid-js'
import { SignUpModalFlow } from './Screens.types'
import PhoneField from '~/ui/base/PhoneField'
import { Loader } from '../../widgets/FirstLandingPage/BigCard'
import { getAccessToken } from '~/lib/auth'
import { createUser } from '~/lib/authApi'
import Tracker from '~/lib/tracker'
import { cn } from '~/lib/utils'

interface Props {
    email: Accessor<string>
    userId: Accessor<string>
    setFlow: Setter<SignUpModalFlow>
    tracker: Tracker
    class?: string
}

const Step3: Component<Props> = (props) => {
    const [isLoading, setIsLoading] = createSignal<boolean>(false)
    const [name, setName] = createSignal<string>('')
    const [phoneError, setPhoneError] = createSignal<string>('')
    const [nameError, setNameError] = createSignal<string>('')
    const [phone, setPhone] = createSignal('')

    const validateName = () => {
        if (!name().trim()) {
            setNameError('Name is required')
            return false
        }
        setNameError('')
        return true
    }

    const validatePhone = () => {
        if (!phone()) {
            setPhoneError('Phone number is required')
            return false
        }
        setPhoneError('')
        return true
    }

    const handleClick = async () => {
        if (validateName() && validatePhone()) {
            // create user
            setIsLoading(true)
            try {
                const token = getAccessToken()
                if (!token) {
                    throw new Error('No access token found')
                }

                const res = await createUser(props.email(), phone(), name(), props.userId(), token)
                console.log(res)
                props.setFlow('joined')
                props.tracker.trackEvent('phone-entered', ['phone'], [phone()])
            } catch (err) {
                setPhoneError('Failed to register phone. Please try again.')
                console.log(err)
            } finally {
                setIsLoading(false)
            }
        }
    }
    return (
        <>
            <Show when={!isLoading()} fallback={<Loader />}>
                <div class={cn('flex flex-col h-full w-full mt-[16px] bg-white p-[70px] max-md:p-[20px]', props.class)}>
                    <div class="">
                        <h3 class="text-[31px] font-semibold tracking-tighter leading-[150%]">Get some more details</h3>
                        <p class="text-black/60 text-sm leading-[150%]">Here goes subtitle</p>
                    </div>
                    <div class="space-y-[12px]">
                        <div>
                            <div
                                class={`bg-[#EBEBEB] text-black/90 p-[12px] rounded-[12px] mt-[12px] ${
                                    nameError() ? 'border border-red-500' : ''
                                }`}
                            >
                                <input
                                    type="text"
                                    value={name()}
                                    onInput={(e) => {
                                        setName(e.target.value)
                                    }}
                                    class="w-full bg-transparent outline-none border-none"
                                    placeholder="Full name"
                                />
                            </div>
                            <p class="text-[13px] text-red-500 ml-2">{nameError()}</p>
                        </div>
                        <div>
                            <div
                                class={`bg-[#EBEBEB] text-black/90 p-[5px] rounded-[12px] mt-[12px] ${
                                    phoneError() ? 'border-red-500 border' : ''
                                }`}
                            >
                                <PhoneField
                                    value={phone()}
                                    onChange={(fullNumber, isValid) => {
                                        setPhone(fullNumber)
                                        if (!isValid && fullNumber) {
                                            setPhoneError('Please enter a valid phone number')
                                        } else {
                                            setPhoneError('')
                                        }
                                    }}
                                />
                            </div>
                            <p class="text-[13px] text-red-500 ml-2">{phoneError()}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClick}
                        class="bg-black text-white leading-[20px] rounded-[16px] py-[16px] mt-[12px] disabled:opacity-80"
                    >
                        Continue
                    </button>
                </div>
            </Show>
        </>
    )
}

export default Step3;
