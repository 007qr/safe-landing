import { Component } from 'solid-js'
import { Motion } from 'solid-motionone'

interface Props {}

const Registered: Component<Props> = () => {
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
        >
            <h4 class="text-[#333232] text-[21px] leading-[120%] tracking-[-2%] font-medium font-instrument-sans">
                Congratulations 🎊
            </h4>
        </Motion.div>
    )
}
export default Registered
