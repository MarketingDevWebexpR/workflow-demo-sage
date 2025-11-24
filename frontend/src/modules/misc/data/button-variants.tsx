import { buttonVariants as buttonVariantsUI } from "../../../components/ui/button/button";


const buttonVariants = {
    default: {
        label: 'Standard',
        value: buttonVariantsUI({ variant: 'default' }),
    },
    outline: {
        label: 'Outline',
        value: buttonVariantsUI({ variant: 'outline' }),
    },
    secondary: {
        label: 'Secondary',
        value: buttonVariantsUI({ variant: 'secondary' }),
    },
    destructive: {
        label: 'Destructive',
        value: buttonVariantsUI({ variant: 'destructive' }),
    },
    ghost: {
        label: 'Ghost',
        value: buttonVariantsUI({ variant: 'ghost' }),
    },
    link: {
        label: 'Link',
        value: buttonVariantsUI({ variant: 'link' }),
    },
} as const;

type TButtonVariantKey = keyof typeof buttonVariants;


export {
    buttonVariants,
    type TButtonVariantKey,
};