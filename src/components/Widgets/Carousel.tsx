import {
    Component,
    createSignal,
    For,
    JSX,
    onCleanup,
    onMount,
    createEffect,
} from "solid-js";

// Define types for carousel item props
export type CarouselItemProps = {
    onNext: () => void;
};

// Define a type for carousel items that can be either direct JSX or render props
export type CarouselItem =
    | JSX.Element
    | ((props: CarouselItemProps) => JSX.Element);

// Define types for the carousel props
export type CarouselProps = {
    children: CarouselItem[];
    autoPlay?: boolean;
    autoPlayInterval?: number;
    showIndicators?: boolean;
    cardWidth?: number; // Individual card width in pixels
    cardHeight?: number; // Individual card height in pixels
    cardGap?: number; // Gap between cards in pixels
};

const Carousel: Component<CarouselProps> = (props) => {
    // Default card dimensions and gap
    const cardWidth = props.cardWidth || 740;
    const cardHeight = props.cardHeight || 632;
    const cardGap = props.cardGap || 72;

    const [translateX, setTranslateX] = createSignal(0);
    const [isTransitioning, setIsTransitioning] = createSignal(false);
    const [totalItems, setTotalItems] = createSignal(props.children.length);
    const [visibleCards, setVisibleCards] = createSignal(0);
    const [currentPosition, setCurrentPosition] = createSignal(0);
    const [containerWidth, setContainerWidth] = createSignal(0);
    const [initialOffset, setInitialOffset] = createSignal(0);
    const [maxScrollPosition, setMaxScrollPosition] = createSignal(0);
    const autoPlayInterval = props.autoPlayInterval || 5000;

    let carouselRef: HTMLDivElement | undefined;
    let containerRef: HTMLDivElement | undefined;
    let contentRef: HTMLDivElement | undefined;
    let timer: number;

    // Calculate visible cards and initial positioning
    const calculateLayout = () => {
        if (!containerRef) return;
        
        const contWidth = containerRef.offsetWidth;
        setContainerWidth(contWidth);
        
        // Calculate how many cards can be fully visible (including gap)
        const cardTotalWidth = cardWidth + cardGap;
        const visible = Math.max(1, Math.floor((contWidth + cardGap) / cardTotalWidth));
        setVisibleCards(visible);
        
        // Calculate center offset for the first card
        const centerOffset = Math.max(0, (contWidth - cardWidth) / 2);
        setInitialOffset(centerOffset);
        
        const totalContentWidth = (totalItems() * cardWidth) + ((totalItems() - 1) * cardGap);
        

        const maxScroll = Math.max(0, totalContentWidth);
        setMaxScrollPosition(maxScroll);
        
        setCurrentPosition(0);
        setTranslateX(centerOffset);
    };

    // Function to scroll right
    const scrollRight = () => {
        if (isTransitioning()) return;
        
        // Don't proceed if we're at the end
        if (currentPosition() >= totalItems() - visibleCards()) return;
        
        const currentTranslate = translateX();
        const scrollAmount = cardWidth + cardGap;
        
        // Calculate the next position with boundary protection
        const availableScroll = initialOffset() - maxScrollPosition();
        const nextTranslate = Math.max(availableScroll, currentTranslate - scrollAmount);
        
        setTranslateX(nextTranslate);
        setCurrentPosition(currentPosition() + 1);
        setIsTransitioning(true);
        
        // Reset the transition state after animation completes
        setTimeout(() => setIsTransitioning(false), 300);
    };

    // Function to scroll left
    const scrollLeft = () => {
        if (isTransitioning()) return;
        
        // Don't proceed if we're at the beginning
        if (currentPosition() <= 0) return;
        
        const currentTranslate = translateX();
        const scrollAmount = cardWidth + cardGap;
        
        // Calculate the next position with boundary protection
        const nextTranslate = Math.min(initialOffset(), currentTranslate + scrollAmount);
        
        setTranslateX(nextTranslate);
        setCurrentPosition(currentPosition() - 1);
        setIsTransitioning(true);
        
        // Reset the transition state after animation completes
        setTimeout(() => setIsTransitioning(false), 300);
    };

    // Function to go to a specific position (for indicators)
    const goToPosition = (position: number) => {
        if (isTransitioning()) return;
        
        // Calculate the translate value for the target position
        const scrollAmount = (cardWidth + cardGap) * position;
        const maxTranslate = initialOffset() - maxScrollPosition();
        const targetTranslate = Math.max(maxTranslate, initialOffset() - scrollAmount);
        
        setTranslateX(targetTranslate);
        setCurrentPosition(position);
        setIsTransitioning(true);
        
        setTimeout(() => setIsTransitioning(false), 300);
    };

    // Check if we can scroll further right
    const canScrollRight = () => {
        return currentPosition() < (totalItems() - 1);
    };

    // Check if we can scroll further left
    const canScrollLeft = () => {
        return currentPosition() > 0;
    };

    // Setup auto play and calculate initial layout
    onMount(() => {
        // Use requestAnimationFrame to ensure the DOM is fully rendered
        requestAnimationFrame(() => {
            calculateLayout();
            
            // Add debounced window resize listener
            let resizeTimeout: number;
            const handleResize = () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = window.setTimeout(() => {
                    calculateLayout();
                }, 250); // 250ms debounce
            };
            
            window.addEventListener('resize', handleResize, { passive: true });
            
            if (props.autoPlay) {
                timer = window.setInterval(() => {
                    if (canScrollRight()) {
                        scrollRight();
                    } else {
                        // Reset to beginning if at end
                        goToPosition(0);
                    }
                }, autoPlayInterval);
            }
            
            // Clean up
            onCleanup(() => {
                window.removeEventListener('resize', handleResize);
                clearTimeout(resizeTimeout);
                if (timer) {
                    clearInterval(timer);
                }
            });
        });
    });

    // Recalculate layout when children change
    createEffect(() => {
        const newTotalItems = props.children.length;
        if (newTotalItems !== totalItems()) {
            setTotalItems(newTotalItems);
            if (containerRef) calculateLayout();
        }
    });

    // Function to render each carousel item
    const renderItem = (item: CarouselItem) => {
        if (typeof item === "function") {
            return item({ onNext: scrollRight });
        }
        return item;
    };

    return (
        <div class="relative overflow-hidden p-4" ref={carouselRef}>
            <div class="max-w-6xl mx-auto" ref={containerRef}>
                {/* Carousel content */}
                <div 
                    class="flex transition-transform duration-300 ease-in-out" 
                    style={{ transform: `translateX(${translateX()}px)` }}
                    ref={contentRef}
                >
                    <For each={props.children}>
                        {(item, index) => (
                            <div 
                                style={{
                                    width: `${cardWidth}px`,
                                    "margin-right": index() < totalItems() - 1 ? `${cardGap}px` : "0"
                                }}
                                class="flex-shrink-0"
                            >
                                {renderItem(item)}
                            </div>
                        )}
                    </For>
                </div>
            </div>

            {/* Left button */}
            <button 
                class="absolute left-4 top-1/2 p-2 rounded-full z-30 -translate-y-1/2 bg-white text-lg text-black shadow-md" 
                style={{ 
                    opacity: canScrollLeft() ? "1" : "0",
                    visibility: canScrollLeft() ? "visible" : "hidden",
                    transition: "opacity 0.3s, visibility 0.3s"
                }}
                onClick={scrollLeft}
                disabled={!canScrollLeft()}
                aria-label="Previous slide"
            >
                 ←
            </button>
            
            {/* Right button */}
            <button 
                class="absolute right-4 top-1/2 p-2 rounded-full z-30 -translate-y-1/2 bg-white text-lg text-black shadow-md" 
                style={{ 
                    opacity: canScrollRight() ? "1" : "0",
                    visibility: canScrollRight() ? "visible" : "hidden",
                    transition: "opacity 0.3s, visibility 0.3s"
                }}
                onClick={scrollRight}
                disabled={!canScrollRight()}
                aria-label="Next slide"
            >
                →
            </button>

            {/* Indicators (optional) */}
            {props.showIndicators && totalItems() > visibleCards() && (
                <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    <For each={Array(Math.max(1, totalItems() - visibleCards() + 1)).fill(0)}>
                        {(_, i) => (
                            <button
                                class="w-2 h-2 rounded-full transition-colors duration-200"
                                classList={{
                                    "bg-white": currentPosition() === i(),
                                    "bg-white/50": currentPosition() !== i()
                                }}
                                onClick={() => goToPosition(i())}
                                aria-label={`Go to slide ${i() + 1}`}
                            />
                        )}
                    </For>
                </div>
            )}
        </div>
    );
};

export default Carousel;