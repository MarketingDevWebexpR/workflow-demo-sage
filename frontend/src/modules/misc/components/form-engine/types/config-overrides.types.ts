import { type FieldValues, type Path } from "react-hook-form";
import { type TFormEngineItem, type TStructuredRow } from "../types";
import { type LogicRule } from "../logic";


type TConfigOverrides<TFormValues extends FieldValues> = {
    fields?: Partial<Record<keyof TFormValues, Partial<TFormEngineItem<TFormValues[keyof TFormValues]>>>>;

    layout?: {
        structure?: TStructuredRow<TFormValues>[];
    };

    behavior?: {
        initiallyHiddenFields?: (keyof TFormValues)[];
        visibilityRules?: Array<{
            field: keyof TFormValues;
            condition: LogicRule<TFormValues> | ((values: TFormValues) => boolean);
            dependencies: Path<TFormValues>[];
        }>;
        computedFields?: Array<{
            field: keyof TFormValues;
            compute: (values: TFormValues) => unknown;
            dependencies: Path<TFormValues>[];
        }>;
        onSubmit?: ((values: TFormValues) => void) | string;
        defaultValues?: Partial<TFormValues>;
    };
};


export {
    type TConfigOverrides,
};

