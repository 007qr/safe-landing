import { render } from "solid-js/web";
import "./index.css";

import { A, Router, Route } from "@solidjs/router";
import { lazy } from "solid-js";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
    );
}

render(
    () => (
        <Router>
            {/* <Route
                path="/"
                component={() => (
                    <h2 class="text-3xl font-bold font-inter flex flex-col gap-4">
                        <A href="/lp1" class="underline decoration-blue-500">
                            Landing Page 1
                        </A>
                        <A href="/lp2" class="underline decoration-blue-500">
                            Landing Page 2
                        </A>
                        <A href="/lp3" class="underline decoration-blue-500">
                            Landing Page 3
                        </A>
                    </h2>
                )}
            /> */}
            {/* <Route path="/lp1" component={lazy(() => import("./App"))} /> */}
            <Route
                path="/lp1"
                component={lazy(() => import("./landing-page1"))}
            />
            <Route 
                path="/lp2" 
                component={lazy(() => import("./components/effects/radar"))} />
            <Route path="/lp3" component={lazy(() => import("./lp3"))} />
        </Router>
    ),
    root!
);
