import { createSignal, JSX, Show } from "solid-js";
import ArrowForward from "../ui/icons/ArrowForward";

interface TestimonialCardProps {
  videoSrc: string;
  imgSrc: string;
  text: () => JSX.Element;
  personName: string;
  companyName: string;
  personProfileUrl?: string;
  onNextClick?: () => void;
}

export default function TestimonialCard({
  videoSrc,
  imgSrc,
  text,
  companyName,
  personName,
  personProfileUrl,
  onNextClick,
}: TestimonialCardProps) {
  const [videoOpen, setVideoOpen] = createSignal<boolean>(false);

  const toggleVideo = () => setVideoOpen(!videoOpen());

  return (
    <div class="overflow-hidden bg-white relative max-lg:min-w-[362px] max-lg:min-h-[583px] max-lg:w-full max-lg:h-full min-w-[740px] min-h-[473px] w-[740px] h-[632px] rounded-[48px] p-[32px]">
      {/* Author and Company Information */}
      <div class="absolute flex gap-[8px] items-center z-10">
        <Show
          when={personProfileUrl}
          fallback={
            <div class="w-[36px] h-[36px] rounded-full bg-black max-lg:bg-[#d9d9d9]"></div>
          }
        >
          <img
            src={personProfileUrl}
            alt={`${personName} profile`}
            class="w-[36px] h-[36px] rounded-full object-cover"
          />
        </Show>
        <div class="flex flex-col gap-[2px]">
          <p class="text-[17px] leading-[170%] tracking-[-2%] font-medium align-middle max-lg:text-white">
            {personName}
          </p>
          <p class="text-[15px] leading-[120%] tracking-[-2%] align-middle max-lg:text-[#f5f5f5] opacity-60">
            {companyName}
          </p>
        </div>
      </div>

      {/* Desktop Layout */}
      <div class="flex gap-[73px] max-lg:hidden">
        <div class="flex flex-col gap-[20px] mt-auto">
          <div class="testimonial-content">{text()}</div>
          <button
            class="w-max py-[16px] px-[24px] gap-[10px] text-[17px] leading-[110%] tracking-[-2%] align-middle font-medium flex border-[#1d1d1f] rounded-[64px] items-center"
            onClick={toggleVideo}
          >
            {/* <ArrowForward size={24} />
            Play Video */}
          </button>
        </div>

        <Show
          when={!videoOpen()}
          fallback={
            <></>
            // <video
            //   class="flex-shrink-0 w-[327px] h-[472px] rounded-[184px] object-cover"
            //   autoplay
            // >
            //   <source src={videoSrc} type="video/webm" />
            // </video>
          }
        >
          <img
            class="flex-shrink-0 w-[327px] h-[472px] rounded-[184px] object-cover"
            src={imgSrc}
            alt="Testimonial preview"
          />
        </Show>
      </div>

      {/* Mobile Layout */}
      <div class="inset-0 absolute lg:hidden">
        <Show
          when={!videoOpen()}
          fallback={
            <></>
            // <video class="w-full h-full object-cover" autoplay>
            //   <source src={videoSrc} type="video/webm" />
            // </video>
          }
        >
          <img
            class="w-full h-full object-cover"
            src={imgSrc}
            alt="Testimonial preview"
          />
        </Show>
      </div>

      {/* Mobile Content Overlay */}
      <div class="absolute bottom-[46px] flex gap-[20px] flex-col z-20 lg:hidden">
        <div class="testimonial-content">{text()}</div>
        {/* <button
          class="w-max border py-[11px] px-[20px] gap-[10px] text-[17px] leading-[110%] tracking-[-2%] align-middle font-medium flex text-[#f5f5f5] border-[#f5f5f5] rounded-[64px] items-center"
          onClick={toggleVideo}
        >
          <ArrowForward color="#f5f5f5" size={24} />
          Play Video
        </button> */}
      </div>

      {/* Mobile Gradient Overlays */}
      <div class="absolute inset-0 lg:hidden w-full h-full z-[1]" style="background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 20%, rgba(29, 29, 31, 0.12) 62.5%)" />
      <div class="absolute inset-0 lg:hidden w-full h-full z-[1]" style="background: linear-gradient(180deg, rgba(29, 29, 31, 0.12) 48.56%, rgba(0, 0, 0, 0.3) 78.37%);" />

      {/* Next Button (Desktop only) */}
      <div
        class="absolute right-[20px] bottom-[20px] shadow-lg bg-white rounded-[64px] max-lg:hidden cursor-pointer"
        onClick={onNextClick}
      >
        <div class="p-[32px] flex items-center justify-center">
          <ArrowForward />
        </div>
      </div>
    </div>
  );
}
