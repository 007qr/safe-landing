// import AIWidget from "./components/AIWidget";
// import AIWidget2 from "./components/AIWidget2";
// import { createSignal } from "solid-js";
import P2 from "./components/Descriptor/p2";
// import P3 from "./components/Descriptor/p3";
// import DescriptorWidget from "./DescriptorWidget";
// import StopperForm from "./stopper-form";

export default function Lp3() {
    // const [flow, setFlow] = createSignal<DescriptorFlow>("list_descriptors");
    
    return (
        <>
            <div class="max-w-[1200px] mx-auto flex-wrap gap-7 w-full h-screen flex items-center justify-center">
                {/* <StopperForm /> */}
                {/* <P1 /> */}
                <P2 />
                {/* <P3 flow={flow} setFlow={setFlow} /> */}
                {/* <DescriptorWidget />
                <AIWidget disputeStates="pending_response_from_bank" />
                <AIWidget disputeStates="won" />
                <AIWidget disputeStates="lost" />
                <AIWidget disputeStates="not_responded" /> */}
            </div>
        </>
    );
}
