import {
    Component,
    createSignal,
    createEffect,
    splitProps,
    Show,
    For,
    onCleanup,
} from "solid-js";
import {
    parsePhoneNumber,
    isValidPhoneNumber,
    getCountries,
    getCountryCallingCode,
    CountryCode,
    isSupportedCountry,
} from "libphonenumber-js/max";

interface PhoneInputProps {
    value?: string;
    onChange?: (fullPhone: string, isValid: boolean) => void;
    required?: boolean;
    defaultCountry?: string;
    placeholder?: string;
    preservePlus?: boolean; // Added new prop to preserve plus sign
}

interface CountryData {
    name: string;
    code: CountryCode;
    dialCode: string;
    flagUrl: string;
}

const PhoneInput: Component<PhoneInputProps> = (props) => {
    const [local, rest] = splitProps(props, [
        "value",
        "onChange",
        "required",
        "defaultCountry",
        "placeholder",
        "preservePlus", // Added to splitProps
    ]);

    const allCountries = getCountries().reduce<CountryData[]>((acc, code) => {
        try {
            if (isSupportedCountry(code as CountryCode)) {
                const dialCode = getCountryCallingCode(code as CountryCode);
                const name =
                    new Intl.DisplayNames(["en"], { type: "region" }).of(
                        code
                    ) || code;

                const flagUrl = `https://flagcdn.com/w320/${code.toLowerCase()}.png`;

                acc.push({
                    name,
                    code: code as CountryCode,
                    dialCode: `+${dialCode}`,
                    flagUrl,
                });
            }
        } catch (error) {
            console.warn(`Error with country ${code}:`, error);
        }
        return acc;
    }, []);

    const countries = allCountries.sort((a, b) => a.name.localeCompare(b.name));

    const findDefaultCountry = () => {
        if (
            local.defaultCountry &&
            isSupportedCountry(local.defaultCountry as CountryCode)
        ) {
            return (
                countries.find((c) => c.code === local.defaultCountry) ||
                countries.find((c) => c.code === "US") ||
                countries[0]
            );
        }
        return countries.find((c) => c.code === "US") || countries[0];
    };

    const [selectedCountry, setSelectedCountry] = createSignal<CountryData>(findDefaultCountry());
    const [phoneNumber, setPhoneNumber] = createSignal("");
    const [isValid, setIsValid] = createSignal(false);
    const [isTouched, setIsTouched] = createSignal(false);
    const [formattedNumber, setFormattedNumber] = createSignal("");
    const [errorMessage, setErrorMessage] = createSignal("");
    const [isDropdownOpen, setIsDropdownOpen] = createSignal(false);

    let dropdownRef: HTMLDivElement | undefined;
    let inputRef: HTMLInputElement | undefined;

    // A generic placeholder generator
    const getPlaceholderForCountry = (countryCode: CountryCode): string => {
        try {
            const dialCode = getCountryCallingCode(countryCode);
            return `${dialCode} 123 456 789`;
        } catch (e) {
            return "";
        }
    };

    createEffect(() => {
        if (local.value) {
            try {
                const parsed = parsePhoneNumber(local.value);
                if (parsed && parsed.country) {
                    const country = countries.find(
                        (c) => c.code === parsed.country
                    );
                    if (country) {
                        setSelectedCountry(country);
                        setPhoneNumber(parsed.nationalNumber);
                        validatePhoneNumber(
                            parsed.nationalNumber,
                            country.code
                        );
                    }
                }
            } catch (e) {}
        }
    });

    const validatePhoneNumber = (number: string, countryCode: CountryCode) => {
        if (!number.trim()) {
            const emptyValid = !local.required;
            setIsValid(emptyValid);
            setErrorMessage(local.required ? "Phone number is required" : "");
            setFormattedNumber("");
            return emptyValid;
        }

        try {
            const fullNumber = `${selectedCountry().dialCode}${number}`;
            const valid = isValidPhoneNumber(fullNumber, countryCode);

            if (valid) {
                try {
                    const parsed = parsePhoneNumber(fullNumber, countryCode);
                    setFormattedNumber(
                        parsed ? parsed.formatNational() : number
                    );
                } catch (e) {
                    setFormattedNumber(number);
                }
                setErrorMessage("");
            } else {
                setErrorMessage("Invalid phone number for this country");
                setFormattedNumber(number);
            }

            setIsValid(valid);
            return valid;
        } catch (e) {
            setIsValid(false);
            setErrorMessage("Invalid phone number format");
            setFormattedNumber(number);
            return false;
        }
    };

    const handleInputChange = (e: Event) => {
        const input = e.target as HTMLInputElement;
        const cursorPosition = input.selectionStart || 0;
        
        // Get current value
        const currentValue = input.value;
        
        // Allow only digits and optionally the plus sign at the beginning
        const sanitizedValue = local.preservePlus 
            ? currentValue.replace(/[^\d+]/g, "").replace(/(^\+)|\+/g, "$1") // Keep only one + at the beginning
            : currentValue.replace(/\D/g, ""); // Remove all non-digits
        
        // Update the input value if it changed due to our filtering
        if (currentValue !== sanitizedValue) {
            input.value = sanitizedValue;
            
            // Adjust cursor position if characters were removed before the cursor
            const removedChars = currentValue.length - sanitizedValue.length;
            const newPosition = Math.max(0, cursorPosition - removedChars);
            
            // Need to set selection after the current event completes
            setTimeout(() => {
                input.setSelectionRange(newPosition, newPosition);
            }, 0);
        }
        
        setPhoneNumber(sanitizedValue);
        const valid = validatePhoneNumber(sanitizedValue, selectedCountry().code);
        local.onChange?.(`${selectedCountry().dialCode}${sanitizedValue}`, valid);
    };

    // Prevent non-numeric characters at keydown for better UX
    const handleKeyDown = (e: KeyboardEvent) => {
        // Allow: backspace, delete, tab, escape, enter
        if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl/cmd+A, Ctrl/cmd+C, Ctrl/cmd+X
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode === 88 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right, up, down
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            // Let it happen, don't do anything
            return;
        }
        
        // Allow '+' only at the beginning and only if preservePlus is true
        if (e.key === '+' && local.preservePlus) {
            const input = e.target as HTMLInputElement;
            const cursorAtStart = input.selectionStart === 0;
            const valueHasNoPlus = !input.value.includes('+');
            
            if (!(cursorAtStart && valueHasNoPlus)) {
                e.preventDefault();
            }
            return;
        }
        
        // Block if not a number
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && 
            (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    };

    // Handle paste events to filter non-numeric characters
    const handlePaste = (e: ClipboardEvent) => {
        // Get pasted data
        const clipboardData = e.clipboardData;
        if (!clipboardData) return;
        
        const pastedData = clipboardData.getData('text');
        
        // Filter to allow only numbers and optionally a plus sign
        const sanitizedData = local.preservePlus 
            ? pastedData.replace(/[^\d+]/g, "").replace(/(^\+)|\+/g, "$1")
            : pastedData.replace(/\D/g, "");
            
        // If data was sanitized (non-numeric chars were removed)
        if (pastedData !== sanitizedData) {
            e.preventDefault();
            
            // Get input element and current selection
            const input = e.target as HTMLInputElement;
            const startPos = input.selectionStart || 0;
            const endPos = input.selectionEnd || 0;
            
            // Create new value by replacing selected text with sanitized data
            const newValue = 
                input.value.substring(0, startPos) + 
                sanitizedData + 
                input.value.substring(endPos);
                
            // Set new value and update cursor position
            input.value = newValue;
            const newCursorPos = startPos + sanitizedData.length;
            
            setTimeout(() => {
                input.setSelectionRange(newCursorPos, newCursorPos);
            }, 0);
            
            // Manually trigger change event processing
            setPhoneNumber(newValue);
            const valid = validatePhoneNumber(newValue, selectedCountry().code);
            local.onChange?.(`${selectedCountry().dialCode}${newValue}`, valid);
        }
    };

    const handleCountryChange = (code: CountryCode) => {
        const country = countries.find((c) => c.code === code);
        if (country) {
            setSelectedCountry(country);
            const valid = validatePhoneNumber(phoneNumber(), country.code);
            local.onChange?.(`${country.dialCode}${phoneNumber()}`, valid);
            setIsDropdownOpen(false); // Close dropdown on selection
        }
    };

    const handleBlur = () => {
        setIsTouched(true);
        if (isValid() && formattedNumber()) {
            setPhoneNumber(formattedNumber());
        }
    };

    const dynamicPlaceholder = () => {
        if (local.placeholder) return local.placeholder;
        return (
            getPlaceholderForCountry(selectedCountry().code) || "Phone number"
        );
    };

    // Close dropdown if click is outside of the dropdown or button
    const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef && !dropdownRef.contains(e.target as Node)) {
            setIsDropdownOpen(false);
        }
    };

    createEffect(() => {
        // Add the event listener to detect clicks outside
        document.addEventListener("click", handleClickOutside);

        // Cleanup the event listener when the component is unmounted
        onCleanup(() => {
            document.removeEventListener("click", handleClickOutside);
        });
    });

    return (
        <div class="flex flex-col gap-1">
            <div class="flex text-[15px] items-center">
                <div class="relative w-max" ref={dropdownRef}>
                    <button
                        class="w-full p-2 rounded flex items-center justify-start"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen())}
                        aria-expanded={isDropdownOpen()}
                        aria-haspopup="listbox"
                    >
                        <img
                            src={selectedCountry().flagUrl}
                            alt={selectedCountry().name}
                            class="w-6 h-4 mr-2"
                        />
                        {selectedCountry().code} {selectedCountry().dialCode}
                    </button>
                    <Show when={isDropdownOpen()}>
                        <ul
                            class="absolute w-max left-0 right-0 max-h-60 overflow-auto bg-white rounded mt-1 shadow-lg"
                            role="listbox"
                        >
                            <For each={countries}>
                                {(country) => (
                                    <li
                                        class="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleCountryChange(country.code)}
                                        role="option"
                                    >
                                        <img
                                            src={country.flagUrl}
                                            alt={country.name}
                                            class="w-6 h-4 mr-2"
                                        />
                                        {country.code} ({country.dialCode})
                                    </li>
                                )}
                            </For>
                        </ul>
                    </Show>
                </div>
                <div class="h-[60%] w-px bg-black/30"></div>

                <input
                    type="tel"
                    class="rounded p-2 outline-none flex-1"
                    placeholder={dynamicPlaceholder()}
                    value={phoneNumber()}
                    onInput={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    onBlur={handleBlur}
                    aria-invalid={isTouched() && !isValid()}
                    ref={inputRef}
                    {...rest}
                />
            </div>

            {/* <Show when={isTouched() && !isValid() && errorMessage()}>
                <p class="text-red-500 text-sm mt-1" role="alert">
                    {errorMessage()}
                </p>
            </Show> */}
        </div>
    );
};

export default PhoneInput;