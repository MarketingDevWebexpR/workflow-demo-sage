import { ExternalLink } from "lucide-react";
import { cn } from "../../../../../lib/utils";
import styles from './link-cell.module.scss';
import React, { useEffect, useRef } from "react";


type TLinkCellProps = React.HTMLAttributes<HTMLDivElement> & {
    link: string | null | undefined;
    title?: string | null | undefined;
    fallbackText?: string;
};

const LinkCell = React.forwardRef<HTMLDivElement, TLinkCellProps>(
    ({
        className,
        link,
        title,
        fallbackText = 'No link.',
        ...props
    }, ref) => {

        const linkRef = useRef<HTMLAnchorElement>(null);

        useEffect(() => {

            if( ! link?.startsWith( window.location.origin ) ) {
                return;
            }

            const stopPropagation = (e: MouseEvent) => {

                const target = e.target as HTMLElement;

                if( target.closest(`.${styles.linkCell}`)) {
                    e.stopPropagation();
                }
            };

            document.addEventListener('click', stopPropagation, { capture: true });

            return () => document.removeEventListener('click', stopPropagation, { capture: true });
        }, []);

        return <div
            className={cn(
                styles.linkCell,
                className
            )}
            ref={ref}
            data-fallback={!link}
            {...props}
        >
            <ExternalLink size={16} />
            <a
                ref={linkRef}
                data-link
                {...(link ? {
                    href: link,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                } : {})}
            >
                {(title && link) ? title : (link || fallbackText)}
            </a>
        </div>
    }
);

LinkCell.displayName = 'LinkCell';


export {
    LinkCell
};