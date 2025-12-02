import React from "react";
import { z } from "zod";
import { FormEngine } from "../form-engine/form-engine";
// import { DEBOUNCE_PROP } from "../../../../hooks/use-props-form";
// import { getObjectFromStringifiedJson } from "../../../../utils/json.utils";


const ConfigurableFormEngineComponentPropsSchema = z.object({
    // configJSON: z.string().describe(DEBOUNCE_PROP),
    configJSON: z.any(),
});

type TConfigurableFormEngineComponentProps = z.infer<typeof ConfigurableFormEngineComponentPropsSchema>;

type TStaticFormEngineComponentProps = {};

type TFormEngineComponentProps = TConfigurableFormEngineComponentProps & TStaticFormEngineComponentProps & React.HTMLAttributes<HTMLDivElement>;

function getDefaultProps(): TConfigurableFormEngineComponentProps {
    return {
        configJSON: {
            fields: {
                name: {
                    type: 'input',
                    label: 'Nom',
                    validationRules: [{ type: 'required' }],
                },
                email: {
                    type: 'input',
                    label: 'Email',
                    validationRules: [{ type: 'required' }, { type: 'email' }],
                    props: { type: 'email' },
                },
            },
            layout: {
                structure: [
                    {
                        rowLayoutType: 'ALWAYS_1_SLOT',
                        items: ['name', 'email'],
                        itemsPerRow: 1,
                    },
                ],
            },
            behavior: {
                initiallyHiddenFields: [],
                visibilityRules: [],
                computedFields: [],
                defaultValues: {},
            },
        }
    };
}

const FormEngineComponent = React.forwardRef<HTMLDivElement, TFormEngineComponentProps>(
    ({ className, configJSON, ...props }, ref) => {

        // Parse la config JSON
        // const parsedConfig = getObjectFromStringifiedJson<any>(configJSON);
        const parsedConfig = configJSON;

        console.log('dessi',{
            parsedConfig,
            length: Object.keys(parsedConfig).length,
            configJSON,
        });
        if(! Object.keys(parsedConfig).length) {
            return <div
                ref={ref}
                className={className || ''}
                {...props}
            >
                <p>Erreur dans la configuration JSON du formulaire</p>
            </div>;
        }

        // Handler de soumission
        const handleSubmit = (data: any) => {
            console.log('📋 Form submitted:', data);
            alert('Formulaire soumis ! Voir la console pour les données.');
        };

        return <div
            ref={ref}
            className={className}
            {...props}
        >
            <FormEngine
                fields={parsedConfig.fields || {}}
                layout={parsedConfig.layout || { structure: [] }}
                behavior={parsedConfig.behavior || {
                    initiallyHiddenFields: [],
                    visibilityRules: [],
                    computedFields: [],
                    defaultValues: {},
                    onSubmit: handleSubmit,
                }}
                onSubmit={handleSubmit}
            />
        </div>;
    }
);

FormEngineComponent.displayName = 'FormEngineComponent';


export {
    FormEngineComponent,
    getDefaultProps,
    ConfigurableFormEngineComponentPropsSchema,
    type TConfigurableFormEngineComponentProps,
    type TStaticFormEngineComponentProps,
    type TFormEngineComponentProps,
};

