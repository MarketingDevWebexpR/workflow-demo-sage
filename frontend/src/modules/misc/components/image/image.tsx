import React from "react";
import { cn } from "../../../../lib/utils";
import { z } from "zod";
import { getRadius, radii, type TRadiusKey } from "../../data/radii";
import styles from './image.module.scss';
import { getSpacing, spacings } from "../../data/spacings";
import { type TSpacingKey } from "../../data/spacings";


const ConfigurableImagePropsSchema = z.object({
    imageUrl: z.union([
        z.instanceof(File),
        z.string().url({ message: "URL must be a valid URL" }),
        z.literal(""),
    ]).optional(),
    height: z
        .union([
            z.number({ coerce: true }).min(1, { message: 'If specified, the height must be greater than 0.' }),
            z.literal("")
        ])
        .refine(value => value !== "", {
            message: 'If specified, the height must be greater than 0.',
        })
        .transform(value => (typeof value === "string" ? NaN : value))
        .optional(),
    radius: z.enum(Array.from(radii.entries()).map(([id]) => id) as [TRadiusKey, ...TRadiusKey[]]),
    marginTop: z.enum(Array.from(spacings.entries()).map(([id]) => id) as [TSpacingKey, ...TSpacingKey[]]),
    marginBottom: z.enum(Array.from(spacings.entries()).map(([id]) => id) as [TSpacingKey, ...TSpacingKey[]]),
    marginLeft: z.enum(Array.from(spacings.entries()).map(([id]) => id) as [TSpacingKey, ...TSpacingKey[]]),
    marginRight: z.enum(Array.from(spacings.entries()).map(([id]) => id) as [TSpacingKey, ...TSpacingKey[]]),
});

function getDefaultProps(): TConfigurableImageProps {
    return {
        imageUrl: '',
        height: 250,
        radius: 'md',
        marginTop: 'none',
        marginBottom: 'none',
        marginLeft: 'none',
        marginRight: 'none',
    };
}

type TConfigurableImageProps = z.infer<typeof ConfigurableImagePropsSchema>;

type TStaticImageProps = {};

type TImageProps = TConfigurableImageProps & TStaticImageProps & React.HTMLAttributes<HTMLDivElement>;

const Image = React.forwardRef<HTMLDivElement, TImageProps>(
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
            className={cn(
                styles.image,
                getRadius(props.radius).value,
                getSpacing(props.marginTop).value.marginTop,
                getSpacing(props.marginBottom).value.marginBottom,
                getSpacing(props.marginLeft).value.marginLeft,
                getSpacing(props.marginRight).value.marginRight,
                className
            )}
            style={{
                '--img-url': `url("${imageUrl}")`,
                ...(props.height ? { height: `${props.height}px` } : {})
            } as React.CSSProperties}
            ref={ref}
            {...props}
        />;
    }
);

Image.displayName = 'Image';


export {
    Image,
    getDefaultProps,
    ConfigurableImagePropsSchema,
    type TConfigurableImageProps,
    type TStaticImageProps,
    type TImageProps,
};
