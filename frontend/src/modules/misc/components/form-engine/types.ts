import { type FieldValues, type Path, } from "react-hook-form";
import { type TValidationRule } from "./types/validation.types";
import { type LogicRule } from "./logic";


type TFormEngineProps<TFormValues extends FieldValues> = {
    onSubmit: (data: TFormValues) => void;
    fields: Record<keyof TFormValues, TFormEngineItem<TFormValues[keyof TFormValues]>>;
    layout: TFormLayout<TFormValues>;
    behavior: TBehavior<TFormValues>;
}

type TIfVisible<EFormItemNames> = (fieldName: keyof EFormItemNames) => (keyof EFormItemNames)[];

type TFormLayout<EFormItemNames> = {
    structure: TStructuredRow<EFormItemNames>[];
}

type TStructuredRow<EFormItemNames> = {
    itemsPerRow?: number,// ( containerWidth: number ) => number,
    rowLayoutType: TRowLayoutTypes,
    items: (keyof EFormItemNames)[],
}

type TRowLayoutTypes = 'FROM_4_SLOTS_TO_2_SLOTS_TO_1_SLOT' | 'FROM_4_SLOTS_TO_3_SLOTS_TO_2_SLOTS_TO_1_SLOT' | 'FROM_3_SLOTS_TO_2_SLOTS_TO_1_SLOT' | 'FROM_2_SLOTS_TO_1_SLOT' | 'ALWAYS_1_SLOT';

type TFormEngineItem<TFormValue extends FieldValues[keyof FieldValues]> = {
    type: 'input' | 'textarea' | 'select' | 'multiSelect' | 'file' | 'custom';
    label?: string;
    validationRules?: TValidationRule<TFormValue>[];
    props?: any;
    render?: () => React.ReactNode;
    renderResult?: () => React.ReactNode;
}

type TBehavior<TFormValues extends FieldValues> = {
    initiallyHiddenFields: (keyof TFormValues)[];
    visibilityRules: {
        field: keyof TFormValues;
        condition: LogicRule<TFormValues> | ((values: TFormValues) => boolean);
        dependencies: Path<TFormValues>[];
    }[];
    computedFields: {
        field: keyof TFormValues;
        compute: (values: TFormValues) => unknown;
        dependencies: Path<TFormValues>[];
    }[];
    onSubmit: ((values: TFormValues) => void) | string;
    defaultValues: Partial<TFormValues>;
}


export {
    type TFormEngineProps,
    type TIfVisible,
    type TFormLayout,
    type TStructuredRow,
    type TRowLayoutTypes,
    type TFormEngineItem,
    type TBehavior,
};
