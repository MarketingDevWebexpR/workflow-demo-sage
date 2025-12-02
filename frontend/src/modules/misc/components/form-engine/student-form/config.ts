import { studentFormBaseConfig } from "./config-parts/config.base";
import { studentFormOverrides } from "./config-parts/config.overrides";
import { mergeFormConfig } from "../utils/config-merger";


const formConfig = mergeFormConfig(studentFormBaseConfig, studentFormOverrides);


export {
    formConfig,
};
