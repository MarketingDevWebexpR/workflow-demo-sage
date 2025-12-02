import React from "react";
import { type TFormEngineItem } from "./types";
import { InputField } from "../../../../components/ui/form/controlled-fields/input-field/input-field";
import { TextareaField } from "../../../../components/ui/form/controlled-fields/textarea-field/textarea-field";
import { SelectField } from "../../../../components/ui/form/controlled-fields/select-field/select-field";
import { MultiSelectField } from "../../../../components/ui/form/controlled-fields/multiselect-field/multiselect-field";
import { FileFieldControlled } from "../../../../components/ui/form/controlled-fields/file-field/file-field";


const formEngineItems: Record<
    Exclude<TFormEngineItem<unknown>['type'], 'custom'>,
    React.ComponentType<any>
> = {
    input: InputField,
    textarea: TextareaField,
    select: SelectField,
    multiSelect: MultiSelectField,
    file: FileFieldControlled,
};


export {
    formEngineItems,
};
