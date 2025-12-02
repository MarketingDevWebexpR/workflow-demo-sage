// import { zodResolver } from "@hookform/resolvers/zod";
// import { type FieldValues, useForm, type UseFormReturn } from "react-hook-form";
// import useHiddenFields from "../../../../../hooks/use-hidden-fields";
// import { z } from "zod";


// type TUseFormEngineProps<TFormValues extends FieldValues> = {
//     schema: z.ZodSchema<TFormValues>;
// }

// type TUseFormEngineReturnType<TFormValues extends FieldValues> = {
//     form: UseFormReturn<TFormValues>;
//     hiddenFields: ReturnType<typeof useHiddenFields<keyof TFormValues>>;
// }

// const useFormEngine = <TFormValues extends FieldValues>({
//     schema,
// }: TUseFormEngineProps<TFormValues>): TUseFormEngineReturnType<TFormValues> => {










//     // const defaultValues = selectedResponse ? getObjectFromStringifiedJson<TQuestionnaireFormValues>(selectedResponse.FormValues) : {} as any;

//     // const form = useForm<TQuestionnaireFormValues>({
//     //     defaultValues,
//     // });

//     // // Réinitialiser le formulaire quand le contrat change
//     // useEffect(() => {
//     //     form.reset(defaultValues);
//     // }, [selectedContract?.Id]);









//     const form = useForm<TFormValues>({
//         resolver: zodResolver(schema),
//     });

//     const hiddenFields = useHiddenFields<keyof TFormValues>([]);

//     return {
//         form,
//         hiddenFields,
//     };

// }

// export {
//     useFormEngine,
// };
