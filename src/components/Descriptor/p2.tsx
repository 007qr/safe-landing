import { createResource, createSignal, For, Setter, Show } from 'solid-js'
import { Motion, Presence } from 'solid-motionone'
import DescriptorField from './DescriptorField'
import LeftArrow from '~/ui/icons/LeftArrow'
import AddBulkDescriptor from './AddBulkDescriptor'
import { listDescriptors } from '~/lib/descriptorApi'
import LoadingIcon from '~/ui/icons/Loading'
import RadarAnimation from './RadarAnimtion'
import DescriptorRow from './DescriptorRow'
import Receipt from '~/ui/icons/Receipt'
import ArrowRight from '~/ui/icons/ArrowRight'


export type DescriptorFlow = 'first' | 'second' | 'third' | 'fourth' | 'add_bulk' | 'default' | 'list_descriptors'

export default function P2() {
    const [isRegistered, setIsRegistered] = createSignal(false)
    const text1 = 'Here’s how it works —'
    const text2 =
        'We monitor the name your customers see on their bank statements. Then, we intercept any disputes before they hurt you.'

    const [flow, setFlow] = createSignal<DescriptorFlow>('first')

    function goBack() {
        setFlow((prev) => {
            if (prev === 'third') return 'second'
            if (prev === 'second') return 'first'
            if (prev === 'fourth' && !isRegistered()) return 'third'
            if (prev === 'fourth' && isRegistered()) return 'list_descriptors'
            if (prev === 'list_descriptors') return 'default'
            return 'first' // already at start
        })
    }

    return (
        <>
            <div
                class={`${
                    flow() === 'add_bulk' ? 'p-[16px]' : ''
                } w-[364px] h-[364px] bg-white rounded-[24px] border border-[#1D1D1F14] flex flex-col relative`}
                style="box-shadow: 0px 4px 2px 0px rgba(0, 0, 0, 0.02);"
            >
                <Show when={flow() !== 'add_bulk'}>
                    <div class="rounded-[24px]">
                        <Motion.div
                            animate={{
                                height:
                                    flow() === 'first' || flow() === 'default' || flow() === 'list_descriptors'
                                        ? '364px'
                                        : flow() === 'second' || flow() === 'fourth'
                                        ? '288px'
                                        : '124px',
                                background:
                                    flow() === 'list_descriptors' || flow() === 'default'
                                        ? '#ffffff'
                                        : flow() === 'first'
                                        ? 'radial-gradient(50% 50% at 50% 50%, #F7E1B7 0%, #FFFFFF 100%)'
                                        : 'linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)',
                            }}
                            class={`${
                                flow() !== 'first' && flow() !== 'default' && flow() !== 'list_descriptors'
                                    ? 'rounded-t-[24px]'
                                    : 'rounded-[24px]'
                            } ${flow() === 'first' || flow() === 'default' ? 'items-center justify-center' : ''}
                            ${flow() === 'fourth' ? 'items-center justify-between' : ''}
                        relative p-[16px] w-full flex flex-col gap-[16px]`}
                            style="background: linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%);"
                        >
                            <Show when={flow() === 'first'}>
                                <h1
                                    class="w-[222px] text-center font-bold text-[33px] leading-[110%] tracking-[0%] text-[rgba(0,0,0,0.6)] "
                                    style="backdrop-filter: blur(48px)"
                                >
                                    Prevent Chargebacks with AI
                                </h1>
                            </Show>

                            <Show when={flow() === 'default'}>
                                <RadarAnimation />
                            </Show>
                            <Show when={flow() !== 'first' && flow() != 'fourth' && flow() !== 'default'}>
                                <div class="flex justify-between items-center">
                                    <Show when={flow() !== 'fourth'}>
                                        <button on:click={() => goBack()} class="self-start cursor-pointer">
                                            <LeftArrow />
                                        </button>
                                    </Show>
                                    <Show when={flow() === 'list_descriptors'}>
                                        <h2 class="self-center font-medium text-[17px] leading-[130%] tracking-[0%] font-inter">
                                            Descriptors
                                        </h2>
                                        <div class="w-[24px]"></div>
                                    </Show>
                                    <Show when={flow() == 'second'}>
                                        <button class="font-inter text-[13px] font-medium text-[#494949] self-end">
                                            Skip
                                        </button>
                                    </Show>
                                </div>
                            </Show>
                            <Show when={flow() === 'third'}>
                                <div class="absolute top-1/2 left-1/2 -translate-1/2">
                                    <DescriptorText name="NETFLIX.COM" />
                                </div>
                            </Show>

                            <Show when={flow() === 'second'}>
                                <div class="flex flex-col gap-[16px]">
                                    <span>
                                        <For each={text1.split(' ')}>
                                            {(el, index) => {
                                                const isBold =
                                                    el === 'how' || el === 'it' || el === 'works' || el === '—'
                                                return (
                                                    <>
                                                        <span
                                                            style={{
                                                                'animation-delay': `${300 + index() * 150}ms`,

                                                                'font-weight': `${isBold ? '500' : ''}`,
                                                            }}
                                                            class="animate-fade-in whitespace-pre text-[15px] leading-[150%] tracking-[0] text-[#1d1df] font-inter   "
                                                        >
                                                            {el}
                                                        </span>
                                                        <span> </span>
                                                    </>
                                                )
                                            }}
                                        </For>
                                    </span>
                                    <span>
                                        <For each={text2.split(' ')}>
                                            {(el, index) => {
                                                const isBold = el === 'monitor' || el === 'intercept'

                                                return (
                                                    <>
                                                        <span
                                                            style={{
                                                                'animation-delay': `${800 + index() * 150}ms`,

                                                                'font-weight': `${isBold ? '500' : ''}`,
                                                            }}
                                                            class="animate-fade-in whitespace-pre text-[15px] leading-[150%] tracking-[0] text-[#1d1df] font-inter   "
                                                        >
                                                            {el}
                                                        </span>
                                                        <span> </span>
                                                    </>
                                                )
                                            }}
                                        </For>
                                    </span>
                                </div>
                            </Show>

                            <Show when={flow() === 'fourth'}>
                                <h3 class="mt-[35px] text-[21px] font-medium leading-[130%] tracking-[0%] text-[#1D1D1F] font-inter text-center">
                                    You’re all set!
                                </h3>
                                <p class="text-center font-inter text-[13px] leading-[130%] tracking-[0%] pb-[7px]">
                                    Your Payment Descriptors are added. We’ll let you know if anything else is needed.
                                </p>
                            </Show>

                            <Show when={flow() === 'list_descriptors'}>
                                <DescriptorList setFlow={setFlow} />
                            </Show>
                        </Motion.div>
                        <Show when={flow() === 'third'}>
                            <div class="flex flex-col p-[16px] gap-[16px]">
                                <div class="flex justify-between w-full">
                                    <p class="text-[15px] font-inter font-medium text-[#1d1d1f]">Add Descriptor</p>
                                    <p
                                        class="text-[13px] font-inter font-medium text-[#1d1d1f] cursor-pointer"
                                        on:click={(e) => setFlow('add_bulk')}
                                    >
                                        + Add bulk
                                    </p>
                                </div>
                                <DescriptorField />
                            </div>
                        </Show>
                    </div>

                    <Show when={flow() !== 'first' && flow() !== 'default' && flow() != 'list_descriptors'}>
                        <button
                            class="cursor-pointer absolute w-[332px] outline-none bottom-[16px] mx-[16px] text-[13px] bg-[#ececec] rounded-[12px] p-[12px] leading-[110%] tracking-[-2%] font-medium font-inter"
                            on:click={(e) => {
                                if (flow() === 'second') return setFlow('third')
                                if (flow() === 'third') return setFlow('fourth')
                                if (flow() === 'fourth') setIsRegistered(true)
                                return setFlow('default')
                            }}
                        >
                            {flow() === 'second' ? 'Continue' : flow() === 'third' ? 'Finish Setup' : 'Done'}
                        </button>
                    </Show>

                    <Show when={flow() === 'first'}>
                        <div class="absolute flex justify-end max-w-[374px] w-full mt-auto z-10 bottom-[16px] right-[16px]">
                            <button
                                on:click={() => setFlow('second')}
                                class="bg-black cursor-pointer  w-[56px] h-[56px] flex items-center justify-center rounded-full mt-auto self-end"
                            >
                                <ArrowRight class='w-[24px h-[24px]' />
                            </button>
                        </div>
                    </Show>
                </Show>

                <Show when={flow() === 'default'}>
                    <span
                        on:click={() => {
                            setFlow('list_descriptors')
                        }}
                        class="cursor-pointer rounded-[64px] absolute w-[36px] h-[36px] bg-white flex items-center justify-center top-[16px] right-[16px]"
                        style="box-shadow: 0px 4px 32px 0px rgba(29, 29, 31, 0.12);"
                    >
                        <Receipt />
                    </span>
                </Show>

                <Presence exitBeforeEnter>
                    <Show when={flow() === 'add_bulk'}>
                        <Motion.div
                            class="w-full h-full"
                            animate={{
                                opacity: [0, 1],
                                transition: {
                                    duration: 0.3,
                                    easing: 'ease-in-out',
                                },
                            }}
                        >
                            <AddBulkDescriptor flow={flow} setFlow={setFlow} isRegistered={isRegistered} />
                        </Motion.div>
                    </Show>
                </Presence>
            </div>
        </>
    )
}

