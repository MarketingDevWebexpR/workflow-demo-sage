import { type InferFormTypeFromConfig } from "../utils/infer-form-type";
import { studentFormBaseConfig } from "./config-parts/config.base";


type TQuestionnaireFormValues = InferFormTypeFromConfig<typeof studentFormBaseConfig>;


export {
    type TQuestionnaireFormValues,
};

