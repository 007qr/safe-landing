import ArrowForward from "../ui/icons/ArrowForward";

type BackgroundType = "img" | "video" | "color";

interface Props {
    src?: string;
    color?: string;
    backgroundType: BackgroundType;
    title: string;
    subTitle: string;
    nextButton?: boolean;
    nextButtonUrl?: string;
    onNextClick?: () => void;
}

export default function Card(props: Props) {
    return (
        <div class="max-lg:min-w-[362px] max-lg:min-h-[473px] max-lg:w-full max-lg:h-full min-w-[740px] min-h-[473px] w-[740px] h-[632px] relative">
            {/* Background */}
            <div
                class="rounded-[48px] absolute inset-0"
                style={props.color ? { background: props.color } : {}}
            >
                {props.backgroundType === "img" && props.src && (
                    <img
                        src={props.src}
                        alt="background"
                        class="object-cover rounded-[48px] w-full h-full"
                    />
                )}
                {props.backgroundType === "video" && props.src && (
                    <video
                        autoplay
                        muted
                        loop
                        class="object-cover rounded-[48px] w-full h-full"
                    >
                        <source src={props.src} type="video/mp4" />
                    </video>
                )}
            </div>

            {/* Text overlay */}
            <div class="absolute w-1/2 text-white left-[40px] top-[40px]">
                <h1 class="font-[600] leading-[110%] tracking-[-2%] text-[64px] max-lg:text-[40px]">
                    {props.title}
                </h1>
                <p class="text-[21px] leading-[130%] tracking-[0%] font-normal mt-[32px] max-lg:text-[17px]">
                    {props.subTitle}
                </p>
            </div>

            {/* Next button */}
            {props.nextButton && (
                <div
                    class="absolute right-[40px] bottom-[40px] max-lg:hidden"
                    on:click={props.onNextClick}
                >
                    <div class="bg-white rounded-[64px] p-[32px] flex items-center justify-center">
                        <ArrowForward />
                    </div>
                </div>
            )}
        </div>
    );
}
