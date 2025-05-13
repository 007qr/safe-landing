import { createSignal, createEffect, For, Component, JSX } from "solid-js";

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

const OTPInput: Component<OTPInputProps> = (props) => {
    const [activeInput, setActiveInput] = createSignal(0);
    const [otpValues, setOtpValues] = createSignal<string[]>(
        Array(props.length).fill("")
    );
    const [inputRefs, setInputRefs] = createSignal<HTMLInputElement[]>([]);

    // Helper to trigger onChangeOTP with the current OTP
    const handleOtpChange = (otp: string[]) => {
        const otpValue = otp.join("");
        props.onChangeOTP(otpValue);
    };

    // Helper to get the right value (text or number)
    const getRightValue = (str: string) => {
        let changedValue = str;
        if (!props.isNumberInput || !changedValue) {
            return changedValue;
        }
        return Number(changedValue) >= 0 ? changedValue : "";
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
            Math.min(props.length - 1, inputIndex),
            0
        );
        setActiveInput(selectedIndex);
        inputRefs()[selectedIndex]?.focus();
    };

    const focusPrevInput = () => focusInput(activeInput() - 1);
    const focusNextInput = () => focusInput(activeInput() + 1);

    // Handle input focus
    const handleOnFocus = (index: number) => () => {
        focusInput(index);
    };

    // Handle input change
    const handleOnChange = (index: number) => (e: InputEvent) => {
        const target = e.currentTarget as HTMLInputElement;
        const val = getRightValue(target.value);
        if (!val) {
            e.preventDefault();
            return;
        }
        changeCodeAtFocus(val);
        inputRefs()[index + 1]?.focus();
    };

    // Handle blur
    const onBlur = () => {
        setActiveInput(-1);
    };

    // Handle keydown events
    const handleOnKeyDown = (index: number) => (e: KeyboardEvent) => {
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

    // Handle paste
    const handleOnPaste = (index: number) => (e: ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData
            ?.getData("text/plain")
            .trim()
            .slice(0, props.length - index)
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
            setActiveInput(Math.min(nextFocusIndex + 1, props.length - 1));
            handleOtpChange(updatedOTPValues);
        }
    };

    createEffect(() => {
        inputRefs()[props.autoFocus ? 0 : -1]?.focus();
    }, [inputRefs]);

    return (
        <div
            class={`flex gap-[8px] ${props.className || ""}`}
            style={props.style}
        >
            <For each={Array(props.length).fill(0)}>
                {(_, index) => (
                    <input
                        ref={(el) => {
                            const refs = inputRefs();
                            refs[index()] = el;
                            setInputRefs(refs);
                        }}
                        inputmode={props.isNumberInput ? "numeric" : "text"}
                        value={otpValues()[index()]}
                        onFocus={handleOnFocus(index())}
                        onInput={handleOnChange(index())}
                        onKeyDown={handleOnKeyDown(index())}
                        onBlur={onBlur}
                        onPaste={handleOnPaste(index())}
                        disabled={props.disabled}
                        class={`w-12 h-12 text-center border rounded ${
                            props.error ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            props.inputClassName || ""
                        }`}
                        style={props.inputStyle}
                    />
                )}
            </For>
        </div>
    );
};

export default OTPInput;
