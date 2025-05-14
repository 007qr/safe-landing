// This is broken
import { EditorElement, useEditor } from "../../providers/editor-provider";
import { VsTrash } from "solid-icons/vs";
import { Show } from "solid-js";
import { cn } from "~/lib/utils";

type Props = {
    element: EditorElement;
};

export default function TextComponent(props: Props) {
    const { dispatch, state } = useEditor();

    const handleDeleteElement = () => {
        dispatch({
            type: "DELETE_ELEMENT",
            payload: { elementDetails: props.element },
        });
    };

    const styles = props.element.styles;

    const handleOnClickBody = (e: MouseEvent) => {
        e.stopPropagation();
        dispatch({
            type: "CHANGE_CLICKED_ELEMENT",
            payload: {
                elementDetails: props.element,
            },
        });
    };

    return (
        <div
            draggable={true}
            style={styles}
            class={cn(
                "p-[2px] w-full m-[5px] relative text-[16px] transition-all",
                {
                    "!border-blue-500":
                        state.editor.selectedElement.id === props.element.id,
                    "!border-solid":
                        state.editor.selectedElement.id === props.element.id,
                    "border-dashed border-[1px] border-slate-300":
                        !state.editor.liveMode,
                }
            )}
            on:click={handleOnClickBody}
        >
            {state.editor.selectedElement.id === props.element.id &&
                !state.editor.liveMode && (
                    <div class="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg">
                        {state.editor.selectedElement.name}
                    </div>
                )}
            <span
                contentEditable={!state.editor.liveMode}
                onBlur={(e) => {
                    const spanElement = e.target as HTMLSpanElement;
                    dispatch({
                        type: "UPDATE_ELEMENT",
                        payload: {
                            elementDetails: {
                                ...props.element,
                                content: {
                                    innerText: spanElement.innerText,
                                },
                            },
                        },
                    });
                }}
            >
                {!Array.isArray(props.element.content) &&
                    props.element.content.innerText}
            </span>
            <Show
                when={
                    state.editor.selectedElement.id === props.element.id &&
                    !state.editor.liveMode
                }
            >
                <div class="absolute px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
                    <VsTrash
                        onClick={handleDeleteElement}
                        class="cursor-pointer"
                        size={16}
                    />
                </div>
            </Show>
        </div>
    );
}
