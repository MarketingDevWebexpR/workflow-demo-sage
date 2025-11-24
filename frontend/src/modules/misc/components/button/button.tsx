import React, { useState } from "react";
import { cn } from "../../../../lib/utils";
import { z } from "zod";
import { Button as ButtonComponent, type ButtonProps } from "../../../../components/ui/button/button";
import { type TButtonOnClickBehavior } from "../../data/button-onclick-behaviors";
import { buttonOnClickBehaviors } from "../../data/button-onclick-behaviors";
import { Dialog, DialogContent, DialogFooter, } from "../../../../components/ui/dialog/dialog";
import { ArrowLeft } from "lucide-react";
import RichTextEditor from "../../../../components/ui/form/base-fields/rich-text-editor/rich-text-editor";
import { useNavigate } from "react-router-dom";
import { DEBOUNCE_PROP } from "../../../../hooks/use-props-form";
import { usePageStore } from "../../../view/store/page.store";


const ConfigurableButtonPropsSchema = z
    .object({
        textContent: z.string().describe( DEBOUNCE_PROP ),
        variant: z.enum(['primary', 'secondary', 'outline', 'ghost', 'link', 'destructive', 'default']),
        size: z.enum(['default', 'sm', 'lg', 'icon']),
        onClickBehavior: z.enum(Object.keys(buttonOnClickBehaviors) as [TButtonOnClickBehavior, ...TButtonOnClickBehavior[]]),
        externalLink: z.string().or(z.null().or(z.undefined())),
        modalContent: z.string().or(z.null().or(z.undefined())),
        internalPageId: z.number().or(z.null().or(z.undefined())),
    })
    .superRefine((data, ctx) => {
        if (data.onClickBehavior === 'openExternalLink') {

            if (!data.externalLink) {
                ctx.addIssue({
                    path: ['externalLink'],
                    message: 'The external link is required because the click behavior is "Open an external link".',
                    code: z.ZodIssueCode.custom,
                });
            }

            if (!data.externalLink?.startsWith('https://')) {
                ctx.addIssue({
                    path: ['externalLink'],
                    message: 'The external link must be in the correct format (https://...).',
                    code: z.ZodIssueCode.custom,
                });
            }
        }
    });

type TConfigurableButtonProps = z.infer<typeof ConfigurableButtonPropsSchema>;

type TStaticButtonProps = {};

type TButtonProps = TConfigurableButtonProps & TStaticButtonProps & React.HTMLAttributes<HTMLDivElement>

function getDefaultProps(): TConfigurableButtonProps {
    return {
        textContent: 'Button',
        variant: 'default',
        size: 'default',
        onClickBehavior: 'openExternalLink',
    };
}

const Button = React.forwardRef<HTMLDivElement, TButtonProps>(
    ({
        className,
        ...props
    }, ref) => {

        const [isDialogOpen, setIsDialogOpen] = useState(false);
        const onClickBehavior = props.onClickBehavior;
        const pages = usePageStore(state => state.data);
        const navigate = useNavigate();

        return <div
            ref={ref}
            className={cn(
                className,
                "inline-flex",
                onClickBehavior === 'openExternalLink' && 'relative',
            )}
            {...props}
        >
            <ButtonComponent
                variant={props.variant as ButtonProps['variant']}
                size={props.size as ButtonProps['size']}
                onClick={() => {

                    switch (onClickBehavior) {

                        case 'openInternalLink': {

                            const page = pages.find(({ Id }) => Id === props.internalPageId);

                            if( page?.Path ) { 
                                navigate(page?.Path);
                            } else {
                                console.warn('Bouton avec redirection interne : page non trouvée.', {
                                    internalPageId: props.internalPageId,
                                    pages,
                                });
                            }

                            break;
                        }

                        case 'openModal':
                            setIsDialogOpen(true);
                            break;
                    }
                }}
            >
                {onClickBehavior === 'openExternalLink' && !!props.externalLink && <a
                    href={props.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0"
                />}
                {props.textContent}
            </ButtonComponent>
            {/* Modale avec contenu WYSIWYG */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">

                    <RichTextEditor
                        value={props.modalContent || ""}
                        readOnly
                    />

                    <DialogFooter>
                        <ButtonComponent variant="outline" onClick={() => setIsDialogOpen(false)} className="mr-auto">
                            <ArrowLeft size={16} className="mr-1" />
                            Close
                        </ButtonComponent>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>;
    });

Button.displayName = 'Button';


export {
    Button,
    getDefaultProps,
    ConfigurableButtonPropsSchema,
    type TConfigurableButtonProps,
    type TButtonProps,
};