import { createSignal, Show } from "solid-js";
import { Motion, Presence } from "solid-motionone";
import Logo from "./Logo";
import PhoneInput from "./phone-input/phone-input";
import GPTAnimationWithBlur from "./GPTAnimationWithBlur";
import {
    authenticate,
    createUser,
    refreshAccessToken,
    requestOtp,
} from "./lib/authApi";
import {
    clearAuth,
    getAccessToken,
    getRefreshToken,
    storeAccessToken,
    storeRefreshToken,
} from "./lib/auth";

// Define our flow stages with proper TypeScript
type FlowStage = "name" | "email" | "email-otp" | "phone" | "done";

// Create components for each step of the flow
const AuthForm = () => {
    // Form state
    const [name, setName] = createSignal("");
    const [email, setEmail] = createSignal("");
    const [otp, setOtp] = createSignal("");
    const [phone, setPhone] = createSignal("");

    // Auth state
    const [methodId, setMethodId] = createSignal("");
    const [userId, setUserId] = createSignal("");
    const [isLoading, setIsLoading] = createSignal(false);

    // Form errors
    const [nameError, setNameError] = createSignal("");
    const [emailError, setEmailError] = createSignal("");
    const [otpError, setOtpError] = createSignal("");
    const [phoneError, setPhoneError] = createSignal("");

    // Current step in the flow
    const [currentStage, setCurrentStage] = createSignal<FlowStage>("done");

    // Validation functions
    const validateName = () => {
        if (!name().trim()) {
            setNameError("Name is required");
            return false;
        }
        setNameError("");
        return true;
    };

    const validateEmail = () => {
        // More comprehensive email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email())) {
            setEmailError("Please enter a valid email address");
            return false;
        }
        setEmailError("");
        return true;
    };

    const validateOtp = () => {
        if (!otp().match(/^\d{6}$/)) {
            setOtpError("Enter a valid 6-digit OTP");
            return false;
        }
        setOtpError("");
        return true;
    };

    const validatePhone = () => {
        if (!phone()) {
            setPhoneError("Phone number is required");
            return false;
        }
        setPhoneError("");
        return true;
    };

    // Handle the next step in the flow
    const handleNextStep = async () => {
        if (isLoading()) return;

        // Determine what to do based on current stage
        switch (currentStage()) {
            case "name":
                if (validateName()) {
                    setCurrentStage("email");
                }
                break;

            case "email":
                if (validateEmail()) {
                    setIsLoading(true);
                    try {
                        const res = await requestOtp(email());
                        setMethodId(res.email_id);
                        setUserId(res.user_id);
                        setCurrentStage("email-otp");
                    } catch (err) {
                        setEmailError("Failed to send OTP. Please try again.");
                    } finally {
                        setIsLoading(false);
                    }
                }
                break;

            case "email-otp":
                if (validateOtp()) {
                    setIsLoading(true);
                    try {
                        const { accessToken, refreshToken } =
                            await authenticate(email(), otp(), methodId());

                        if (!accessToken || !refreshToken) {
                            throw new Error("Authentication failed");
                        }

                        storeAccessToken(accessToken);
                        storeRefreshToken(refreshToken);
                        setCurrentStage("phone");
                    } catch (err) {
                        setOtpError("Invalid OTP. Please try again.");
                    } finally {
                        setIsLoading(false);
                    }
                }
                break;

            case "phone":
                if (validatePhone()) {
                    setIsLoading(true);
                    try {
                        const token = getAccessToken();
                        if (!token) {
                            throw new Error("No access token found");
                        }

                        await createUser(
                            email(),
                            phone(),
                            name(),
                            userId(),
                            token
                        );
                        setCurrentStage("done");
                    } catch (err) {
                        setPhoneError(
                            "Failed to register phone. Please try again."
                        );
                    } finally {
                        setIsLoading(false);
                    }
                }
                break;

            default:
                // No action needed for "done" state
                break;
        }
    };

    // Initialize auth on component mount
    const initializeAuth = async () => {
        const refreshToken = getRefreshToken();
        if (!refreshToken) return;

        try {
            const newToken = await refreshAccessToken(refreshToken);
            if (newToken) {
                storeAccessToken(newToken);
            } else {
                clearAuth();
            }
        } catch {
            clearAuth();
        }
    };

    // Call initialize on mount
    initializeAuth();

    // Input field components
    const NameInput = () => (
        <Motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{
                opacity: 1,
                y: 0,
                transition: {
                    delay: 0.01,
                    easing: [0.19, 1, 0.22, 1],
                    duration: 1.2,
                },
            }}
            exit={{
                opacity: 0,
                scale: 1.01,
                y: -30,
                transition: {
                    duration: 0.7,
                    easing: [0.16, 1, 0.29, 0.99],
                },
            }}
            class={`bg-[#F5F5F5] flex flex-col gap-0.5 justify-center rounded-2xl w-full max-w-xs h-[70px`}
        >
            <div
                class={` ${
                    nameError() ? "border border-red-500" : ""
                } w-full p-3 rounded-2xl`}
            >
                <p class="text-[#6B6B6B] text-xs font-inter">Your name</p>
                <input
                    type="text"
                    value={name()}
                    onInput={(e) => setName(e.target.value)}
                    class="font-inter text-lg outline-none bg-transparent border-none text-[#1D1D1F]"
                    placeholder="Type here"
                />
            </div>
            {/* {nameError() && (
                <p class="text-red-500 text-xs mt-1">{nameError()}</p>
            )} */}
        </Motion.div>
    );

    const EmailInput = () => (
        <Motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{
                opacity: 1,
                y: 0,
                transition: { 
                    delay: 0.01,
                    easing: [0.19, 1, 0.22, 1],
                    duration: 1.2,
                },
            }}
            exit={{
                opacity: 0,
                scale: 1.01,
                y: -30,
                transition: {
                    duration: 0.7,
                    easing: [0.16, 1, 0.29, 0.99],
                },
            }}
            class={`bg-[#F5F5F5] flex flex-col gap-0.5 justify-center rounded-2xl w-full max-w-xs h-[70px] `}
        >
            <div class={`${emailError() ? "border border-red-500 " : ""} p-3 rounded-2xl w-full`}>
                <p class="text-[#6B6B6B] text-xs font-inter">Your email</p>
                <input
                    type="email"
                    value={email()}
                    onInput={(e) => setEmail(e.target.value)}
                    class="font-inter text-lg outline-none bg-transparent border-none text-[#1D1D1F]"
                    placeholder="Type here"
                />
            </div>
            {/* {emailError() && (
                <p class="text-red-500 text-xs mt-1">{emailError()}</p>
            )} */}
        </Motion.div>
    );

    const OtpInput = () => (
        <Motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{
                opacity: 1,
                y: 0,
                transition: {
                    delay: 0.01,
                    easing: [0.19, 1, 0.22, 1],
                    duration: 1.2,
                },
            }}
            exit={{
                opacity: 0,
                scale: 1.01,
                y: -30,
                transition: {
                    duration: 0.7,
                    easing: [0.16, 1, 0.29, 0.99],
                },
            }}
            class={`bg-[#F5F5F5] flex flex-col gap-0.5 justify-center  rounded-2xl w-full max-w-xs h-[70px]`}
        >
            <div class={`${otpError() ? "border border-red-500 " : ""} p-3 rounded-2xl w-full h-full flex justify-center items-center`}>
                <input
                    type="text"
                    value={otp()}
                    onInput={(e) => {
                        // Only allow digits
                        const sanitized = e.target.value.replace(/[^0-9]/g, "");
                        setOtp(sanitized);
                    }}
                    class="font-medium outline-none block p-[30px] rounded-md text-center w-full bg-transparent"
                    style="letter-spacing: 35px;"
                    placeholder="••••••"
                    maxlength="6"
                    onClick={(e) => e.currentTarget.select()}
                />
            </div>
            {/* {otpError() && (
                <p class="text-red-500 text-xs mt-1">{otpError()}</p>
            )} */}
        </Motion.div>
    );

    const PhoneNumberInput = () => (
        <Motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{
                opacity: 1,
                y: 0,
                transition: {
                    delay: 0.01,
                    easing: [0.19, 1, 0.22, 1],
                    duration: 1.2,
                },
            }}
            exit={{
                opacity: 0,
                scale: 1.01,
                y: -30,
                transition: {
                    duration: 0.7,
                    easing: [0.16, 1, 0.29, 0.99],
                },
            }}
            class={`bg-[#F5F5F5] flex flex-col gap-0.5 justify-center rounded-2xl w-full max-w-xs h-[70px] `}
        >
            <div class={`${phoneError() ? "border border-red-500" : ""} w-full  p-3 rounded-2xl`}>
                <PhoneInput
                    value={phone()}
                    onChange={(fullNumber, isValid) => {
                        setPhone(fullNumber);
                        if (!isValid && fullNumber) {
                            setPhoneError("Please enter a valid phone number");
                        } else {
                            setPhoneError("");
                        }
                    }}
                />
            </div>
            {/* {phoneError() && (
                <p class="text-red-500 text-xs mt-1">{phoneError()}</p>
            )} */}
        </Motion.div>
    );

    // Stage title component
    const StageName = () => {
        return (
            <Motion.h4
                initial={{ opacity: 0, y: 30 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                        delay: 0.01,
                        easing: [0.19, 1, 0.22, 1],
                        duration: 1.2,
                    },
                }}
                exit={{
                    opacity: 0,
                    scale: 1.01,
                    y: -30,
                    transition: {
                        duration: 0.7,
                        easing: [0.16, 1, 0.29, 0.99],
                    },
                }}
                class="text-[#333232] text-xl leading-[120%] tracking-[-2%] font-medium"
            >
                Enter your name
            </Motion.h4>
        );
    };

    const StageEmail = () => {
        return (
            <Motion.h4
                initial={{ opacity: 0, y: 30 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                        delay: 0.01,
                        easing: [0.19, 1, 0.22, 1],
                        duration: 1.2,
                    },
                }}
                exit={{
                    opacity: 0,
                    scale: 1.01,
                    y: -30,
                    transition: {
                        duration: 0.7,
                        easing: [0.16, 1, 0.29, 0.99],
                    },
                }}
                class="text-[#333232] text-xl leading-[120%] tracking-[-2%] font-medium"
            >
                Enter your email
            </Motion.h4>
        );
    };

    const StageOTP = () => {
        return (
            <Motion.h4
                initial={{ opacity: 0, y: 30 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                        delay: 0.01,
                        easing: [0.19, 1, 0.22, 1],
                        duration: 1.2,
                    },
                }}
                exit={{
                    opacity: 0,
                    scale: 1.01,
                    y: -30,
                    transition: {
                        duration: 0.7,
                        easing: [0.16, 1, 0.29, 0.99],
                    },
                }}
                class="text-[#333232] text-xl leading-[120%] tracking-[-2%] font-medium"
            >
                Enter the OTP
            </Motion.h4>
        );
    };

    const StagePhone = () => {
        return (
            <Motion.h4
                initial={{ opacity: 0, y: 30 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                        delay: 0.01,
                        easing: [0.19, 1, 0.22, 1],
                        duration: 1.2,
                    },
                }}
                exit={{
                    opacity: 0,
                    scale: 1.01,
                    y: -30,
                    transition: {
                        duration: 0.7,
                        easing: [0.16, 1, 0.29, 0.99],
                    },
                }}
                class="text-[#333232] text-xl leading-[120%] tracking-[-2%] font-medium"
            >
                Enter your phone number
            </Motion.h4>
        );
    };

    const StageCongratulations = () => {
        return (
            <Motion.h4
                initial={{ opacity: 0, y: 30 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                        delay: 0.01,
                        easing: [0.19, 1, 0.22, 1],
                        duration: 1.2,
                    },
                }}
                exit={{
                    opacity: 0,
                    scale: 1.01,
                    y: -30,
                    transition: {
                        duration: 0.7,
                        easing: [0.16, 1, 0.29, 0.99],
                    },
                }}
                class="text-[#333232] text-xl leading-[120%] tracking-[-2%] font-medium"
            >
                Congratulations 🎊
            </Motion.h4>
        );
    };
    // Next button component
    const NextButton = () => (
        <button
            disabled={isLoading()}
            onClick={handleNextStep}
            class="bg-black w-14 h-14 flex items-center justify-center rounded-full mt-auto self-end
             disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-200"
            aria-label="Next step"
        >
            {isLoading() ? (
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <img src="/arrow-right.svg" alt="Next" class="w-6 h-6" />
            )}
        </button>
    );

    return (
        <div class="shrink-0 flex flex-col gap-8 w-[324px]">
            {/* Stage title */}
            <Presence exitBeforeEnter>
                <Show when={currentStage() === "name"}>
                    <StageName />
                </Show>
                <Show when={currentStage() === "email"}>
                    <StageEmail />
                </Show>
                <Show when={currentStage() === "email-otp"}>
                    <StageOTP />
                </Show>
                <Show when={currentStage() === "phone"}>
                    <StagePhone />
                </Show>
                <Show when={currentStage() === "done"}>
                    <StageCongratulations />
                </Show>
            </Presence>

            {/* Input fields */}
            <Presence exitBeforeEnter>
                <Show when={currentStage() === "name"}>
                    <NameInput />
                </Show>

                <Show when={currentStage() === "email"}>
                    <EmailInput />
                </Show>

                <Show when={currentStage() === "email-otp"}>
                    <OtpInput />
                </Show>

                <Show when={currentStage() === "phone"}>
                    <PhoneNumberInput />
                </Show>
            </Presence>

            {/* Next button */}
            <Show when={currentStage() !== "done"}>
                <div class="flex justify-end max-w-xs w-full mt-auto">
                    <NextButton />
                </div>
            </Show>
        </div>
    );
};

// Main App component
export default function App() {
    return (
        <>
            <nav class="p-2.5">
                <div class="w-12 h-12 bg-white items-center flex justify-center rounded-full">
                    <Logo size="32" />
                </div>
            </nav>

            <div class="max-w-6xl mx-auto rounded-3xl">
                <div class="bg-white mt-40 w-full gap-5 rounded-3xl p-20 items-center flex justify-between max-md:flex-wrap max-md:justify-center">
                    <h2 class="gap-2 font-medium text-4xl max-md:text-3xl leading-[120%] tracking-[-2%] text-black/80">
                        <GPTAnimationWithBlur />
                    </h2>

                    <AuthForm />
                </div>
            </div>
        </>
    );
}
