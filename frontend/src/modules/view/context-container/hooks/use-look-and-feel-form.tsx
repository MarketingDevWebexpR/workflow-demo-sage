// import { useEffect, useRef } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { debounce } from "lodash";
// // import { lookAndFeelSchema, type TGlobalSettingsFormData } from "../../models/setting.model";
// // import { DEBOUNCE_PROP } from "../../../hooks/use-props-form";


// export function useLookAndFeelForm({
//     defaultValues,
//     onValuesChange,
// }: {
//     defaultValues?: Partial<TGlobalSettingsFormData>;
//     onValuesChange?: (values: TGlobalSettingsFormData) => void;
// }) {
//     const form = useForm({
//         resolver: zodResolver(lookAndFeelSchema),
//         mode: 'onChange',
//         defaultValues,
//     });

//     const previousValuesRef = useRef<TGlobalSettingsFormData | null>(null);
//     // const pendingDebounceUpdates = useRef<string[]>([]);

//     const updateValues = () => {
//         const currentValues = form.getValues() as TGlobalSettingsFormData;
        
//         console.log('%c Look and Feel - Mise à jour des valeurs. '+ currentValues.theme, 'background-color: seagreen; color: white;');
//         console.log('Mise à jour Look and Feel', { values: currentValues });
        
//         if (onValuesChange) {
//             // console.log('Look and Feel - Appel de onValuesChange', { values: currentValues, pendingDebounceUpdates: pendingDebounceUpdates.current });
//             onValuesChange(currentValues);
//         }
        
//         previousValuesRef.current = currentValues;
//     };


//     const debouncedUpdate = useRef(debounce(() => {
//         console.log('%c Look and Feel - Appel de debouncedUpdate', 'background-color: indianred; color: white;');
//         updateValues();
//     }, 500, {
//         leading: true,
//         trailing: true,
//     }));

//     useEffect(() => {

//         const subscription = form.watch((values, { name }) => {

//             if(!name) {
//                 return;
//             }

//             console.log('Look and Feel - Appel de form.watch '+ values.theme, { name, values });
//             // Vérifier si le champ nécessite un debounce basé sur le schéma Zod
//             let requiresDebounce = false;
                
//             if (name && name in lookAndFeelSchema.shape) {
//                 const fieldSchema = lookAndFeelSchema.shape[name as keyof typeof lookAndFeelSchema.shape];
//                 requiresDebounce = fieldSchema._def.description === DEBOUNCE_PROP;
//             }

//             console.log('Look and Feel - requiresDebounce '+ values.theme + ' ' + requiresDebounce, { name, values });
//             if (requiresDebounce) {
//                 // pendingDebounceUpdates.current.push(name);
//                 debouncedUpdate.current();
//             } else {
//                 updateValues();
//             }
//         });

//         return () => subscription.unsubscribe();
//     }, [form]);

//     return {
//         form,
//         // pendingDebounceUpdates: pendingDebounceUpdates,
//     };
// }
