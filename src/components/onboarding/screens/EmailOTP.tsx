import { Accessor, Component, Setter } from 'solid-js'
import { Motion } from 'solid-motionone'

interface Props {
    otp: Accessor<string>;
    setOtp: Setter<string>;
}

const EmailOTP: Component<Props> = (props) => {
    return (
        <>
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
                class="flex flex-col gap-[16px]"
            >
                <h4 class="text-[#333232] text-[21px] leading-[120%] tracking-[-2%] font-medium font-instrument-sans">
                    Enter the OTP
                </h4>
                <div
                    class="bg-[#F5F5F5] flex flex-col gap-0.5 justify-center p-[12px] rounded-[16px] w-[374px] h-[70px]"
                >
                    {/* <p class="text-[#6B6B6B] text-[13px] font-inter">
                                        OTP
                                    </p> */}
                    <input
                        type="text"
                        value={props.otp()}
                        onInput={(e) => {
                            e.target.value.replace(/[^0-9]/g, '')
                            props.setOtp(e.target.value)
                        }}
                        name="code"
                        id="code"
                        class="font-medium outline-none block  px-8 border-gray-300  rounded-md   text-center w-full"
                        style="letter-spacing: 40px;"
                        placeholder="••••"
                        maxlength="6"
                        // @ts-ignore
                        onclick="this.select();"
                    ></input>
                </div>
            </Motion.div>
        </>
    )
}

export default EmailOTP
