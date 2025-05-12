import { createSignal, Show, onMount } from "solid-js";
import { createDescriptor } from "../../lib/descriptorApi";

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
                        setError("You can't have two descriptors with same name or contact");
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

    const ButtonIcon = () => {
        switch (buttonState()) {
            case "loading":
                return <LoadingIcon />;
            case "success":
                return <SuccessIcon />;
            default:
                return <LeftArrow />;
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
                    <LoadingIcon />
                </Show>
                <Show when={buttonState() === "next"}>
                    <LeftArrow />
                </Show>
                <Show when={buttonState() === "success"}>
                    <SuccessIcon />
                </Show>
            </button>
        </div>
    );
}

function EditIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M9.57521 3.76801L10.5619 2.78134C10.6857 2.65747 10.8327 2.55921 10.9945 2.49217C11.1563 2.42513 11.3297 2.39062 11.5049 2.39062C11.68 2.39062 11.8534 2.42513 12.0152 2.49217C12.177 2.55921 12.3241 2.65747 12.4479 2.78134L13.3905 3.72401C13.6405 3.97404 13.7809 4.31312 13.7809 4.66667C13.7809 5.02023 13.6405 5.3593 13.3905 5.60934L12.4039 6.59601M9.57521 3.76801L3.16454 10.178C2.94319 10.3994 2.80678 10.6915 2.77921 11.0033L2.61787 12.83C2.60921 12.9271 2.62195 13.0249 2.65519 13.1166C2.68843 13.2082 2.74137 13.2915 2.81028 13.3604C2.87918 13.4294 2.96238 13.4824 3.054 13.5158C3.14561 13.5491 3.24343 13.5619 3.34054 13.5533L5.16721 13.392C5.47949 13.3647 5.77218 13.2283 5.99387 13.0067L12.4039 6.59601M9.57521 3.76801L12.4039 6.59601"
                stroke="#1D1D1F"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    );
}

function LeftArrow() {
    return (
        <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4.25 3L7.25 6L4.25 9"
                stroke="#F5F5F5"
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    );
}

function LoadingIcon() {
    return (
        <svg 
            width="12" 
            height="12" 
            viewBox="0 0 12 12" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            class="animate-spin"
        >
            <path 
                d="M6 1C3.24 1 1 3.24 1 6C1 8.76 3.24 11 6 11C8.76 11 11 8.76 11 6" 
                stroke="#F5F5F5" 
                stroke-width="1.2" 
                stroke-linecap="round" 
                stroke-linejoin="round"
            />
        </svg>
    );
}

function SuccessIcon() {
    return (
        <svg 
            width="12" 
            height="12" 
            viewBox="0 0 12 12" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <path 
                d="M2.5 6L5 8.5L9.5 4" 
                stroke="#F5F5F5" 
                stroke-width="1.2" 
                stroke-linecap="round" 
                stroke-linejoin="round"
            />
        </svg>
    );
}