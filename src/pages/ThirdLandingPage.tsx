// import { Component, createSignal, Show } from 'solid-js'
// import { Presence } from 'solid-motionone'

// import GPTAnimationWithBlur from '~/components/widgets/GPTAnimationWithBlur';
// import ArrowRight from '~/ui/icons/ArrowRight'
// import Name from '~/components/onboarding/screens/Name'
// import Email from '~/components/onboarding/screens/Email'
// import EmailOTP from '~/components/onboarding/screens/EmailOTP'
// import Phone from '~/components/onboarding/screens/Phone'
// import Registered from '~/components/onboarding/screens/Registered'
// import { OnBoardingFlow } from '~/components/onboarding/screens/OnBoarding.types'

// interface Props {}

// const ThirdLandingPage: Component<Props> = () => {
//     const FLOW_PATTERN: OnBoardingFlow[] = ['name', 'email', 'email-otp', 'phone', 'otp', 'done']

//     const [email, setEmail] = createSignal<string>('')
//     const [otp, setOtp] = createSignal<string>('')
//     const [name, setName] = createSignal<string>('Vish Vadlamani')
//     const [phone, setPhone] = createSignal<string>('')
//     // const [phoneOtp, setPhoneOtp] = createSignal<string>('')

//     const [flow, setFlow] = createSignal<number>(0)
//     const [isLoading, setIsLoading] = createSignal<boolean>(false)
//     const [error, setError] = createSignal<string>('')

//     const validateCurrentStep = () => {
//         // switch (FLOW_PATTERN[flow()]) {
//         //     case 'name':
//         //         return name().trim().length >= 3
//         //     case 'email':
//         //         const errors = auth.validateLogin(email())
//         //         if (errors.count > 0) {
//         //             setError(errors.email.join(', '))
//         //             return false
//         //         }
//         //         return true
//         //     case 'email-otp':
//         //         return otp().trim().length === 6
//         //     case 'phone':
//         //         const phoneErrors = auth.validateRegister(name(), phone())
//         //         if (phoneErrors.count > 0) {
//         //             setError(phoneErrors.phone.join(', '))
//         //             return false
//         //         }
//         //         return true
//         //     default:
//         //         return true
//         // }
//     }

//     const handleClick = async () => {
//         // if (!validateCurrentStep()) {
//         //     return
//         // }

//         setIsLoading(true)
//         setError('')

//         try {
//             // switch (FLOW_PATTERN[flow()]) {
//             //     case 'name':
//             //         // Just store the name for now
//             //         auth.fillTempUser({ full_name: name() })
//             //         break

//             //     case 'email':
//             //         // Request OTP for email
//             //         const emailResponse = await auth.fetchOTPEmail(email())
//             //         if (!emailResponse) {
//             //             throw new Error('Failed to send OTP to email')
//             //         }

//             //         // Store email in temp user state
//             //         auth.fillTempUser({ email: email() })
//             //         break

//             //     case 'email-otp':
//             //         // Verify the email OTP
//             //         const verifyResult = await auth.verifyOTPEmail(otp(), email())
//             //         if (!verifyResult) {
//             //             throw new Error('Failed to verify OTP')
//             //         }

//             //         // Check if user already exists
//             //         const alreadyRegistered = auth.getAlreadyRegistered?.()
//             //         if (alreadyRegistered) {
//             //             // If user already exists, fetch user info and skip to done
//             //             await auth.fetchUserInfo()
//             //             setFlow(FLOW_PATTERN.length - 1)
//             //             setIsLoading(false)
//             //             return
//             //         }
//             //         break

//             //     case 'phone':
//             //         // Store phone in temp user state
//             //         auth.fillTempUser({ phone: phone() })

//             //         // Register the user
//             //         const userId = await auth.registerTempUser()
//             //         if (!userId) {
//             //             throw new Error('Failed to register user')
//             //         }

//             //         // Fetch user info to complete registration
//             //         await auth.fetchUserInfo()
//             //         break
//             // }

//             // Move to the next step
//             setFlow((v) => (v + 1) % FLOW_PATTERN.length)
//         } catch (err) {
//             console.error('Error in onboarding flow:', err)
//             setError(err.message || 'An error occurred. Please try again.')
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     return (
//         <>
//             <nav class="p-[10px]">
//                 <div class="w-[48px] h-[48px] bg-white items-center flex justify-center rounded-full">
//                     <img src="/safeapp.svg" alt="" class="w-[32px] h-[32px]" />
//                 </div>
//             </nav>

//             <div class="max-w-[1150px] mx-auto rounded-[32px]">
//                 <h2 class="gap-2 mt-[30px] font-instrument-sans font-medium text-[48px] max-md:text-[38px] leading-[120%] tracking-[-2%] text-black/80">
//                     <GPTAnimationWithBlur />
//                 </h2>
//                 <div class="bg-white mt-[152px] w-full gap-[20px] rounded-[32px] p-[32px] flex justify-between max-md:flex-wrap max-md:items-center">
//                     <div class="w-full flex flex-col gap-[16px]">
//                         {error() && (
//                             <div class="bg-red-100 text-red-800 p-3 rounded-lg mb-4">
//                                 {error()}
//                             </div>
//                         )}

//                         <Presence exitBeforeEnter>
//                             <Show when={FLOW_PATTERN[flow()] === 'name'}>
//                                 <Name name={name} setName={setName} />
//                             </Show>

//                             <Show when={FLOW_PATTERN[flow()] === 'email'}>
//                                 <Email email={email} setEmail={setEmail} />
//                             </Show>

//                             <Show when={FLOW_PATTERN[flow()] === 'email-otp'}>
//                                 <EmailOTP otp={otp} setOtp={setOtp} />
//                             </Show>

//                             <Show when={FLOW_PATTERN[flow()] === 'phone'}>
//                                 <Phone phone={phone} setPhone={setPhone} />
//                             </Show>

//                             <Show when={FLOW_PATTERN[flow()] === 'done'}>
//                                 <Registered  />
//                             </Show>
//                         </Presence>

//                         <div class="flex justify-end max-w-[374px] w-full mt-auto">
//                             <button
//                                 onClick={handleClick}
//                                 disabled={isLoading()}
//                                 class={`w-[56px] h-[56px] flex items-center justify-center rounded-full mt-auto self-end ${
//                                     isLoading() ? 'bg-gray-400' : 'bg-black'
//                                 }`}
//                             >
//                                 {isLoading() ? (
//                                     <div class="w-[24px] h-[24px] border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                 ) : (
//                                     <ArrowRight class="w-[24px] h-[24px]" />
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                     <div class="bg-[#f5f5f5] w-full max-w-[500px] h-[276px] rounded-[24px]"></div>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default ThirdLandingPage
