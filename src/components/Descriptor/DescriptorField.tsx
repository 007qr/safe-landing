import { createSignal, Show } from "solid-js";
import { createDescriptor } from "../../lib/descriptorApi";
import EditIcon from "~/ui/icons/Edit";
import SuccessIcon from "~/ui/icons/Success";
import LoadingLightIcon from "~/ui/icons/LoadingLight";
import ArrowRight from "~/ui/icons/ArrowRight";

export default function DescriptorField(props: { id?: string } = {}) {
    const [descriptor, setDescriptor] = createSignal<string>("");
    const [contact, setContact] = createSignal<string>("");
    const [isEditingContact, setIsEditingContact] = createSignal(false);
    const [showDescriptorLabel, setShowDescriptorLabel] = createSignal(true);
    const [error, setError] = createSignal<string>("");
    const [buttonState, setButtonState] = createSignal<"next"|"loading"|"success">("next");
    const [isCompleted, setIsCompleted] = createSignal(false);

    let descriptorRef: HTMLDivElement | undefined;

    const triggerAnimation = (direction: "up" | "reverse") => {
        if (!descriptorRef) return;

        descriptorRef.classList.remove(
            "animate-move-up",
            "animate-move-up-reverse"
        );
        void descriptorRef.offsetWidth; // force reflow

        if (direction === "up") {
            descriptorRef.classList.add("animate-move-up");
        } else {
            descriptorRef.classList.add("animate-move-up-reverse");
        }
    };

    const handleNextButton = async () => {
        // Prevent actions if the form is completed
        if (isCompleted()) return;

        if (isEditingContact()) {
            // user has submitted the contact details
            // verify the contact is not empty and descriptor is not empty
            setError(""); // Clear previous errors

            if (contact() !== "" && descriptor() !== "") {
                try {
                    setButtonState("loading");

                    const res = await createDescriptor({
                        payment_descriptor: descriptor(),
                        payment_descriptor_contact: contact()
                    });
                    const jsonRes = await res.json();

                    if (jsonRes.code === 409) { // duplicate entry
                        // show error that you have duplicate descriptor contact
                        setError("This field is intended to uniquely identify your business");
                        setButtonState("next");
                    } else if (jsonRes.code === 202) {
                        // success state
                        setButtonState("success");
                        setIsCompleted(true);
                        // We don't reset the button state as we want to keep showing success
                    }
                } catch(e) {
                    console.error("Error creating descriptor: ", e);
                    setError("Failed to create descriptor. Please try again.");
                    setButtonState("next");
                }
            } else {
                setError("Both descriptor and contact are required");
                setButtonState("next");
            }
        } else {
            triggerAnimation("up");
            setIsEditingContact(true);
            setButtonState("next");
            setTimeout(() => setShowDescriptorLabel(false), 300);
        }
    };

    return (
        <div class={`bg-[#F5F5F5] min-h-[54px] relative flex flex-col justify-center p-[8px] rounded-[16px] w-full max-w-[332px] h-[54px] tracking-[0%] leading-[130%] ${error() !== ""? "border border-red-500": ""}`}
            id={props.id}
            classList={{ 'opacity-80': isCompleted() }}>
            <div>
                <p
                    class={`text-[#6B6B6B] select-none text-[12px] font-inter absolute top-[8px] tracking-[0%] leading-[130%] transition-opacity duration-300`}
                    style={{
                        opacity: showDescriptorLabel() ? 1 : 0,
                        "pointer-events": "none",
                    }}
                >
                    {isCompleted() ? "Descriptor Created" : "Enter Descriptor"}
                </p>
                <div
                    class="flex absolute top-[26px] z-10 bg-[#f5f5f5]"
                    ref={descriptorRef}
                >
                    <input
                        disabled={isEditingContact() || isCompleted()}
                        onInput={(e) => {
                            if (!isCompleted()) setDescriptor(e.target.value ?? "");
                        }}
                        style={{
                            width: `${
                                !isEditingContact()
                                    ? (descriptor() || "Descriptor").length + 10
                                    : (descriptor() || "Descriptor").length + 1
                            }ch`, // +1 for buffer
                        }}
                        type="text"
                        placeholder="Descriptor"
                        class="border-none outline-none font-inter text-[#1d1d1f] font-[15px] leading-[130%] tracking-[0%]
           max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis"
                    />
                    <Show when={isEditingContact() && !isCompleted()}>
                        <button
                            class="shrink-0 cursor-pointer"
                            onClick={() => {
                                triggerAnimation("reverse");
                                setIsEditingContact(false);
                                setShowDescriptorLabel(true);
                                setError("");
                            }}
                        >
                            <EditIcon />
                        </button>
                    </Show>
                </div>

                <div class="flex gap-[8px] absolute top-[26px]">
                    <input
                        disabled={!isEditingContact() || isCompleted()}
                        onInput={(e) => {
                            if (!isCompleted()) setContact(e.target.value ?? "");
                        }}
                        style={{
                            width: `${
                                (contact() || "Descriptor").length + 1
                            }ch`, // +1 for buffer
                        }}
                        type="text"
                        placeholder="Enter Contact"
                        class="whitespace-pre border-none flex-grow outline-none font-inter text-[#1d1d1f] font-[15px] leading-[130%] tracking-[0%]"
                    />
                </div>
            </div>

            <Show when={error() !== ""}>
                <p class="text-red-500 text-xs absolute bottom-[-22px] left-[8px]">
                    {error()}
                </p>
            </Show>

            <button
                onClick={handleNextButton}
                disabled={buttonState() === "loading" || isCompleted()}
                class={`absolute bottom-[8px] right-[8px] ${isCompleted() ? 'opacity-80' : 'cursor-pointer'} w-[20px] h-[20px] flex items-center justify-center rounded-[24px] ${
                    buttonState() === "success" ? "bg-green-500" : "bg-black"
                }`}
            >
                <Show when={buttonState() === "loading"}>
                    <LoadingLightIcon class="animate-spin" />
                </Show>
                <Show when={buttonState() === "next"}>
                    <ArrowRight class="w-[12px] h-[12px]" />
                </Show>
                <Show when={buttonState() === "success"}>
                    <SuccessIcon />
                </Show>
            </button>
        </div>
    );
}
