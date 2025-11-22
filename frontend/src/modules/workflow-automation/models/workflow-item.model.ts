// @@ utils
import { appUniqueId, getRandomInt, } from '../../../utils/number.utils';

// @@ zod
import { z } from 'zod';
import type { RequiredButCanBeUndefined } from '../../../utils/types.utils';


// Préférences par défaut pour un workflow
export const DEFAULT_WORKFLOW_PREFERENCES = {
    xCoefficient: 200,
    yCoefficient: 62,
    xAxisThickness: 0,
    yAxisThickness: 0,
    connectorThickness: 1,
    arrowPointerThickness: 8,
    elementWidth: 94,
    elementHeight: 76,
    connectorRadius: 10,
    showIndexes: false,
};

export type TWorkflowPreferences = typeof DEFAULT_WORKFLOW_PREFERENCES;

export function fallbackProps(): TWorkflowItem {

    return {
        Id: appUniqueId.next().value * -1,
        Title: '_'.repeat( getRandomInt( 10, 30 ) ),
        Description: '_'.repeat( getRandomInt( 50, 150 ) ),
        IsEnabled: 0,
        FragmentId: '_'.repeat( getRandomInt( 10, 20 ) ),
        Preferences: JSON.stringify(DEFAULT_WORKFLOW_PREFERENCES),
        Created: new Date().toISOString(),
        Modified: new Date().toISOString(),
    };
}

// -------------------- DONNÉES EN PROVENANCE DE L'API VERS L'APP --------------------
export const WorkflowItemSchema = z.object({
    Id: z.number({
        required_error: "An id is required.",
    }).positive({
        message: "The id must be a positive number.",
    }),
    Created: z.string().datetime(),
    Modified: z.string().datetime(),
    Title: z.string({
        required_error: "A title is required.",
    }).min(1, {
        message: "The title cannot be empty.",
    }).max( 255, {
        message: "The title cannot exceed 255 characters.",
    }),
    Description: z.string().optional().nullable(),
    IsEnabled: z.union([z.literal(0), z.literal(1)]),
    FragmentId: z.string().optional().default('').transform(val => val || ''),
    WorkflowText: z.string().optional().nullable(),
    Preferences: z.string().optional().default(JSON.stringify(DEFAULT_WORKFLOW_PREFERENCES)).transform(val => val || JSON.stringify(DEFAULT_WORKFLOW_PREFERENCES)),
});

export type TWorkflowItem = z.infer<typeof WorkflowItemSchema>;



// -------------------- DONNÉES DU FORMULAIRE --------------------
export function getCreateWorkflowItemFormSchema() {
    return z.object({
        Title: z.string({
            required_error: 'A title is required.',
        }).nonempty({
            message: 'The title cannot be empty.',
        }).max(255, {
            message: 'The title cannot exceed 255 characters.',
        }),
        Description: z.string().max(500, {
            message: 'The description cannot exceed 500 characters.',
        }).optional().nullable(),
        IsEnabled: z.boolean().default(false),
        FragmentId: z.string({
            required_error: 'A fragment id is required.',
        }).nonempty({
            message: 'The fragment id cannot be empty.',
        }),
    });
}

export type TCreateWorkflowItemFormValues = z.infer<ReturnType<typeof getCreateWorkflowItemFormSchema>>;


// -------------------- DONNÉES EN DIRECTION DE L'API --------------------
export const CreateWorkflowItemPropsSchema = z.object({
    Title: z.string(),
    Description: z.string().optional().nullable(),
    IsEnabled: z.literal(0).or(z.literal(1)),
    FragmentId: z.string(),
    WorkflowText: z.string(),
    Preferences: z.string(),
});

export type TCreateWorkflowItemProps = z.infer<typeof CreateWorkflowItemPropsSchema>;

export type TUpdateWorkflowItemProps = RequiredButCanBeUndefined<TCreateWorkflowItemProps>;

