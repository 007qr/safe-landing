import {
    Accessor,
    createResource,
    createSignal,
    For,
    Setter,
    Show,
} from "solid-js";
import LeftArrow from "../icons/LeftArrow";
import ThreeDots from "../icons/ThreeDots";
import { DescriptorFlow } from "./p2";
import AddBulkDescriptor from "./AddBulkDescriptor";
import { Motion, Presence } from "solid-motionone";
import { listDescriptors, updateDescriptor } from "../../lib/descriptorApi";
import LoadingIcon from "../icons/Loading";

interface Props {
    setFlow: Setter<DescriptorFlow>;
    flow: Accessor<string>;
}

export default function P3({ setFlow, flow }: Props) {
    const merchant_id = "415439";

    const [data] = createResource(
        () => merchant_id,
        (id) => listDescriptors({ merchant_id: id })
    );

    return (
        <>
            <div
                class="w-[364px] h-[364px] bg-white p-[16px] rounded-[24px] border border-[#1D1D1F14] flex flex-col relative"
                style="box-shadow: 0px 4px 2px 0px rgba(0, 0, 0, 0.02);"
            >
                <Show when={flow() === "list_descriptors"}>
                    <header class="flex justify-between items-center">
                        <button class="self-start cursor-pointer w-[24px] h-[24px] bg-[#f5f5f5] rounded-[48px] items-center justify-center flex">
                            <LeftArrow />
                        </button>
                        <h2 class="font-medium text-[17px] leading-[130%] tracking-[0%] font-inter">
                            Descriptors
                        </h2>
                        <div class="w-[24px]"></div>
                    </header>

                    <div class="pt-[16px] h-[330px] overflow-y-auto custom-scrollbar">
                        <div
                            class="flex flex-col gap-[4px] "
                            classList={{
                                "items-center justify-center h-full":
                                    data.loading,
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
                                                merchant_id={
                                                    item.partner_merchant_id
                                                }
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
                            <AddBulkDescriptor flow={flow} setFlow={setFlow} />
                        </Motion.div>
                    </Show>
                </Presence>
            </div>
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
