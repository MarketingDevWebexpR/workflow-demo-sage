import React from "react";
import { cn } from "../../../../lib/utils";
import { z } from "zod";
import RichTextEditor from "../../../../components/ui/form/base-fields/rich-text-editor/rich-text-editor";
import { DEBOUNCE_PROP } from "../../../../hooks/use-props-form";
import styles from './rich-text.module.scss';


const ConfigurableRichTextPropsSchema = z.object({
    content: z.string().describe( DEBOUNCE_PROP ), 
});

type TConfigurableRichTextProps = z.infer<typeof ConfigurableRichTextPropsSchema>;

type TStaticRichTextProps = {};

type TRichTextProps = TConfigurableRichTextProps & TStaticRichTextProps & React.HTMLAttributes<HTMLDivElement>;

function getDefaultProps(): TConfigurableRichTextProps {
    return {
        content: `<h2>Hello world</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui.</p>`,
    };
}

const RichText = React.forwardRef<HTMLDivElement, TRichTextProps>(
    ({ className, ...props }, ref) => {

        const content = props.content || '';

        return <div 
            ref={ref}
            className={cn(styles.richText, className)}
            {...props}
        >
            <RichTextEditor
                value={content}
                readOnly
            />
        </div>;
    }
);

RichText.displayName = 'RichText';


export {
    RichText,
    getDefaultProps,
    ConfigurableRichTextPropsSchema,
    type TConfigurableRichTextProps,
    type TStaticRichTextProps,
    type TRichTextProps,
};