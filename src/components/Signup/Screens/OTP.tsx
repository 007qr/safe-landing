import { storeAccessToken, storeRefreshToken } from "~/lib/auth";
import { authenticate } from "~/lib/authApi";
import Tracker from "~/lib/tracker";
import { SignUpModalFlow } from "./Screens.types";
import { Loader } from "../../widgets/FirstLandingPage/FinalCard";
import OTPInputComponent from "~/ui/base/OTPField";
import { Accessor, createSignal, Setter, Show } from "solid-js";

export default function OTP({
    methodId,
    setFlow,
    email,
    tracker
}: {
    email: Accessor<string>;
    methodId: Accessor<string>;
    setFlow: Setter<SignUpModalFlow>;
    tracker: Tracker
}) {
    const [isLoading, setIsLoading] = createSignal<boolean>(false);
    const [otp, setOTP] = createSignal<string>("");
    const [error, setError] = createSignal<boolean>(false);

    const handleChange = async (input_otp: string) => {
        setOTP(input_otp);

        if (input_otp.length === 6) {
            // validated it
            setIsLoading(true);
            try {
                // const { accessToken, refreshToken } = await authenticate(
                //     email(),
                //     otp(),
                //     methodId()
                // );

                // if (!accessToken || !refreshToken) {
                //     throw new Error("Authentication failed");
                // }

                // storeAccessToken(accessToken);
                // storeRefreshToken(refreshToken);
                setFlow("step3");
                // tracker.trackEvent("email-entered", ['email'], [email()])
            } catch (err) {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <Show when={!isLoading()} fallback={<Loader />}>
            <div class="flex flex-col h-full w-full mt-[16px] bg-white p-[70px] max-md:p-[20px] items-center">
            <div>
                <h3 class="text-[31px] font-semibold tracking-tighter leading-[150%]">
                    Check you email
                </h3>
                <p class="text-black/60 text-sm leading-[150%]">
                    Enter the 6 digit code we have emailed you
                </p>
            </div>
            <div class="mt-[32px]">
                <OTPInputComponent
                    error={error()}
                    autoFocus
                    isNumberInput
                    length={6}
                    onChangeOTP={handleChange}
                />
            </div>
        </div>
        </Show>
    );
}
