import { createMemo, createSignal, onCleanup, onMount, Show } from 'solid-js'
import { Motion, Presence } from 'solid-motionone'
import LoadingIcon from '~/ui/icons/Loading'
import SaveIcon from '~/ui/icons/SaveIcon'

interface Props {
    stepText: string
    delay?: number
}

const AISteps = (props: Props) => {
    // prettier-ignore
    const animation = createMemo(() => {return {opacity: [0, 1],transition: { duration: 0, delay: props.delay + 2 }}});

    let ref!: HTMLDivElement
    const [doneThinking, setDoneThinking] = createSignal(false)

    onMount(() => {
        const delayTimeout = 1000 * props.delay + 3500

        setTimeout(() => {
            if (ref) {
                ref.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
        }, delayTimeout - 1250)

        const timeout = setTimeout(() => {
            setDoneThinking(true)
        }, delayTimeout)

        onCleanup(() => clearTimeout(timeout))
    })

    return (
        <Motion.div ref={ref} animate={animation()}>
            <div class="gap-[4px] flex items-center text-[12px] font-inter leading-[130%]">
                <Show when={!doneThinking()} fallback={<SaveIcon />}>
                    <LoadingIcon width="20px" height="20px" class="animate-spin" />
                </Show>
                {props.stepText}
            </div>
        </Motion.div>
    )
}

export default AISteps
