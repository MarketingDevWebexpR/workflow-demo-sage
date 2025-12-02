import React from "react";
import { cn } from "../../../../lib/utils";
import { z } from "zod";
import RichTextEditor from "../../../../components/ui/form/base-fields/rich-text-editor/rich-text-editor";
import { DEBOUNCE_PROP } from "../../../../hooks/use-props-form";
import styles from './subpage-banner.module.scss';


const ConfigurableSubpageBannerPropsSchema = z.object({
    imageUrl: z.union([
        z.instanceof(File),
        z.string().url({ message: "URL must be a valid URL" }),
        z.literal(""),
    ]).optional(),
    text: z.string().describe(DEBOUNCE_PROP),
});

type TConfigurableSubpageBannerProps = z.infer<typeof ConfigurableSubpageBannerPropsSchema>;

type TStaticSubpageBannerProps = {};

type TSubpageBannerProps = TConfigurableSubpageBannerProps & TStaticSubpageBannerProps & React.HTMLAttributes<HTMLDivElement>;

function getDefaultProps(): TConfigurableSubpageBannerProps {
    return {
        imageUrl: '',
        text: `<h2>Hello world</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui.</p>`,
    };
}

const SubpageBanner = React.forwardRef<HTMLDivElement, TSubpageBannerProps>(
    ({ className, ...props }, ref) => {

        // Déterminer l'URL de l'image
        const getImageUrl = () => {
            if (!props.imageUrl) return '';
            
            if (typeof props.imageUrl === 'string') {
                return props.imageUrl;
            }
            
            if (props.imageUrl instanceof File) {
                return URL.createObjectURL(props.imageUrl);
            }
            
            return '';
        };

        const imageUrl = getImageUrl();

        return <div
            role="banner"
            className={cn(styles.subpageBanner, className)}
            ref={ref}
            {...props}
        >
            <div className={styles.subpageBannerContent}>
                <div className={styles.subpageBannerImage} style={{
                    '--img-url': `url("${imageUrl}")`,
                } as React.CSSProperties} />
                <div className={styles.subpageBannerTextContent}>
                    <RichTextEditor
                        value={props.text}
                        readOnly
                    />
                </div>
            </div>
        </div>
    }
);

SubpageBanner.displayName = 'SubpageBanner';


export {
    SubpageBanner,
    getDefaultProps,
    ConfigurableSubpageBannerPropsSchema,
    type TConfigurableSubpageBannerProps,
    type TStaticSubpageBannerProps,
    type TSubpageBannerProps,
};
