import { createResource, createSignal, For, Setter, Show } from "solid-js";
import { Motion, Presence } from "solid-motionone";
import DescriptorField from "./descriptor-field";
import LeftArrow from "../icons/LeftArrow";
import AddBulkDescriptor from "./AddBulkDescriptor";
import { listDescriptors, updateDescriptor } from "../../lib/descriptorApi";
import ThreeDots from "../icons/ThreeDots";
import LoadingIcon from "../icons/Loading";
import RadarAnimation from "../effects/radar";

export type DescriptorFlow =
    | "first"
    | "second"
    | "third"
    | "fourth"
    | "add_bulk"
    | "default"
    | "list_descriptors";

export default function P2() {
    const [isRegistered, setIsRegistered] = createSignal(false);
    const text1 = "Here’s how it works —";
    const text2 =
        "We monitor the name your customers see on their bank statements. Then, we intercept any disputes before they hurt you.";

    const [flow, setFlow] = createSignal<DescriptorFlow>("first");

    function goBack() {
        setFlow((prev) => {
            if (prev === "third") return "second";
            if (prev === "second") return "first";
            if (prev === "fourth" && !isRegistered()) return "third";
            if (prev === "fourth" && isRegistered()) return "list_descriptors"
            if (prev === "list_descriptors") return "default";
            return "first"; // already at start
        });
    }

    return (
        <>
            <div
                class={`${
                    flow() === "add_bulk" ? "p-[16px]" : ""
                } w-[364px] h-[364px] bg-white rounded-[24px] border border-[#1D1D1F14] flex flex-col relative`}
                style="box-shadow: 0px 4px 2px 0px rgba(0, 0, 0, 0.02);"
            >
                <Show when={flow() !== "add_bulk"}>
                    <div class="rounded-[24px]">
                        <Motion.div
                            animate={{
                                height:
                                    flow() === "first" ||
                                    flow() === "default" ||
                                    flow() === "list_descriptors"
                                        ? "364px"
                                        : flow() === "second" ||
                                          flow() === "fourth"
                                        ? "288px"
                                        : "124px",
                                background:
                                    flow() === "list_descriptors" ||
                                    flow() === "default"
                                        ? "#ffffff"
                                        : flow() === "first"
                                        ? "radial-gradient(50% 50% at 50% 50%, #F7E1B7 0%, #FFFFFF 100%)"
                                        : "linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)",
                            }}
                            class={`${
                                flow() !== "first" &&
                                flow() !== "default" &&
                                flow() !== "list_descriptors"
                                    ? "rounded-t-[24px]"
                                    : "rounded-[24px]"
                            } ${
                                flow() === "first" || flow() === "default"
                                    ? "items-center justify-center"
                                    : ""
                            } 
                            ${
                                flow() === "fourth"
                                    ? "items-center justify-between"
                                    : ""
                            }
                        relative p-[16px] w-full flex flex-col gap-[16px]`}
                            style="background: linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%);"
                        >
                            <Show when={flow() === "first"}>
                                <h1
                                    class="w-[222px] text-center font-bold text-[33px] leading-[110%] tracking-[0%] text-[rgba(0,0,0,0.6)] "
                                    style="backdrop-filter: blur(48px)"
                                >
                                    Prevent Chargebacks with AI
                                </h1>
                            </Show>

                            <Show when={flow() === "default"}>
                                <RadarAnimation />
                            </Show>
                            <Show
                                when={
                                    flow() !== "first" &&
                                    flow() != "fourth" &&
                                    flow() !== "default"
                                }
                            >
                                <div class="flex justify-between items-center">
                                    <Show when={flow() !== "fourth"}>
                                        <button
                                            on:click={() => goBack()}
                                            class="self-start cursor-pointer"
                                        >
                                            <LeftArrow />
                                        </button>
                                    </Show>
                                    <Show when={flow() === "list_descriptors"}>
                                        <h2 class="self-center font-medium text-[17px] leading-[130%] tracking-[0%] font-inter">
                                            Descriptors
                                        </h2>
                                        <div class="w-[24px]"></div>
                                    </Show>
                                    <Show when={flow() == "second"}>
                                        <button class="font-inter text-[13px] font-medium text-[#494949] self-end">
                                            Skip
                                        </button>
                                    </Show>
                                </div>
                            </Show>
                            <Show when={flow() === "third"}>
                                <div class="absolute top-1/2 left-1/2 -translate-1/2">
                                    <DescriptorText name="NETFLIX.COM" />
                                </div>
                            </Show>

                            <Show when={flow() === "second"}>
                                <div class="flex flex-col gap-[16px]">
                                    <span>
                                        <For each={text1.split(" ")}>
                                            {(el, index) => {
                                                const isBold =
                                                    el === "how" ||
                                                    el === "it" ||
                                                    el === "works" ||
                                                    el === "—";
                                                return (
                                                    <>
                                                        <span
                                                            style={{
                                                                "animation-delay": `${
                                                                    300 +
                                                                    index() *
                                                                        150
                                                                }ms`,

                                                                "font-weight": `${
                                                                    isBold
                                                                        ? "500"
                                                                        : ""
                                                                }`,
                                                            }}
                                                            class="animate-fade-in whitespace-pre text-[15px] leading-[150%] tracking-[0] text-[#1d1df] font-inter   "
                                                        >
                                                            {el}
                                                        </span>
                                                        <span> </span>
                                                    </>
                                                );
                                            }}
                                        </For>
                                    </span>
                                    <span>
                                        <For each={text2.split(" ")}>
                                            {(el, index) => {
                                                const isBold =
                                                    el === "monitor" ||
                                                    el === "intercept";

                                                return (
                                                    <>
                                                        <span
                                                            style={{
                                                                "animation-delay": `${
                                                                    800 +
                                                                    index() *
                                                                        150
                                                                }ms`,

                                                                "font-weight": `${
                                                                    isBold
                                                                        ? "500"
                                                                        : ""
                                                                }`,
                                                            }}
                                                            class="animate-fade-in whitespace-pre text-[15px] leading-[150%] tracking-[0] text-[#1d1df] font-inter   "
                                                        >
                                                            {el}
                                                        </span>
                                                        <span> </span>
                                                    </>
                                                );
                                            }}
                                        </For>
                                    </span>
                                </div>
                            </Show>

                            <Show when={flow() === "fourth"}>
                                <h3 class="mt-[35px] text-[21px] font-medium leading-[130%] tracking-[0%] text-[#1D1D1F] font-inter text-center">
                                    You’re all set!
                                </h3>
                                <p class="text-center font-inter text-[13px] leading-[130%] tracking-[0%] pb-[7px]">
                                    Your Payment Descriptors are added. We’ll
                                    let you know if anything else is needed.
                                </p>
                            </Show>

                            <Show when={flow() === "list_descriptors"}>
                                <DescriptorList setFlow={setFlow} />
                            </Show>
                        </Motion.div>
                        <Show when={flow() === "third"}>
                            <div class="flex flex-col p-[16px] gap-[16px]">
                                <div class="flex justify-between w-full">
                                    <p class="text-[15px] font-inter font-medium text-[#1d1d1f]">
                                        Add Descriptor
                                    </p>
                                    <p
                                        class="text-[13px] font-inter font-medium text-[#1d1d1f] cursor-pointer"
                                        on:click={(e) => setFlow("add_bulk")}
                                    >
                                        + Add bulk
                                    </p>
                                </div>
                                <DescriptorField />
                            </div>
                        </Show>
                    </div>

                    <Show
                        when={
                            flow() !== "first" &&
                            flow() !== "default" &&
                            flow() != "list_descriptors"
                        }
                    >
                        <button
                            class="cursor-pointer absolute w-[332px] outline-none bottom-[16px] mx-[16px] text-[13px] bg-[#ececec] rounded-[12px] p-[12px] leading-[110%] tracking-[-2%] font-medium font-inter"
                            on:click={(e) => {
                                if (flow() === "second")
                                    return setFlow("third");
                                if (flow() === "third")
                                    return setFlow("fourth");
                                if (flow() === "fourth")
                                    setIsRegistered(true);
                                    return setFlow("default");

                            }}
                        >
                            {flow() === "second"
                                ? "Continue"
                                : flow() === "third"
                                ? "Finish Setup"
                                : "Done"}
                        </button>
                    </Show>

                    <Show when={flow() === "first"}>
                        <div class="absolute flex justify-end max-w-[374px] w-full mt-auto z-10 bottom-[16px] right-[16px]">
                            <button
                                on:click={() => setFlow("second")}
                                class="bg-black cursor-pointer  w-[56px] h-[56px] flex items-center justify-center rounded-full mt-auto self-end"
                            >
                                <img
                                    src="/arrow-right.svg"
                                    alt=""
                                    class="w-[24px] h-[24px]"
                                />
                            </button>
                        </div>
                    </Show>
                </Show>

                <Show when={flow() === "default"}>
                    <span
                        on:click={() => {
                            setFlow("list_descriptors");
                        }}
                        class="cursor-pointer rounded-[64px] absolute w-[36px] h-[36px] bg-white flex items-center justify-center top-[16px] right-[16px]"
                        style="box-shadow: 0px 4px 32px 0px rgba(29, 29, 31, 0.12);"
                    >
                        <ReceiptIcon />
                    </span>
                </Show>

                <Presence exitBeforeEnter>
                    <Show when={flow() === "add_bulk"}>
                        <Motion.div
                            class="w-full h-full"
                            animate={{
                                opacity: [0, 1],
                                transition: {
                                    duration: 0.3,
                                    easing: "ease-in-out",
                                },
                            }}
                        >
                            <AddBulkDescriptor flow={flow} setFlow={setFlow} isRegistered={isRegistered} />
                        </Motion.div>
                    </Show>
                </Presence>
            </div>
        </>
    );
}

