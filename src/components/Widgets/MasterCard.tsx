import MasterCardLogo from "~/ui/icons/MasterCardLogo";

export default function MasterCard({number}:{number: number}) {
    return (
        <div class="shrink-0 flex gap-[10px]">
            <div class="w-[32px] h-[32px] rounded-[4px] border border-[#1D1D1F14] flex items-center justify-center overflow-hidden relative">
                <span class="absolute inset-0 flex items-center justify-center animate-mastercard-logo">
                    <MasterCardLogo width="26" height="15.2" />
                </span>
                <span class="absolute inset-0 flex items-center justify-center font-inter text-[11px] leading-[130%] tracking-[0%] text-[#494949] animate-mastercard-text">
                    {number}
                </span>
            </div>
        </div>
    );
}
