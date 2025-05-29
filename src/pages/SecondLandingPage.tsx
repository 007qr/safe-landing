import { Component, createSignal, Match, onMount, Show, Switch } from 'solid-js'
import lp2Styles from './SecondLandingPage.module.css'
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
    const [flow, setFlow] = createSignal<SignUpModalFlow>('step1')
    const [methodId, setMethodId] = createSignal<string>('')
    const [userId, setUserId] = createSignal<string>('')
    const [email, setEmail] = createSignal<string>('')
    const [isFullScreen, setIsFullScreen] = createSignal<boolean>(false)
    const [videoPlay, setVideoPlay] = createSignal<boolean>(true)
    const [videoMuted, setVideoMuted] = createSignal<boolean>(true)
    // Using in-memory storage instead of localStorage for compatibility
    const [like, setLike] = createSignal<boolean>(false)

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
        setVideoMuted((v) => !v)
    }

    function handleLike() {
        setLike((prev) => !prev)
    }

    onMount(() => {
        // Listen for fullscreen changes
        const handleFullscreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement)
        }
        document.addEventListener('fullscreenchange', handleFullscreenChange)

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange)
        }
    })

    return (
        <div class="h-screen bg-black flex items-center justify-center overflow-hidden" ref={containerRef}>
            <div class="relative w-full h-full max-w-md mx-auto">
                <Switch>
                    <Match when={flow() === 'step1'}>
                        <div class="relative w-full h-full">
                            {/* Video Container */}
                            <video
                                playsinline={true}
                                muted={videoMuted()}
                                autoplay={true}
                                loop={true}
                                class="w-full h-full object-cover"
                                classList={{
                                    'rounded-2xl': !isFullScreen(),
                                }}
                                ref={videoRef}
                                onError={(err) => console.error('err', err)}
                            >
                                <source src="https://assets.website.safeapi.app/SafeAppWebsite/0528.mov" />
                            </video>

                            {/* Top Controls */}
                            <div class="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                                <div class="flex items-center gap-3">
                                    <button
                                        class="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all backdrop-blur-sm"
                                        onClick={handlePlay}
                                        aria-label={videoPlay() ? "Pause video" : "Play video"}
                                    >
                                        <Show when={videoPlay()} fallback={<Play width={16} height={16} class="md:w-5 md:h-5" />}>
                                            <Pause width={16} height={16} class="md:w-5 md:h-5" />
                                        </Show>
                                    </button>
                                    <button
                                        class="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all backdrop-blur-sm"
                                        onClick={handleVolume}
                                        aria-label={videoMuted() ? "Unmute video" : "Mute video"}
                                    >
                                        <Show when={!videoMuted()} fallback={<SpeakerOff width={18} height={18} class="md:w-6 md:h-6" />}>
                                            <Speaker width={18} height={18} class="md:w-6 md:h-6" />
                                        </Show>
                                    </button>
                                </div>
                                <button
                                    class="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all backdrop-blur-sm"
                                    onClick={handleFullScreen}
                                    aria-label={isFullScreen() ? "Exit fullscreen" : "Enter fullscreen"}
                                >
                                    <Show when={isFullScreen()} fallback={<Maximize width={16} height={16} class="md:w-5 md:h-5" />}>
                                        <Minimize width={16} height={16} class="md:w-5 md:h-5" />
                                    </Show>
                                </button>
                            </div>

                            {/* Right Side Actions (TikTok/Shorts Style) */}
                            <div class="absolute right-4 bottom-20 md:bottom-24 flex flex-col items-center gap-6 z-20">
                                <div class="flex flex-col items-center gap-2">
                                    <button
                                        class="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all backdrop-blur-sm"
                                        classList={{
                                            'bg-red-500/80 hover:bg-red-500': like(),
                                        }}
                                        onClick={handleLike}
                                        aria-label={like() ? "Unlike" : "Like"}
                                    >
                                        <Show when={!like()} fallback={<HeartFilled width={24} height={24} class="md:w-7 md:h-7" />}>
                                            <Heart width={24} height={24} class="md:w-7 md:h-7" />
                                        </Show>
                                    </button>
                                    <span class="text-xs md:text-sm font-medium text-white text-center">5.4k</span>
                                </div>
                            </div>

                            {/* Bottom Gradient Overlay */}
                            <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                        </div>
                    </Match>

                    {/* Form Steps */}
                    <Match when={flow() === 'email'}>
                        <div class="w-full h-full flex items-center justify-center px-6 bg-white">
                            <Email
                                class="w-full max-w-sm p-0 justify-center"
                                email={email}
                                setEmail={setEmail}
                                setFlow={setFlow}
                                setMethodId={setMethodId}
                                setUserId={setUserId}
                            />
                        </div>
                    </Match>

                    <Match when={flow() === 'otp'}>
                        <div class="w-full h-full flex items-center justify-center px-6 bg-white">
                            <OTP
                                class="w-full max-w-sm p-0 justify-center"
                                email={email}
                                methodId={methodId}
                                setFlow={setFlow}
                                tracker={tracker}
                            />
                        </div>
                    </Match>

                    <Match when={flow() === 'step3'}>
                        <div class="w-full h-full flex items-center justify-center px-6 bg-white">
                            <Step3
                                class="w-full max-w-sm p-0 justify-center"
                                email={email}
                                setFlow={setFlow}
                                tracker={tracker}
                                userId={userId}
                            />
                        </div>
                    </Match>

                    <Match when={flow() === 'joined'}>
                        <div class="w-full h-full flex items-center justify-center px-6 bg-white">
                            <Joined class="w-full max-w-sm p-0 justify-center" />
                        </div>
                    </Match>
                </Switch>

                {/* CTA Button - Only show when not in fullscreen */}
                <Show when={flow() === 'step1' && !isFullScreen()}>
                    <div class="absolute bottom-4 left-4 right-4 z-20">
                        <button
                            class="w-full h-12 md:h-14 bg-white hover:bg-gray-100 text-black font-semibold rounded-full transition-all shadow-lg backdrop-blur-sm"
                            onClick={() => setFlow('email')}
                        >
                            <span class="text-sm md:text-base">Get Safe for Free</span>
                        </button>
                    </div>
                </Show>
            </div>
        </div>
    )
}

export default SecondLandingPage
