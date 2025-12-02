import { type FieldValues } from "react-hook-form";

type TValidationRule<TFormValue extends FieldValues[keyof FieldValues]> =
    | { type: 'required'; message?: string }
    | { type: 'maxItems'; max: number; message?: string }
    | { type: 'minItems'; min: number; message?: string }
    | { type: 'maxLength'; max: number; message?: string }
    | { type: 'minLength'; min: number; message?: string }
    | { type: 'email'; message?: string }
    | { type: 'url'; message?: string }
    | { type: 'dateAfter'; afterField: string; message?: string }
    | { type: 'dateBefore'; beforeField: string; message?: string }
    | { type: 'custom'; validator: (value: TFormValue) => boolean | string };

const DEFAULT_MESSAGES = {
    required: 'Ce champ est requis',
    maxItems: (max: number) => `Vous pouvez sélectionner maximum ${max} élément${max > 1 ? 's' : ''}`,
    minItems: (min: number) => `Vous devez sélectionner au moins ${min} élément${min > 1 ? 's' : ''}`,
    maxLength: (max: number) => `Maximum ${max} caractère${max > 1 ? 's' : ''}`,
    minLength: (min: number) => `Minimum ${min} caractère${min > 1 ? 's' : ''}`,
    email: 'Email invalide',
    url: 'URL invalide',
    dateAfter: (field: string) => `La date doit être après ${field}`,
    dateBefore: (field: string) => `La date doit être avant ${field}`,
};


export {
    type TValidationRule,
    DEFAULT_MESSAGES,
};