function DescriptorText({ name }: { name: string }) {
    return (
        <>
            <div
                class="w-max mx-auto flex justify-center items-center gap-[4px] font-inter text-[13px] font-mediumleading-[130%] tracking-[0%] p-[4px] rounded-[64px] bg-white"
                style="box-shadow: 0px 4px 32px 0px rgba(29, 29, 31, 0.12);"
            >
                <div class="flex gap-[4px] px-[7px]">
                    <ReceiptIcon />
                    {name}
                </div>
            </div>
        </>
    );
}

function DescriptorList({ setFlow }: { setFlow: Setter<DescriptorFlow> }) {
    const merchant_id = "415439";

    const [data] = createResource(
        () => merchant_id,
        (id) => listDescriptors({ merchant_id: id })
    );
    return (
        <>
            <div class="pt-[16px] h-[330px] overflow-y-auto custom-scrollbar">
                <div
                    class="flex flex-col gap-[4px] "
                    classList={{
                        "items-center justify-center h-full": data.loading,
                    }}
                >
                    <Show
                        when={!data.loading}
                        fallback={<LoadingIcon isLoading={true} />}
                    >
                        <For each={data()}>
                            {(item) => (
                                <>
                                    <DescriptorRow
                                        descriptor_name={
                                            item.payment_descriptor
                                        }
                                        contact={
                                            item.payment_descriptor_contact
                                        }
                                        status={
                                            item.status === "ENABLED"
                                                ? true
                                                : false
                                        }
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
                    on:click={() => setFlow("add_bulk")}
                    class="w-max bg-[#F5F5F5] mt-[16px] cursor-pointer p-[4px] rounded-[24px] font-inter leading-[130%] tracking-[0%] text-[13px] font-medium"
                >
                    + Add bulk
                </button>
            </footer>
        </>
    );
}

function DescriptorRow({
    contact,
    descriptor_name,
    merchant_id,
    descriptor_id,
    status,
}: {
    contact: string;
    descriptor_name: string;
    status: boolean;
    merchant_id: string;
    descriptor_id: string;
}) {
    const [checked, setChecked] = createSignal<boolean>(status);

    const handleChecked = (
        e: Event & {
            currentTarget: HTMLInputElement;
            target: HTMLInputElement;
        }
    ) => {
        setChecked((v) => !v);
        updateDescriptor({
            status: e.target.checked ? "ENABLED" : "DISABLED",
            partner_merchant_id: merchant_id,
            partner_descriptor_id: descriptor_id,
        });
    };

    return (
        <>
            <div class="hover:bg-[#F5F5F5] p-[8px] rounded-[12px] leading-[130%] tracking-[0%] flex justify-between">
                <div class="flex gap-[8px] items-center">
                    <ReceiptLight />
                    <div>
                        <h5 class="font-inter text-[#1D1D1F] text-[13px] font-medium text-ellipsis overflow-hidden whitespace-nowrap w-[192px]">
                            {descriptor_name}
                        </h5>
                        <p class="text-[#494949] text-[13px] font-normal font-inter">
                            {contact}
                        </p>
                    </div>
                </div>
                <div class="flex gap-[8px] items-center">
                    <div class="w-[36px] h-[36px] border border-[#1D1D1F14] flex items-center justify-center rounded-[48px] rotate-90">
                        <ThreeDots />
                    </div>

                    <div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                value=""
                                checked={checked()}
                                onChange={handleChecked}
                                class="sr-only peer"
                            />
                            <div class="w-[36px] h-[20.25px] bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-[#0B9925] transition-colors"></div>
                            <div class="absolute translate-x-[15%] -translate-y-[52%] top-[50%] bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-[110%]"></div>
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
}

function ReceiptLight() {
    return (
        <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M19.9062 11.375C19.9062 11.549 19.8371 11.716 19.714 11.839C19.591 11.9621 19.424 12.0312 19.25 12.0312H8.75C8.57595 12.0312 8.40903 11.9621 8.28596 11.839C8.16289 11.716 8.09375 11.549 8.09375 11.375C8.09375 11.201 8.16289 11.034 8.28596 10.911C8.40903 10.7879 8.57595 10.7188 8.75 10.7188H19.25C19.424 10.7188 19.591 10.7879 19.714 10.911C19.8371 11.034 19.9062 11.201 19.9062 11.375ZM19.25 14.2188H8.75C8.57595 14.2188 8.40903 14.2879 8.28596 14.411C8.16289 14.534 8.09375 14.701 8.09375 14.875C8.09375 15.049 8.16289 15.216 8.28596 15.339C8.40903 15.4621 8.57595 15.5312 8.75 15.5312H19.25C19.424 15.5312 19.591 15.4621 19.714 15.339C19.8371 15.216 19.9062 15.049 19.9062 14.875C19.9062 14.701 19.8371 14.534 19.714 14.411C19.591 14.2879 19.424 14.2188 19.25 14.2188ZM25.1562 6.125V22.75C25.1561 22.8618 25.1274 22.9718 25.0729 23.0694C25.0183 23.167 24.9397 23.2491 24.8445 23.3078C24.7412 23.3723 24.6218 23.4064 24.5 23.4062C24.3983 23.4063 24.2979 23.3827 24.2069 23.3373L21 21.7339L17.7931 23.3373C17.7021 23.3828 17.6017 23.4064 17.5 23.4064C17.3983 23.4064 17.2979 23.3828 17.2069 23.3373L14 21.7339L10.7931 23.3373C10.7021 23.3828 10.6017 23.4064 10.5 23.4064C10.3983 23.4064 10.2979 23.3828 10.2069 23.3373L7 21.7339L3.79313 23.3373C3.69306 23.3873 3.58188 23.4109 3.47015 23.4058C3.35842 23.4007 3.24985 23.3671 3.15473 23.3083C3.05962 23.2494 2.98112 23.1673 2.9267 23.0695C2.87227 22.9718 2.84372 22.8618 2.84375 22.75V6.125C2.84375 5.71889 3.00508 5.32941 3.29224 5.04224C3.57941 4.75508 3.96889 4.59375 4.375 4.59375H23.625C24.0311 4.59375 24.4206 4.75508 24.7078 5.04224C24.9949 5.32941 25.1562 5.71889 25.1562 6.125ZM23.8438 6.125C23.8438 6.06698 23.8207 6.01134 23.7797 5.97032C23.7387 5.9293 23.683 5.90625 23.625 5.90625H4.375C4.31698 5.90625 4.26134 5.9293 4.22032 5.97032C4.1793 6.01134 4.15625 6.06698 4.15625 6.125V21.688L6.70687 20.4127C6.79791 20.3672 6.89826 20.3436 7 20.3436C7.10174 20.3436 7.20209 20.3672 7.29313 20.4127L10.5 22.0161L13.7069 20.4127C13.7979 20.3672 13.8983 20.3436 14 20.3436C14.1017 20.3436 14.2021 20.3672 14.2931 20.4127L17.5 22.0161L20.7069 20.4127C20.7979 20.3672 20.8983 20.3436 21 20.3436C21.1017 20.3436 21.2021 20.3672 21.2931 20.4127L23.8438 21.688V6.125Z"
                fill="black"
            />
        </svg>
    );
}

function ReceiptIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M10.0002 18.266C9.76638 18.2667 9.53741 18.1995 9.34102 18.0727L8.03768 17.2218C7.98323 17.1884 7.92143 17.1688 7.85766 17.1647C7.7939 17.1606 7.73011 17.1722 7.67185 17.1985L6.19185 17.8893C6.00674 17.9754 5.80306 18.0139 5.59931 18.0012C5.39556 17.9885 5.19821 17.9252 5.02518 17.8168C4.87898 17.7279 4.75782 17.6032 4.67312 17.4545C4.58842 17.3058 4.54295 17.1379 4.54102 16.9668V3.03432C4.54385 2.86298 4.58996 2.69513 4.67504 2.54638C4.76013 2.39763 4.88143 2.2728 5.02768 2.18349C5.20071 2.07515 5.39806 2.01177 5.60181 1.99911C5.80556 1.98644 6.00924 2.0249 6.19435 2.11099L7.67352 2.80182C7.73164 2.82831 7.79536 2.84019 7.85912 2.83641C7.92289 2.83264 7.98476 2.81332 8.03935 2.78015L9.34185 1.92765C9.53827 1.80115 9.76697 1.73389 10.0006 1.73389C10.2342 1.73389 10.4629 1.80115 10.6593 1.92765L11.9627 2.77932C12.0174 2.81263 12.0794 2.83202 12.1433 2.8358C12.2072 2.83958 12.2711 2.82762 12.3293 2.80099L13.8085 2.11015C13.9934 2.02332 14.1972 1.98445 14.4011 1.99712C14.605 2.00979 14.8024 2.07359 14.9752 2.18265C15.121 2.27226 15.2418 2.39723 15.3264 2.54596C15.4111 2.69469 15.4568 2.86238 15.4593 3.03349V16.9668C15.4566 17.1378 15.4108 17.3053 15.3262 17.4539C15.2416 17.6025 15.1209 17.7273 14.9752 17.8168C14.8024 17.9259 14.605 17.9897 14.4011 18.0024C14.1972 18.015 13.9934 17.9762 13.8085 17.8893L12.3335 17.1993C12.2751 17.1727 12.211 17.1608 12.147 17.1647C12.0829 17.1686 12.0207 17.1882 11.966 17.2218L10.6627 18.0727C10.4653 18.2001 10.2351 18.2673 10.0002 18.266ZM7.83352 16.3335C8.06727 16.333 8.29608 16.4008 8.49185 16.5285L9.79518 17.3785C9.85605 17.4165 9.92635 17.4366 9.9981 17.4366C10.0698 17.4366 10.1401 17.4165 10.201 17.3785L11.5052 16.5277C11.6783 16.4161 11.877 16.3503 12.0825 16.3364C12.288 16.3226 12.4936 16.3611 12.6802 16.4485L14.1585 17.1385C14.2161 17.1657 14.2795 17.1781 14.3431 17.1746C14.4067 17.1711 14.4684 17.1518 14.5227 17.1185C14.5502 17.1042 14.5737 17.0832 14.5909 17.0574C14.6081 17.0316 14.6184 17.0019 14.621 16.971V3.03432C14.6184 3.00342 14.6081 2.97369 14.5909 2.94789C14.5737 2.9221 14.5502 2.90109 14.5227 2.88682C14.4685 2.85337 14.4068 2.83395 14.3432 2.83031C14.2797 2.82667 14.2162 2.83893 14.1585 2.86599L12.6793 3.55682C12.4929 3.64401 12.2874 3.68249 12.0821 3.66864C11.8767 3.6548 11.6782 3.58908 11.5052 3.47765L10.2027 2.62599C10.1416 2.58908 10.0716 2.56958 10.0002 2.56958C9.9288 2.56958 9.85878 2.58908 9.79768 2.62599L8.49352 3.47682C8.32044 3.58833 8.12206 3.65442 7.91669 3.66899C7.71132 3.68355 7.50559 3.64612 7.31852 3.56015L5.83935 2.86599C5.78169 2.83893 5.71821 2.82667 5.65463 2.83031C5.59105 2.83395 5.52938 2.85337 5.47518 2.88682C5.44766 2.90109 5.4242 2.9221 5.407 2.94789C5.38981 2.97369 5.37943 3.00342 5.37685 3.03432V16.9668C5.37943 16.9977 5.38981 17.0275 5.407 17.0532C5.4242 17.079 5.44766 17.1001 5.47518 17.1143C5.52971 17.1469 5.59135 17.1658 5.6548 17.1693C5.71824 17.1728 5.78158 17.1608 5.83935 17.1343L7.31935 16.4435C7.481 16.3708 7.65627 16.3333 7.83352 16.3335Z"
                fill="black"
            />
            <path
                d="M12.5383 6.16683H7.46159C7.35108 6.16683 7.2451 6.12293 7.16696 6.04479C7.08882 5.96665 7.04492 5.86067 7.04492 5.75016C7.04492 5.63966 7.08882 5.53368 7.16696 5.45554C7.2451 5.37739 7.35108 5.3335 7.46159 5.3335H12.5383C12.6488 5.3335 12.7547 5.37739 12.8329 5.45554C12.911 5.53368 12.9549 5.63966 12.9549 5.75016C12.9549 5.86067 12.911 5.96665 12.8329 6.04479C12.7547 6.12293 12.6488 6.16683 12.5383 6.16683ZM12.5383 9.12766H7.46159C7.35108 9.12766 7.2451 9.08376 7.16696 9.00562C7.08882 8.92748 7.04492 8.8215 7.04492 8.711C7.04492 8.60049 7.08882 8.49451 7.16696 8.41637C7.2451 8.33823 7.35108 8.29433 7.46159 8.29433H12.5383C12.6488 8.29433 12.7547 8.33823 12.8329 8.41637C12.911 8.49451 12.9549 8.60049 12.9549 8.711C12.9549 8.8215 12.911 8.92748 12.8329 9.00562C12.7547 9.08376 12.6488 9.12766 12.5383 9.12766ZM9.99992 12.0835H7.46159C7.35108 12.0835 7.2451 12.0396 7.16696 11.9615C7.08882 11.8833 7.04492 11.7773 7.04492 11.6668C7.04492 11.5563 7.08882 11.4503 7.16696 11.3722C7.2451 11.2941 7.35108 11.2502 7.46159 11.2502H9.99992C10.1104 11.2502 10.2164 11.2941 10.2945 11.3722C10.3727 11.4503 10.4166 11.5563 10.4166 11.6668C10.4166 11.7773 10.3727 11.8833 10.2945 11.9615C10.2164 12.0396 10.1104 12.0835 9.99992 12.0835Z"
                fill="black"
            />
        </svg>
    );
}
