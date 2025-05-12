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
