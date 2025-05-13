import { createSignal, Show } from 'solid-js'

import QRCodeCanvas from '~/components/Widgets/QRCode'

import detectDevice from '~/lib/device'
import Tracker from '~/lib/tracker'
import PlayStore from '~/ui/icons/PlayStore'
import AppStore from '~/ui/icons/AppStore'

export default function Joined() {
    const [device, setDevice] = createSignal<ReturnType<typeof detectDevice>>(detectDevice())
    
    const params = Tracker.getUTMParams()

    return (
        <div class="flex flex-col h-full w-full -mt-[16px] bg-white p-[70px] max-md:p-[20px] items-center justify-center">
            <div class="flex flex-col gap-[16px] font-inter items-center">
                <h4 class="text-[23px] font-medium">Get the Safe App Business</h4>
                <h4 class="text-[15px] hidden max-md:block">Check it out in the app store</h4>
                <p class="font-inter text-[13px] max-md:hidden">Scan this QR code to download the app now</p>

                <div class="w-[150px] h-[150px] bg-black/50 max-md:hidden">
                    <Show
                        when={device() === 'Android'}
                        fallback={
                            <QRCodeCanvas
                                text={`https://apps.apple.com/app/apple-store/id6478123958?pt=126182323&ct=${params.campaign_id}&mt=8`}
                            />
                        }
                    >
                        <QRCodeCanvas
                            text={`https://play.google.com/store/apps/details?id=com.safeapp.android&campaignid=${params.campaign_id}&utm_medium=${params.utm_medium}&utm_source=${params.utm_source}&adset_id=${params.adset_id}&ad_id=${params.ad_id}`}
                        />
                    </Show>
                </div>

                <p class="text-[13px] max-md:hidden">Or check it out in the app stores</p>

                <div class="flex gap-[16px] flex-wrap w-max">
                    <Show when={device() === 'Android' || device() === ''}>
                        <a
                            href={`https://play.google.com/store/apps/details?id=com.safeapp.android&campaignid=${params.campaign_id}&utm_medium=${params.utm_medium}&utm_source=${params.utm_source}&adset_id=${params.adset_id}&ad_id=${params.ad_id}`}
                        >
                            <PlayStore />
                        </a>
                    </Show>
                    <Show when={device() === 'iOS' || device() === ''}>
                        <a
                            href={`https://apps.apple.com/app/apple-store/id6478123958?pt=126182323&ct=${params.campaign_id}&mt=8`}
                        >
                            <AppStore />
                        </a>
                    </Show>
                </div>
            </div>
        </div>
    )
}
