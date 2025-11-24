// @@ zod
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

// @@ types
import { type RequiredButCanBeUndefined } from '../../../utils/types.utils';


export function fallbackProps(): TView {
    return {
        Id: uuidv4(),
        workflowId: '',
        stepId: '',
        components: '[]',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

// -------------------- DONNÉES EN PROVENANCE DE L'API VERS L'APP --------------------
export const ViewSchema = z.object({
    Id: z.string({
        required_error: "An id is required.",
    }),
    workflowId: z.string({
        required_error: "A workflow id is required.",
    }),
    stepId: z.string({
        required_error: "A step id is required.",
    }),
    components: z.string({
        required_error: "Components are required.",
    }),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export type TView = z.infer<typeof ViewSchema>;


// -------------------- DONNÉES DU FORMULAIRE --------------------
export const createViewFormSchema = () => z.object({
    workflowId: z.string({
        required_error: 'A workflow id is required.',
    }).nonempty({
        message: 'A workflow id is required.',
    }),
    stepId: z.string({
        required_error: 'A step id is required.',
    }).nonempty({
        message: 'A step id is required.',
    }),
});

export const CreateViewFormSchema = createViewFormSchema();

export type TCreateViewFormValues = z.infer<typeof CreateViewFormSchema>;


// -------------------- DONNÉES EN DIRECTION DE L'API --------------------
const _ViewComponentsSchema = z.object({
    components: z.string({
        required_error: "Components are required.",
    }).nonempty({
        message: "Components cannot be empty.",
    }),
});

type TViewComponentsProp = z.infer<typeof _ViewComponentsSchema>;

export type TCreateViewProps = TCreateViewFormValues & TViewComponentsProp;
export type TUpdateViewProps = RequiredButCanBeUndefined<TCreateViewProps>;


// -------------------- AUTRE --------------------
export const ViewComponentSchema = z.object({
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

export type TViewComponent = z.infer<typeof ViewComponentSchema>;

