import { useEffect } from "react";


export default function useScaleToFitParent(ref: React.MutableRefObject<HTMLElement | null>, ...deps: unknown[]): void {

    useEffect(() => {

        if (!ref.current)
            return;

        const onResize = () => {

            if (!ref.current)
                return;

            const parent = ref.current.parentElement as HTMLElement;
            const element = ref.current as HTMLElement;

            const elementBorderWidth = parseInt(getComputedStyle(element).getPropertyValue('--border-width')) || 0;
            const currentBorderOffset = parseInt(getComputedStyle(element).getPropertyValue('--scale-value-border-offset')) || 0;

            const parentWidth = parent.offsetWidth;
            const elementCurrentWidth = element.offsetWidth + currentBorderOffset;
            const scaleValue = parentWidth / elementCurrentWidth;

            element.style.setProperty('--scale-value', scaleValue.toString());
            element.style.setProperty('--scale-value-border-offset', `${ ( elementBorderWidth/scaleValue ) * 2 }px`);
        };

        const resizeObserver = new ResizeObserver(onResize);
        resizeObserver.observe(ref.current.parentElement as HTMLElement);

        return () => {
            resizeObserver.disconnect();
        };
    }, [ref.current, ...deps]);
}