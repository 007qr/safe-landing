import { For, Show, createEffect, createResource } from 'solid-js'
import { Presence, Motion } from 'solid-motionone'
import MasterCard from '../widgets/MasterCard'
import { aiText, DisputeEvidenceInfoInput, DisputeStates } from './AIResponse.types'
import AISteps from './AISteps'
import DisputeState from './DisputeState'
import AIGif from '~/ui/icons/AIGif'
import { aiWidgetStore } from './AIResponse.store'
import { GetDisputeEvidenceInfoResponse } from './AIResponse.types'

interface Props {
    authToken: string;
    disputeStates: DisputeStates;
    input: DisputeEvidenceInfoInput
}

export default function AIWidget(props: Props) {
    let buttonRef!: HTMLButtonElement
    let containerRef!: HTMLDivElement
    // Get store methods and state
    const { aiThinking, visibleSteps, toggleAIThinking, fetchDispute } = aiWidgetStore(props.authToken)
    const [disputeInfo, { refetch }] = createResource<GetDisputeEvidenceInfoResponse>(() =>
        fetchDispute(props.input)
    )

    // Use createEffect to handle class changes explicitly when state changes
    createEffect(() => {
        if (aiThinking()) {
            containerRef.style.maskImage = 'linear-gradient(transparent -22%, black, transparent 113%)'
            containerRef.style.overflowY = 'auto'
            buttonRef.classList.add('-translate-x-[300px]')
            buttonRef.classList.add('scale-70')
        } else {
            containerRef.style.maskImage = 'none'
            containerRef.style.overflowY = 'hidden'
            buttonRef.classList.remove('-translate-x-[300px]')
            buttonRef.classList.remove('scale-70')
        }
    })

    const handleOnClick = () => {
        toggleAIThinking()
    }
    // Log the dispute info when it changes
    createEffect(() => {
        const info = disputeInfo()
        if (info) {
            console.log(info)
        }
    })

    return (
        <div
            ref={containerRef}
            class="w-[364px] p-[16px] text-[#1D1D1F] h-[170px] bg-white border border-[#1D1D1F14] rounded-[24px] leading-[130%] tracking-[0%]"
            style={{
                'box-shadow': '0px 4px 2px 0px #00000005',
                '-ms-overflow-style': 'none',
                'scrollbar-width': 'none',
                '-webkit-mask-image': aiThinking()
                    ? 'linear-gradient(transparent -22%, black, transparent 113%)'
                    : 'none',
                'mask-image': aiThinking() ? 'linear-gradient(transparent -22%, black, transparent 113%)' : 'none',
                'overflow-y': aiThinking() ? 'auto' : 'hidden',
            }}
        >
            <div class="flex flex-col justify-between">
                <div class="flex relative justify-between items-center">
                    <Presence exitBeforeEnter>
                        <Show when={!aiThinking()}>
                            <Motion.div
                                class="flex gap-[8px] items-center"
                                animate={{ opacity: 1 }}
                                exit={{
                                    opacity: 0,
                                    transition: {
                                        duration: 0.35,
                                        easing: 'ease-in-out',
                                    },
                                }}
                            >
                                <MasterCard number={4435} />
                                <div>
                                    <p class="text-[13px] font-inter font-medium">Leslie Alexander</p>
                                    <h2 class="text-[15px] font-inter font-medium">Product not as described</h2>
                                </div>
                            </Motion.div>
                        </Show>
                    </Presence>

                    <button
                        ref={buttonRef}
                        onClick={handleOnClick}
                        class={`outline-none cursor-pointer transition-transform duration-500 ease-in-out absolute right-0 top-0`}
                    >
                        <AIGif width="36" height="36" />
                    </button>
                </div>

                <Presence exitBeforeEnter>
                    <Show when={!aiThinking()}>
                        <Motion.div
                            class="flex justify-between items-end mt-[18%]"
                            animate={{ opacity: 1 }}
                            exit={{
                                opacity: 0,
                                transition: {
                                    duration: 0.35,
                                    easing: 'ease-in-out',
                                },
                            }}
                        >
                            <div class="flex flex-col gap-[2px]">
                                <h2 class="text-[21px] font-inter font-medium text-[#990B0B]">-$520.08</h2>
                            </div>
                            <Show when={props.disputeStates !== undefined}>
                                <DisputeState disputeState={props.disputeStates} />
                            </Show>
                        </Motion.div>
                    </Show>
                </Presence>
            </div>

            <div class="w-[200px] flex flex-col mx-auto gap-[14px] pb-[60px] pt-[30px]">
                <Show when={aiThinking()}>
                    <div class="flex flex-col">
                        <div>
                            <AIGeneratedText aiText={aiText} />
                        </div>
                        <div class="flex flex-col gap-[14px] pt-[8px]">
                            <For each={visibleSteps()}>
                                {(step, index) => {
                                    return <AISteps stepText={step} delay={index()} />
                                }}
                            </For>
                        </div>
                    </div>
                </Show>
            </div>
        </div>
    )
}

const AIGeneratedText = ({ aiText }: { aiText: string }) => {
    return (
        <For each={aiText.split(' ')}>
            {(word, i) => (
                <>
                    <span
                        class="animate-fade-in whitespace-pre inline-block"
                        style={{ 'animation-delay': `${i() * 100}ms` }}
                    >
                        {word}
                    </span>
                    <span class="whitespace-pre inline-block"> </span>
                </>
            )}
        </For>
    )
}
