import { createSignal, Show, onCleanup, onMount, createEffect } from "solid-js";
import { createTiptapEditor } from "solid-tiptap";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import BubbleMenu from "@tiptap/extension-bubble-menu";
import SaveIcon from "~/ui/icons/SaveIcon";

export default function EditorWidget() {
    let ref!: HTMLDivElement;
    let bubbleMenuRef!: HTMLDivElement;
    const [editing, setEditing] = createSignal(false);
    const [showEditor, setShowEditor] = createSignal(false);

    const instance = createTiptapEditor(() => ({
        element: ref,
        extensions: [
            StarterKit,
            BubbleMenu.configure({
                element: bubbleMenuRef,
                tippyOptions: {
                    placement: "top",
                    duration: 150,
                    interactive: true,
                    hideOnClick: false,
                },
            }),
        ],
        content: "",
        editable: editing(),
    }));

    // Get the HTML content from the editor
    const getContent = () => {
        const editorInstance = instance();
        return editorInstance ? editorInstance.getHTML() : "";
    };

    onCleanup(() => {
        const editorInstance = instance();
        if (editorInstance) {
            editorInstance.destroy();
        }
    });

    return (
        <div class="flex flex-col">
            <div
                class={`transition-all duration-300 ease-in-out ${
                    showEditor()
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4 pointer-events-none"
                }`}
            >
                <div
                    class="w-[364px] h-[170px] overflow-auto border p-4 bg-white rounded-[24px] relative border-[#1D1D1F14]"

                    style={{ "box-shadow": "0px 4px 2px 0px #00000005", "-ms-overflow-style": 'none', "scrollbar-width": "none" }}
                >
                    <div class="flex justify-between pb-[12px] border-b border-b-[#1D1D1F14]">
                        <h4 class="font-inter text-[15px] leading-[130%] tracking-[0%] font-medium">
                            Terms
                        </h4>
                        <button
                            onClick={() => {
                                setEditing((prev) => {
                                    const next = !prev;
                                    const editorInstance = instance();
                                    if (editorInstance) {
                                        editorInstance.setEditable(next);
                                        if (!next) {
                                            console.log(
                                                "Content saved:",
                                                getContent()
                                            );
                                        }
                                    }
                                    return next;
                                });
                            }}
                        >
                            <Show when={editing()} fallback={<EditIcon />}>
                                <span
                                    on:click={() => setShowEditor(false)}
                                >
                                    <SaveIcon />
                                </span>
                            </Show>
                        </button>
                    </div>

                    <div
                        ref={bubbleMenuRef}
                        class="bg-white border border-gray-200 leading-[130%] tracking-[0%] rounded-md shadow flex items-center text-[12px]"
                    >
                        <Show when={instance()}>
                            <button
                                class="hover:bg-gray-100 rounded p-1 outline-none"
                                onClick={() => {
                                    const ed = instance();
                                    ed?.chain().focus().toggleBold().run();
                                }}
                                title="Bold"
                            >
                                <b>Bold</b>
                            </button>
                        </Show>
                    </div>

                    <div
                        id="editor"
                        ref={(el) => (ref = el)}
                        class="mt-[12px] text-[13px] font-inter leading-[130%] tracking-[0%] overflow-visible"
                    />
                </div>
            </div>

            <button
                class="mt-[23px] transition-all duration-300 ease-in-out"
                onClick={() => setShowEditor((v) => !v)}
            >
                <div class="flex gap-[8px] items-center justify-center rounded-[64px] w-[100px] h-[28px] border border-[#1D1D1F14]">
                    <DocumentIcon />
                    <span class="font-inter font-normal text-[13px] leading-[130%] tracking-[0%]">
                        Term
                    </span>
                    <EditIcon />
                </div>
            </button>
        </div>
    );
}

function DocumentIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M6.66667 8.33317H13.3333M6.66667 11.6665H10.8333M2.5 8.33317C2.5 5.19067 2.5 3.619 3.47667 2.64317C4.4525 1.6665 6.02417 1.6665 9.16667 1.6665H10.8333C13.9758 1.6665 15.5475 1.6665 16.5233 2.64317C17.5 3.619 17.5 5.19067 17.5 8.33317V11.6665C17.5 14.809 17.5 16.3807 16.5233 17.3565C15.5475 18.3332 13.9758 18.3332 10.8333 18.3332H9.16667C6.02417 18.3332 4.4525 18.3332 3.47667 17.3565C2.5 16.3807 2.5 14.809 2.5 11.6665V8.33317Z"
                stroke="#1D1D1F"
                stroke-linecap="round"
            />
        </svg>
    );
}

function EditIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M11.9695 4.71001L13.2028 3.47668C13.3576 3.32184 13.5414 3.19901 13.7436 3.11521C13.9459 3.03141 14.1627 2.98828 14.3816 2.98828C14.6005 2.98828 14.8173 3.03141 15.0195 3.11521C15.2218 3.19901 15.4056 3.32184 15.5603 3.47668L16.7387 4.65501C17.0511 4.96755 17.2266 5.3914 17.2266 5.83334C17.2266 6.27528 17.0511 6.69913 16.7387 7.01168L15.5053 8.24501M11.9695 4.71001L3.95616 12.7225C3.67948 12.9992 3.50897 13.3644 3.4745 13.7542L3.27283 16.0375C3.262 16.1589 3.27792 16.2812 3.31948 16.3957C3.36103 16.5103 3.42721 16.6143 3.51334 16.7006C3.59947 16.7868 3.70346 16.853 3.81798 16.8947C3.9325 16.9364 4.05477 16.9524 4.17616 16.9417L6.4595 16.74C6.84985 16.7059 7.21572 16.5354 7.49283 16.2583L15.5053 8.24501M11.9695 4.71001L15.5053 8.24501"
                stroke="#1D1D1F"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    );
}

