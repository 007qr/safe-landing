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
        const val = (e.target as HTMLInputElement).value;
        const formattedVal = val.replace(/[^\d\s\-()]/g, "");
        setPhoneNumber(formattedVal);
        const valid = validatePhoneNumber(formattedVal, selectedCountry().code);
        local.onChange?.(`${selectedCountry().dialCode}${formattedVal}`, valid);
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
                    class={`rounded p-2 outline-none flex-1`}
                    placeholder={dynamicPlaceholder()}
                    value={phoneNumber()}
                    onInput={handleInputChange}
                    onBlur={handleBlur}
                    aria-invalid={isTouched() && !isValid()}
                    {...rest}
                />
            </div>

            <Show when={isTouched() && !isValid() && errorMessage()}>
                <p class="text-red-500 text-sm mt-1" role="alert">
                    {errorMessage()}
                </p>
            </Show>
        </div>
    );
};

export default PhoneInput;
