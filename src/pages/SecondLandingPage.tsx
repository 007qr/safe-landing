import { Component, createSignal, onMount, Show } from "solid-js";
import { Motion, Presence } from "solid-motionone";

import GPTAnimationWithBlur from "~/components/widgets/GPTAnimationWithBlur";
// import Tracker from "./Tracker";
import { authenticate, refreshAccessToken, requestOtp } from "~/lib/authApi";
import {
    clearAuth,
    getRefreshToken,
    storeAccessToken,
    storeRefreshToken,
} from "~/lib/auth";

import PhoneField from "~/ui/base/PhoneField";
import ArrowRight from "~/ui/icons/ArrowRight";


export type Flow = "email" | "name" | "phone" | "email-otp" | "otp" | "done";

const FLOW_PATTERN: Flow[] = [
    "name",
    "email",
    "email-otp",
    "phone",
    "otp",
    "done",
];

interface Props {

}

const SecondLandingPage: Component<Props> = () => {
    // const tracker = new Tracker("lp1");

    const [email, setEmail] = createSignal<string>("");
    const [otp, setOtp] = createSignal<string>("");
    const [name, setName] = createSignal<string>("Vish Vadlamani");
    const [phone, setPhone] = createSignal<string>("");
    const [phoneOtp, setPhoneOtp] = createSignal<string>("");
    const [methodId, setMethodId] = createSignal<string>("");

    const [flow, setFlow] = createSignal<number>(0);

    const handleClick = async () => {
        switch (FLOW_PATTERN[flow()]) {
            case "email": // user is requesting for otp
                // const res = await requestOtp(email());
                // setMethodId(res.email_id);
                break;

            case "email-otp": // user has successfully entered the email and otp
                // const { accessToken, refreshToken } = await authenticate(
                //     email(),
                //     otp(),
                //     methodId()
                // );
                // storeAccessToken(accessToken);
                // storeRefreshToken(refreshToken);
                // tracker.trackEvent("email-entered", ["email"], [email()]);
                break;
            case "otp": // user has successfully entered the phone and verified it
                // tracker.trackEvent("phone-entered", ["phone"], [phone()]);
                break;
        }

        setFlow((v) => (v + 1) % FLOW_PATTERN.length);
    };

    onMount(async () => {
        const refreshToken = getRefreshToken();
        if (!refreshToken) return;

        try {
            const newToken = await refreshAccessToken(refreshToken);
            storeAccessToken(newToken);
        } catch {
            clearAuth();
        }
    });

    return (
        <>
            <nav class="p-[10px]">
                <div class="w-[48px] h-[48px] bg-white items-center flex justify-center rounded-full">
                    <img src="/safeapp.svg" alt="" class="w-[32px] h-[32px]" />
                </div>
            </nav>

            <div class="max-w-[1150px] mx-auto rounded-[32px]">
                <h2 class="gap-2 mt-[30px] font-instrument-sans font-medium text-[48px] max-md:text-[38px] leading-[120%] tracking-[-2%] text-black/80">
                    <GPTAnimationWithBlur />
                </h2>
                <div class="bg-white mt-[152px] w-full gap-[20px] rounded-[32px] p-[32px] flex justify-between max-md:flex-wrap max-md:items-center">
                    <div class="w-full flex flex-col gap-[16px]">
                        <Presence exitBeforeEnter>
                            <Show when={FLOW_PATTERN[flow()] === "name"}>
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
                                    class="text-[#333232] text-[21px] leading-[120%] tracking-[-2%] font-medium font-instrument-sans"
                                >
                                    Enter your name
                                </Motion.h4>
                            </Show>

                            <Show when={FLOW_PATTERN[flow()] === "email"}>
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
                                    class="text-[#333232] text-[21px] leading-[120%] tracking-[-2%] font-medium font-instrument-sans"
                                >
                                    Enter your email
                                </Motion.h4>
                            </Show>

                            <Show when={FLOW_PATTERN[flow()] === "email-otp"}>
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
                                    class="text-[#333232] text-[21px] leading-[120%] tracking-[-2%] font-medium font-instrument-sans"
                                >
                                    Enter the OTP
                                </Motion.h4>
                            </Show>

                            <Show when={FLOW_PATTERN[flow()] === "phone"}>
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
                                    class="text-[#333232] text-[21px] leading-[120%] tracking-[-2%] font-medium font-instrument-sans"
                                >
                                    Enter your phone
                                </Motion.h4>
                            </Show>

                            <Show when={FLOW_PATTERN[flow()] === "otp"}>
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
                                    class="text-[#333232] text-[21px] leading-[120%] tracking-[-2%] font-medium font-instrument-sans"
                                >
                                    Enter the OTP
                                </Motion.h4>
                            </Show>

                            <Show when={FLOW_PATTERN[flow()] === "done"}>
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
                                    class="text-[#333232] text-[21px] leading-[120%] tracking-[-2%] font-medium font-instrument-sans"
                                >
                                    Congratulations 🎊
                                </Motion.h4>
                            </Show>
                        </Presence>

                        <Presence exitBeforeEnter>
                            <Show when={FLOW_PATTERN[flow()] === "name"}>
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
                                    class="bg-[#F5F5F5] flex flex-col gap-0.5 justify-center p-[12px] rounded-[16px] w-full max-w-[374px] h-[70px]"
                                >
                                    <p class="text-[#6B6B6B] text-[13px] font-inter">
                                        Your name
                                    </p>
                                    <input
                                        type="text"
                                        value={name()}
                                        onInput={(e) => {
                                            setName(e.target.value);
                                        }}
                                        class="font-inter text-[17px] outline-none border-none text-[##1D1D1F]"
                                        placeholder="type here"
                                    />
                                </Motion.div>
                            </Show>

                            <Show when={FLOW_PATTERN[flow()] === "email"}>
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
                                    class="bg-[#F5F5F5] flex flex-col gap-0.5 justify-center p-[12px] rounded-[16px] w-[374px] h-[70px]"
                                >
                                    <p class="text-[#6B6B6B] text-[13px] font-inter">
                                        Your email
                                    </p>
                                    <input
                                        onInput={(e) => {
                                            setEmail(e.target.value);
                                        }}
                                        value={email()}
                                        type="text"
                                        class="font-inter text-[17px] outline-none border-none text-[##1D1D1F]"
                                        placeholder="type here"
                                    />
                                </Motion.div>
                            </Show>

                            <Show when={FLOW_PATTERN[flow()] === "email-otp"}>
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
                                    class="bg-[#F5F5F5] flex flex-col gap-0.5 justify-center p-[12px] rounded-[16px] w-[374px] h-[70px]"
                                >
                                    {/* <p class="text-[#6B6B6B] text-[13px] font-inter">
                                        OTP
                                    </p> */}
                                    <input
                                        type="text"
                                        value={otp()}
                                        onInput={(e) => {
                                            e.target.value.replace(
                                                /[^0-9]/g,
                                                ""
                                            );
                                            setOtp(e.target.value);
                                        }}
                                        name="code"
                                        id="code"
                                        class="font-medium outline-none block  px-8 border-gray-300  rounded-md   text-center w-full"
                                        style="letter-spacing: 40px;"
                                        placeholder="••••"
                                        maxlength="4"
                                        // @ts-ignore
                                        onclick="this.select();"
                                    ></input>
                                </Motion.div>
                            </Show>

                            <Show when={FLOW_PATTERN[flow()] === "phone"}>
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
                                    class="bg-[#F5F5F5] flex flex-col gap-0.5 justify-center p-[12px] rounded-[16px] w-[374px] h-[70px]"
                                >
                                    <PhoneField
                                        value={phone()}
                                        onChange={(fullName, isValid) => {
                                            setPhone(fullName);
                                        }}
                                    />
                                </Motion.div>
                            </Show>

                            <Show when={FLOW_PATTERN[flow()] === "otp"}>
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
                                    class="bg-[#F5F5F5] flex flex-col gap-0.5 justify-center p-[12px] rounded-[16px] w-[374px] h-[70px]"
                                >
                                    {/* <p class="text-[#6B6B6B] text-[13px] font-inter">
                                        OTP
                                    </p> */}
                                    <input
                                        type="text"
                                        value={phoneOtp()}
                                        onInput={(e) => {
                                            e.target.value.replace(
                                                /[^0-9]/g,
                                                ""
                                            );
                                            setPhoneOtp(e.target.value);
                                        }}
                                        name="code"
                                        id="code"
                                        class="font-medium outline-none block  px-8 border-gray-300  rounded-md   text-center w-full"
                                        style="letter-spacing: 40px;"
                                        placeholder="••••"
                                        maxlength="4"
                                        // @ts-ignore
                                        onclick="this.select();"
                                    ></input>
                                </Motion.div>
                            </Show>
                        </Presence>

                        <div class="flex justify-end max-w-[374px] w-full mt-auto">
                            <button
                                on:click={handleClick}
                                class="bg-black w-[56px] h-[56px] flex items-center justify-center rounded-full mt-auto self-end"
                            >
                                <ArrowRight class="w-[24px] h-[24px]" />
                            </button>
                        </div>
                    </div>
                    <div class="bg-[#f5f5f5] w-full max-w-[500px] h-[276px] rounded-[24px]"></div>
                </div>
            </div>
        </>
    );
}

export default SecondLandingPage;


