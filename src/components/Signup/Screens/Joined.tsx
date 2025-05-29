import { Component, createSignal, Show } from 'solid-js'

import detectDevice from '~/lib/device'
import Tracker from '~/lib/tracker'
import PlayStore from '~/ui/icons/PlayStore'
import AppStore from '~/ui/icons/AppStore'
import { BaseAppURLs } from './Screens.types'
import { cn } from '~/lib/utils'
import QRCodeCanvas from '~/components/Widgets/FirstLandingPage/QRCode'

interface Props {
    class?: string
}

const Joined: Component<Props> = (props) => {
    const [device, setDevice] = createSignal<ReturnType<typeof detectDevice>>(detectDevice())

    const params = {
        campaign_id: '',
        utm_medium: '',
        utm_source: '',
        adset_id: '',
        ad_id: '',
        ...Tracker.getUTMParams(),
    }

    return (
        <div
            class={cn(
                'flex flex-col h-full w-full -mt-[16px] bg-white p-[70px] max-md:p-[20px] items-center justify-center',
                props.class
            )}
        >
            <div class="flex flex-col gap-[16px] font-inter items-center">
                <h4 class="text-[23px] font-medium">Get the Safe App Business</h4>
                <h4 class="text-[15px] hidden max-md:block">Check it out in the app store</h4>
                <p class="font-inter text-[13px] max-md:hidden">Scan this QR code to download the app now</p>

                <div class="w-[150px] h-[150px] bg-black/50 max-md:hidden">
                    <Show
                        when={device() === 'Android'}
                        fallback={<QRCodeCanvas text={`${BaseAppURLs.IOS}&ct=${params.campaign_id}&mt=8`} />}
                    >
                        <QRCodeCanvas
                            text={`${BaseAppURLs.Android}&campaignid=${params.campaign_id}&utm_medium=${params.utm_medium}&utm_source=${params.utm_source}&adset_id=${params.adset_id}&ad_id=${params.ad_id}`}
                        />
                    </Show>
                </div>

                <p class="text-[13px] max-md:hidden">Or check it out in the app stores</p>

                <div class="flex gap-[16px] flex-wrap w-max">
                    <Show when={device() === 'Android' || device() === ''}>
                        <AndroidButton params={params} />
                    </Show>
                    <Show when={device() === 'iOS' || device() === ''}>
                        <IOSButton params={params} />
                    </Show>
                </div>
            </div>
        </div>
    )
}

const AndroidButton = ({ params }: { params: ReturnType<typeof Tracker.getUTMParams> }) => {
    return (
        <a
            href={`${BaseAppURLs.Android}&campaignid=${params.campaign_id}&utm_medium=${params.utm_medium}&utm_source=${params.utm_source}&adset_id=${params.adset_id}&ad_id=${params.ad_id}`}
        >
            <PlayStore />
        </a>
    )
}

const IOSButton = ({ params }: { params: ReturnType<typeof Tracker.getUTMParams> }) => {
    return (
        <a href={`${BaseAppURLs.IOS}&ct=${params.campaign_id}&mt=8`}>
            <AppStore />
        </a>
    )
}

export default Joined
