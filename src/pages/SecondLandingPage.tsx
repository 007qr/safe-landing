import { Component, createSignal, Match, onMount, Show, Switch } from 'solid-js'
import lp2Styles from './SecondLandingPage.module.css'
import tempVideo from '~/assets/temp-video.mp4'
import Heart from '~/ui/icons/Heart'
import Maximize from '~/ui/icons/Maximize'
import Minimize from '~/ui/icons/Minimize'
import Play from '~/ui/icons/Play'
import Pause from '~/ui/icons/Pause'
import Speaker from '~/ui/icons/Speaker'
import SpeakerOff from '~/ui/icons/SpeakerOff'
import HeartFilled from '~/ui/icons/HeartFilled'
import { SignUpModalFlow } from '~/components/signup/screens/Screens.types'
import Email from '~/components/signup/screens/Email'
import OTP from '~/components/signup/screens/OTP'
import Tracker from '~/lib/tracker'
import Step3 from '~/components/signup/screens/Step3'
import Joined from '~/components/signup/screens/Joined'

const SecondLandingPage: Component = () => {
    const [flow, setFlow] = createSignal<SignUpModalFlow>('joined')
    const [methodId, setMethodId] = createSignal<string>('')
    const [userId, setUserId] = createSignal<string>('')
    const [email, setEmail] = createSignal<string>('')
    const [isFullScreen, setIsFullScreen] = createSignal<boolean>()
    const [videoPlay, setVideoPlay] = createSignal<boolean>(true)
    const [videoMuted, setVideoMuted] = createSignal<boolean>(false)
    const [like, setLike] = createSignal<boolean>(localStorage.getItem('liked') === 'true')

    const tracker = new Tracker('lp2')

    let videoRef!: HTMLVideoElement
    let containerRef!: HTMLDivElement

    function handlePlay() {
        if (videoRef.paused) {
            videoRef.play()
            setVideoPlay(true)
        } else {
            videoRef.pause()
            setVideoPlay(false)
        }
    }

    function handleFullScreen() {
        if (!document.fullscreenElement) {
            containerRef.requestFullscreen()
            setIsFullScreen(true)
        } else {
            document.exitFullscreen?.()
            setIsFullScreen(false)
        }
    }

    function handleVolume() {
        if (videoMuted()) {
            videoRef.volume = 1
        } else {
            videoRef.volume = 0
        }
        setVideoMuted((v) => !v)
    }

    function handleLike() {
        if (localStorage.getItem('liked') === 'true') {
            localStorage.setItem('liked', 'false')
            setLike(false)
        } else {
            setLike(true)
            localStorage.setItem('liked', 'true')
        }
    }

    onMount(() => {
        videoRef.volume = 1
    })

    return (
        <div class="h-screen flex flex-col items-center justify-center gap-[8px] bg-white" ref={containerRef}>
            <div class="flex flex-col gap-[8px]">
                <div class="flex">
                    <div
                        class="h-[calc(100vh-52px)] relative"
                        classList={{
                            'flex items-center': flow() !== 'step1',
                        }}
                    >
                        <Switch>
                            <Match when={flow() === 'step1'}>
                                <video
                                    muted={true}
                                    autoplay={true}
                                    loop={true}
                                    class="w-full h-full rounded-[16px]"
                                    ref={videoRef}
                                    onError={(err) => console.error('err', err)}
                                >
                                    <source src={tempVideo} />
                                </video>
                            </Match>

                            <Match when={flow() === 'email'}>
                                <div class="w-[calc((100vh-32px)*0.5625)] flex items-center mb-[50px]">
                                    <Email
                                        class="p-0 "
                                        email={email}
                                        setEmail={setEmail}
                                        setFlow={setFlow}
                                        setMethodId={setMethodId}
                                        setUserId={setUserId}
                                    />
                                </div>
                            </Match>

                            <Match when={flow() === 'otp'}>
                                <div class="w-[calc((100vh-32px)*0.5625)] flex items-center mb-[50px]">
                                    <OTP
                                        class="p-0"
                                        email={email}
                                        methodId={methodId}
                                        setFlow={setFlow}
                                        tracker={tracker}
                                    />
                                </div>
                            </Match>
                            <Match when={flow() === 'step3'}>
                                <div class="w-[calc((100vh-32px)*0.5625)] flex items-center mb-[50px]">
                                    <Step3
                                        class="p-0"
                                        email={email}
                                        setFlow={setFlow}
                                        tracker={tracker}
                                        userId={userId}
                                    />
                                </div>
                            </Match>
                            <Match when={flow() === 'joined'}>
                                <div class="w-[calc((100vh-32px)*0.5625)] flex items-center mb-[50px]">
                                    <Joined class='p-0' />
                                </div>
                            </Match>
                        </Switch>
                        <Show when={flow() === 'step1'}>
                            <div class={lp2Styles.mobile_action_container}>
                                <div class={lp2Styles.action_buttons}>
                                    <div
                                        class="flex items-center justify-center cursor-pointer w-[48px] h-[48px] bg-black hover:bg-black/80 rounded-full text-white"
                                        on:click={handleLike}
                                    >
                                        <Show when={!like()} fallback={<HeartFilled width={24} height={24} />}>
                                            <Heart width={24} height={24} />
                                        </Show>
                                    </div>
                                </div>
                            </div>
                            <div class="absolute top-0 px-[16px] py-[32px] flex gap-[16px] justify-between w-full">
                                <div class="flex gap-[16px]">
                                    <div
                                        class="flex items-center justify-center cursor-pointer w-[48px] h-[48px] bg-black hover:bg-black/80 rounded-full text-white"
                                        on:click={handlePlay}
                                    >
                                        <Show when={videoPlay()} fallback={<Play width={20} height={20} />}>
                                            <Pause width={20} height={20} />
                                        </Show>
                                    </div>
                                    <div
                                        class="flex items-center justify-center cursor-pointer w-[48px] h-[48px] bg-black hover:bg-black/80 rounded-full text-white"
                                        on:click={handleVolume}
                                    >
                                        <Show when={!videoMuted()} fallback={<SpeakerOff width={24} height={24} />}>
                                            <Speaker width={24} height={24} />
                                        </Show>
                                    </div>
                                </div>
                                <div
                                    class="flex items-center justify-center cursor-pointer w-[48px] h-[48px] rounded-full bg-black hover:bg-black/80 text-white"
                                    on:click={handleFullScreen}
                                >
                                    <Show when={isFullScreen()} fallback={<Maximize width={20} height={20} />}>
                                        <Minimize width={20} height={20} />
                                    </Show>
                                </div>
                            </div>
                        </Show>
                    </div>
                    <Show when={flow() === 'step1'}>
                        <div class={lp2Styles.laptop_action_bottons_container}>
                            <div class={lp2Styles.action_buttons}>
                                <div
                                    class="flex items-center justify-center cursor-pointer w-[48px] h-[48px] bg-black hover:bg-black/80 rounded-full text-white"
                                    on:click={handleLike}
                                >
                                    <Show when={!like()} fallback={<HeartFilled width={24} height={24} />}>
                                        <Heart width={24} height={24} />
                                    </Show>
                                </div>
                            </div>
                        </div>
                    </Show>
                </div>
                <Show when={flow() === 'step1'}>
                    <div class={lp2Styles.cta_text_container} on:click={() => setFlow('email')}>
                        <span class={lp2Styles.cta_text}>Get Safe for Free</span>
                    </div>
                </Show>
            </div>
        </div>
    )
}

export default SecondLandingPage
