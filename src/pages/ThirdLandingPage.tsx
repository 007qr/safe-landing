import { Component } from "solid-js";
import DescriptorWidget from "~/components/descriptor/Descriptor";

interface Props {

}

const ThirdLandingPage: Component<Props> = () => {
    return (
        <>
            <div class="flex items-center justify-center h-screen w-full">
                <DescriptorWidget />
            </div>
        </>
    )
}

export default ThirdLandingPage;
