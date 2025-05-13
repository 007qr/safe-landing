import { Component } from "solid-js";
import P2 from "~/components/Descriptor/p2";

interface Props {

}

const ThirdLandingPage: Component<Props> = () => {
    return (
        <>
            <div class="flex items-center justify-center h-screen w-full">
                <P2 />
            </div>
        </>
    )
}

export default ThirdLandingPage;
