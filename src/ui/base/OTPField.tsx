import { createSignal, createEffect, For, Component, JSX, splitProps } from "solid-js";

interface OTPInputProps {
    length: number;
    onChangeOTP: (otp: string) => void;
    error: boolean;
    autoFocus?: boolean;
    isNumberInput?: boolean;
    disabled?: boolean;
    style?: JSX.CSSProperties;
    className?: string;
    inputStyle?: JSX.CSSProperties;
    inputClassName?: string;
}

const OTPField: Component<OTPInputProps> = (props) => {
    const [local, others] = splitProps(props, [
        "length",
        "onChangeOTP",
        "error",
        "autoFocus",
        "isNumberInput",
        "disabled",
        "style",
        "className",
        "inputStyle",
        "inputClassName"
    ]);

    const [activeInput, setActiveInput] = createSignal(0);
    const [otpValues, setOtpValues] = createSignal<string[]>(
        Array(local.length).fill("")
    );
    // Using an array reference to store input refs
    const inputRefs: HTMLInputElement[] = [];

    // Helper to trigger onChangeOTP with the current OTP
    const handleOtpChange = (otp: string[]) => {
        const otpValue = otp.join("");
        local.onChangeOTP(otpValue);
    };

    // Helper to get the right value (text or number)
    const getRightValue = (str: string) => {
        if (!local.isNumberInput || !str) {
            return str;
        }
        return Number(str) >= 0 ? str : "";
    };

    // Change OTP value at the active input
    const changeCodeAtFocus = (str: string) => {
        const updatedOTPValues = [...otpValues()];
        updatedOTPValues[activeInput()] = str[0] || "";
        setOtpValues(updatedOTPValues);
        handleOtpChange(updatedOTPValues);
    };

    // Focus management
    const focusInput = (inputIndex: number) => {
        const selectedIndex = Math.max(
            Math.min(local.length - 1, inputIndex),
            0
        );
        setActiveInput(selectedIndex);
        inputRefs[selectedIndex]?.focus();
    };

    const focusPrevInput = () => focusInput(activeInput() - 1);
    const focusNextInput = () => focusInput(activeInput() + 1);

    // Event handlers as functions that return event handlers to avoid recreating them
    const createOnFocusHandler = (index: number) => () => {
        focusInput(index);
    };

    const createOnChangeHandler = (index: number) => (e: InputEvent) => {
        const target = e.currentTarget as HTMLInputElement;
        const val = getRightValue(target.value);
        if (!val) {
            e.preventDefault();
            return;
        }
        changeCodeAtFocus(val);
        focusNextInput();
    };

    const createOnKeyDownHandler = (index: number) => (e: KeyboardEvent) => {
        const pressedKey = e.key;
        switch (pressedKey) {
            case "Backspace":
            case "Delete": {
                e.preventDefault();
                if (otpValues()[index]) {
                    changeCodeAtFocus("");
                } else {
                    focusPrevInput();
                }
                break;
            }
            case "ArrowLeft": {
                e.preventDefault();
                focusPrevInput();
                break;
            }
            case "ArrowRight": {
                e.preventDefault();
                focusNextInput();
                break;
            }
            default: {
                if (pressedKey.match(/^[^a-zA-Z0-9]$/)) {
                    e.preventDefault();
                }
                break;
            }
        }
    };

    const createOnPasteHandler = (index: number) => (e: ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData
            ?.getData("text/plain")
            .trim()
            .slice(0, local.length - index)
            .split("");
        if (pastedData) {
            let nextFocusIndex = 0;
            const updatedOTPValues = [...otpValues()];
            updatedOTPValues.forEach((val, i) => {
                if (i >= index) {
                    const changedValue = getRightValue(
                        pastedData.shift() || val
                    );
                    if (changedValue) {
                        updatedOTPValues[i] = changedValue;
                        nextFocusIndex = i;
                    }
                }
            });
            setOtpValues(updatedOTPValues);
            setActiveInput(Math.min(nextFocusIndex + 1, local.length - 1));
            handleOtpChange(updatedOTPValues);
        }
    };

    const onBlur = () => {
        setActiveInput(-1);
    };

    // Focus the first input on component mount if autoFocus is true
    createEffect(() => {
        if (local.autoFocus) {
            focusInput(0);
        }
    });

    return (
        <div
            class={`flex gap-[8px] ${local.className || ""}`}
            style={local.style}
        >
            <For each={Array(local.length).fill(0)}>
                {(_, index) => {
                    const i = index();
                    return (
                        <input
                            ref={(el) => (inputRefs[i] = el)}
                            inputmode={local.isNumberInput ? "numeric" : "text"}
                            value={otpValues()[i]}
                            onFocus={createOnFocusHandler(i)}
                            onInput={createOnChangeHandler(i)}
                            onKeyDown={createOnKeyDownHandler(i)}
                            onBlur={onBlur}
                            onPaste={createOnPasteHandler(i)}
                            disabled={local.disabled}
                            class={`w-12 h-12 text-center border rounded ${
                                local.error ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                local.inputClassName || ""
                            }`}
                            style={local.inputStyle}
                            {...others}
                        />
                    );
                }}
            </For>
        </div>
    );
};

export default OTPField;
