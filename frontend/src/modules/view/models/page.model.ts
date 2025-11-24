// @@ utils
import { appUniqueId, getRandomInt, } from '../../../utils/number.utils';

// @@ zod
import { z } from 'zod';

// @@ i18n
import { type RequiredButCanBeUndefined } from '../../../utils/types.utils';


export function fallbackProps(): TPage {

    return {
        Id: appUniqueId.next().value * -1,
        Title: '_'.repeat( getRandomInt( 10, 30 ) ),
        Path: '_'.repeat( getRandomInt( 10, 30 ) ),
        Components: '_'.repeat( getRandomInt( 100, 500 ) ),
        Created: new Date().toISOString(),
        Modified: new Date().toISOString(),
    };
}

// -------------------- DONNÉES EN PROVENANCE DE L'API VERS L'APP --------------------
export const PageSchema = z.object({
    Id: z.number({
        required_error: "An id is required.",
    }).positive({
        message: "The id must be a positive number.",
    }),
    Title: z.string({
        required_error: "A title is required.",
    }).min(1, {
        message: "A title is required.",
    }).max( 255, {
        message: "The title cannot exceed 255 characters.",
    }),
    Path: z.string({
        required_error: "A path is required.",
    }).min(1, {
        message: "The path cannot be empty.",
    }),
    Components: z.string({
        required_error: "Components are required.",
    }).min(1, {
        message: "Components cannot be empty.",
    }).optional().nullable(),
    Created: z.string().datetime(),
    Modified: z.string().datetime(),
});

export type TPage = z.infer<typeof PageSchema>;



// -------------------- DONNÉES DU FORMULAIRE --------------------
export const createPageFormSchema = () => z.object({
    Title: z.string({
        required_error: 'A title is required.',
    }).nonempty({
        message: 'A title is required.',
    }),
    Path: z.string({
        required_error: 'A path is required.',
    }).startsWith('/', {
        message: 'The path must start with a slash.',
    }).nonempty({
        message: 'The path cannot be empty.',
    }),
    AddToNavigation: z.boolean().default(true),
});

// Exporter aussi l'ancien nom pour la rétrocompatibilité
export const CreatePageFormSchema = createPageFormSchema();

export type TCreatePageFormValues = z.infer<typeof CreatePageFormSchema>;


// -------------------- DONNÉES EN DIRECTION DE L'API --------------------
const _PageComponentsSchema = z.object({
    Components: z.string({
        required_error: "Components are required.",
    }).nonempty({
        message: "Components cannot be empty.",
    }),
});

type TPageComponentsProp = z.infer<typeof _PageComponentsSchema>;

export type TCreatePageProps = Omit<TCreatePageFormValues, 'AddToNavigation'> & TPageComponentsProp;
export type TUpdatePageProps = RequiredButCanBeUndefined<TCreatePageProps>;


// -------------------- AUTRE --------------------
export const PageComponentSchema = z.object({
    id: z.string({
        required_error: "An id is required.",
    }),
    displayName: z.string({
        required_error: "A display name is required.",
    }).nonempty({
        message: "The display name cannot be empty.",
    }),
    props: z.record(z.unknown()).optional(),
    updatedAt: z.number({
        required_error: "An updated at is required.",
    }).positive({
        message: "The updated at must be a positive number.",
    }).optional(),
    context: z.string(),
});

export type TPageComponent = z.infer<typeof PageComponentSchema>;
