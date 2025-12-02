import { z, type ZodRawShape, } from "zod";
import { useEffect, useRef, } from "react";
import { getArrayFromStringifiedJson } from "../utils/json.utils";
import { type TPageComponent } from "../modules/view/models/page.model";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { debounce } from "lodash";
import { usePageStore } from "../modules/view/store/page.store";


export const DEBOUNCE_PROP = 'DEBOUNCE_PROP' as const;

export function usePropsForm<
    TSchema extends z.ZodObject<ZodRawShape> | z.ZodEffects<z.ZodObject<ZodRawShape>>,
    TProps extends z.infer<TSchema>
>({
    schema,
    processValues,
}: {
    schema: TSchema,
    processValues?: ({
        previousProcessedValues,
        previousValues,
        values,
    }: {
        previousProcessedValues: TProps,
        previousValues: TProps,
        values: TProps,
    }) => Promise<TProps>,
}) {

    const selectedView = usePageStore(state => state.selected.item);
    const editedComponentId = usePageStore(state => state.editedComponentId);
    const dispatch = usePageStore(state => state.dispatch);

    // Récupérer les composants depuis selected.item (nouvelle approche)
    const currentPageComponents = getArrayFromStringifiedJson<TPageComponent>(selectedView?.Components || '[]');
    const indexOfEditedComponent = currentPageComponents.findIndex(component => component.id === editedComponentId);
    const editedComponent = currentPageComponents.find(component => component.id === editedComponentId);

    const form = useForm({
        resolver: zodResolver(schema),
        mode: 'onChange',
        defaultValues: editedComponent?.props,
    });

    const previousValuesRef = useRef<TProps | null>(editedComponent?.props as TProps);
    const updatedPropsRef = useRef<TProps | null>( null );

    const updateProps = () => {

        if (!editedComponent) {
            alert('Component not found');
            console.log('Component not found', { currentPageComponents, indexOfEditedComponent, editedComponent });
            return;
        }

        const props = {
            ...editedComponent.props,
            ...updatedPropsRef.current,
        } as TProps;

        console.log('%c xyz Mise à jour des props.', 'background-color: seagreen; color: white;');

        editedComponent.props = props;
        editedComponent.updatedAt = Date.now();

        console.log('Mise à jour des props', { props });
        dispatch({
            type: 'SET_EDITED_PAGE_COMPONENTS',
            payload: JSON.stringify(currentPageComponents),
        });
    };
    
    useEffect(() => {

        const debouncedValidate = debounce(() => {
            console.log('%c xyz Appel de debouncedValidate', 'background-color: royalblue; color: white;');

            updateProps();
        }, 500);

        const subscription = form.watch( async (values, x) => {

            // Récupération de la Shape du schéma Zod impliqué dans
            // le changement de valeur.
            let schemaShape = 'shape' in schema
                ? schema.shape // En cas de z.object (le plus courant)
                : schema._def.schema.shape; // En cas de .superRefine (formulaires complexes) 
            
            let requiresDebounce = false;


            // On détermine si le changement de valeur concerne un "sous-champ" 
            // contenu dans un champ de type array. (nom de propriété du style "machin[0].truc")
            const regex = /^([a-zA-Z_$][a-zA-Z0-9_$]*)(\[\d+\])?(?:\.(.+))?$/;
            const match = x.name?.match(regex);
            const [ , prop,, subProp ] = match || [];


            // On détermine si un debounce est nécessaire (champs inputs/rich text/textarea).
            // En l'absence de sous propriété, on est dans le cadre générique.
            if( ! subProp ) {

                const description = schemaShape[x.name as keyof typeof schemaShape]._def.description;
                requiresDebounce = description === DEBOUNCE_PROP;
            }
            // En cas de sous propriété, on est dans le cadre d'un champ de type array.
            else {

                schemaShape = schemaShape[ prop as keyof typeof schemaShape ]._def.type.shape;
                const description = schemaShape[ subProp as keyof typeof schemaShape ]._def.description;
                requiresDebounce = description === DEBOUNCE_PROP;
            }


            // Si une fonction de traitement des valeurs est définie, on l'appelle.
            // C'est le cas pour les traitements de fichiers par exemple.
            if( processValues ) {

                // eslint-disable-next-line
                updatedPropsRef.current = await processValues({
                    previousProcessedValues: updatedPropsRef.current as TProps,
                    previousValues: previousValuesRef.current as TProps,
                    values: values as TProps,
                });
            } else {

                updatedPropsRef.current = values as TProps;
            }

             console.log('penser à corriger ici');
            // eslint-disable-next-line
            previousValuesRef.current = values as TProps;


            // Enfin, on sauvegarde les changements,
            // soit avec un debounce si nécessaire, soit immédiatement.
            if( requiresDebounce ) {
                debouncedValidate();
            } else {
                updateProps();
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return form;
}