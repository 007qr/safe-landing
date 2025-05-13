import { Accessor, createSignal, For, Setter } from "solid-js";
import { DescriptorFlow } from "./p2";
import LeftArrow from "../../ui/icons/LeftArrow";
import DescriptorField from "./DescriptorField";
import UploadIcon from "~/ui/icons/Upload";

interface Props {
    setFlow: Setter<DescriptorFlow>;
    flow: Accessor<string>;
    isRegistered: Accessor<boolean>
}

export default function AddBulkDescriptor({ setFlow, flow, isRegistered }: Props) {
    const [fields, setFields] = createSignal<number[]>([0]);
    return (
        <>
            <div class="flex flex-col justify-between h-full">
                <div class="flex flex-col gap-[16px] flex-1 min-h-0">
                    <div class="flex justify-between">
                        <button
                            on:click={() => {
                                console.log(isRegistered());
                                if (isRegistered()) return setFlow("list_descriptors");
                                setFlow("third");
                            }}
                            class="cursor-pointer"
                        >
                            <LeftArrow />
                        </button>
                        <h4 class="font-inter font-medium leading-[130%] tracking-[0%] text-[#1d1d1f]">
                            Add Descriptor
                        </h4>
                        <button class="w-[24px] h-[24px] flex items-center justify-center bg-[#F5F5F5] rounded-[24px]">
                            <UploadIcon />
                        </button>
                    </div>
                    <div class="flex flex-col gap-[30px] overflow-y-auto flex-1 min-h-0 pr-[4px] custom-scrollbar">
                        <For each={fields()}>
                            {(id) => <DescriptorField />}
                        </For>
                    </div>
                </div>

                <button
                    onClick={() => setFields([...fields(), fields().length])}
                    class="cursor-pointer mt-[12px] self-start font-inter font-medium leading-[130%] tracking-[0%] text-[#1d1d1f] text-[13px]">
                    + Add More
                </button>
            </div>
        </>
    );
}

