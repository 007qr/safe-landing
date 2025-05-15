import { Accessor, Component, Setter } from 'solid-js'

import { Motion } from 'solid-motionone'
import { useAuthStore } from '~/components/auth/Auth.store'

interface Props {
    name: Accessor<string>
    setName: Setter<string>
}

const Name: Component<Props> = (props) => {
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
                class='flex flex-col gap-[16px]'
            >
                <h4 class="text-[#333232] text-[21px] leading-[120%] tracking-[-2%] font-medium font-instrument-sans">
                    Enter your name
                </h4>

                <div class="bg-[#F5F5F5] flex flex-col gap-0.5 justify-center p-[12px] rounded-[16px] w-full max-w-[374px] h-[70px]">
                    <p class="text-[#6B6B6B] text-[13px] font-inter">Your name</p>
                    <input
                        type="text"
                        value={props.name()}
                        onInput={(e) => {
                            props.setName(e.target.value)
                        }}
                        class="font-inter text-[17px] outline-none border-none text-[##1D1D1F]"
                        placeholder="type here"
                    />
                </div>
            </Motion.div>
        </>
    )
}

export default Name