function DescriptorText({ name }: { name: string }) {
    return (
        <>
            <div
                class="w-max mx-auto flex justify-center items-center gap-[4px] font-inter text-[13px] font-mediumleading-[130%] tracking-[0%] p-[4px] rounded-[64px] bg-white"
                style="box-shadow: 0px 4px 32px 0px rgba(29, 29, 31, 0.12);"
            >
                <div class="flex gap-[4px] px-[7px]">
                    <Receipt />
                    {name}
                </div>
            </div>
        </>
    )
}

function DescriptorList({ setFlow }: { setFlow: Setter<DescriptorFlow> }) {
    const merchant_id = '415439'

    const [data] = createResource(
        () => merchant_id,
        (id) => listDescriptors({ merchant_id: id })
    )
    return (
        <>
            <div class="pt-[16px] h-[330px] overflow-y-auto custom-scrollbar">
                <div
                    class="flex flex-col gap-[4px] "
                    classList={{
                        'items-center justify-center h-full': data.loading,
                    }}
                >
                    <Show when={!data.loading} fallback={<LoadingIcon isLoading={true} />}>
                        <For each={data()}>
                            {(item) => (
                                <>
                                    <DescriptorRow
                                        descriptor_name={item.payment_descriptor}
                                        contact={item.payment_descriptor_contact}
                                        status={item.status === 'ENABLED' ? true : false}
                                        merchant_id={item.partner_merchant_id}
                                        descriptor_id={item.id}
                                    />
                                </>
                            )}
                        </For>
                    </Show>
                </div>
            </div>
            <footer class="border-t-[#1D1D1F14] border-t mt-auto">
                <button
                    on:click={() => setFlow('add_bulk')}
                    class="w-max bg-[#F5F5F5] mt-[16px] cursor-pointer p-[4px] rounded-[24px] font-inter leading-[130%] tracking-[0%] text-[13px] font-medium"
                >
                    + Add bulk
                </button>
            </footer>
        </>
    )
}
