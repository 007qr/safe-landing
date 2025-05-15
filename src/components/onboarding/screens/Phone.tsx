import { Accessor, Component, Setter } from 'solid-js'
import { Motion } from 'solid-motionone'
import PhoneField from '~/ui/base/PhoneField'

interface Props {
    phone: Accessor<string>
    setPhone: Setter<string>
}

const Phone: Component<Props> = (props) => {
    return (
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
                Enter your phone
            </h4>
            <div class="bg-[#F5F5F5] flex flex-col gap-0.5 justify-center p-[12px] rounded-[16px] w-[374px] h-[70px]">
                <PhoneField
                    value={props.phone()}
                    onChange={(fullName, isValid) => {
                        props.setPhone(fullName)
                    }}
                />
            </div>
        </Motion.div>
    )
}

export default Phone
