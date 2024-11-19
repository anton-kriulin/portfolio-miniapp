import { useEffect } from "react";

const TRIGGER_THRESHOLD = 150;
const SHOW_INDICATOR_THRESHOLD = 50;
const MAX = 128;
const k = 0.4;

interface IusePullToRefreshProps {
    pullToRefreshRef: React.RefObject<HTMLDivElement>
    pullToRefreshAreaInView: boolean
    refreshAction: () => void
    accessToken?: string
}

export const usePullToRefresh = ({ pullToRefreshRef: ref, pullToRefreshAreaInView, refreshAction, accessToken }: IusePullToRefreshProps) => {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        el.addEventListener("touchstart", handleTouchStart);

        function handleTouchStart(startEvent: TouchEvent) {
            const el = ref.current;
            if (!el) return;

            const initialY = startEvent.touches[0].clientY;
            el.addEventListener("touchmove", handleTouchMove);
            el.addEventListener("touchend", handleTouchEnd);


            function appr(x: number) {
                return MAX * (1 - Math.exp((-k * x) / MAX));
            }

            function handleTouchMove(moveEvent: TouchEvent) {
            const el = ref.current;
            if (!el) return;

            const currentY = moveEvent.touches[0].clientY;
            const dy = currentY - initialY;
            if (dy < 0) return;

            const parentEl = el.parentNode as HTMLDivElement;

            if (dy > TRIGGER_THRESHOLD) {
                flipArrow(parentEl);
            } else if (dy > SHOW_INDICATOR_THRESHOLD) {
                addPullIndicator(parentEl);
            } else {
                removePullIndicator(parentEl);
            }

            el.style.transform = `translateY(${appr(dy)}px)`;
            }

            function addPullIndicator(el: HTMLDivElement) {
                const indicator = el.querySelector(".pull-indicator");

                if (indicator) {
                    if (indicator.classList.contains("flip")) {
                        indicator.classList.remove("flip");
                    }
                    return;
                }

                const pullIndicator = document.createElement("div");
                pullIndicator.className = "pull-indicator";
                pullIndicator.innerHTML = "<i class='pull-indicator-arrow'></i>";
                el.insertBefore(pullIndicator, el.children[0]);
            }

            function removePullIndicator(el: HTMLDivElement) {
                const pullIndicator = el.querySelector(".pull-indicator");
                if (pullIndicator) {
                    pullIndicator.remove();
                }
            }

            function flipArrow(el: HTMLDivElement) {
                const pullIndicator = el.querySelector(".pull-indicator");
                if (pullIndicator && !pullIndicator.classList.contains("flip")) {
                    pullIndicator.classList.add("flip");
                }
            }

            function handleTouchEnd(endEvent: TouchEvent) {
                const el = ref.current;
                if (!el) return;

                el.style.transform = "translateY(0)";
                removePullIndicator(el.parentNode as HTMLDivElement);

                el.style.transition = "transform 0.2s";

                const y = endEvent.changedTouches[0].clientY;
                const dy = y - initialY;
                if (accessToken && pullToRefreshAreaInView && dy > TRIGGER_THRESHOLD) {
                    refreshAction();
                }

                el.addEventListener("transitionend", onTransitionEnd);

                el.removeEventListener("touchmove", handleTouchMove);
                el.removeEventListener("touchend", handleTouchEnd);
            }

            function onTransitionEnd() {
                const el = ref.current;
                if (!el) return;

                el.style.transition = "";
                el.removeEventListener("transitionend", onTransitionEnd);
            }
        }

        return () => {
            el.removeEventListener("touchstart", handleTouchStart);
        };
    }, [ref.current, pullToRefreshAreaInView]);
}