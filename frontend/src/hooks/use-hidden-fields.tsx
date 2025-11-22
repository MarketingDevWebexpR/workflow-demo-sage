// @@ react
import { useState } from 'react';


interface IFieldVisibilityRule<EFieldNames> {
    name: EFieldNames,
    isVisible: boolean,
}

interface IUseHiddenFieldsReturnType<EFieldNames> {
    hiddenFields: EFieldNames[],
    setHiddenFields: React.Dispatch<React.SetStateAction<EFieldNames[]>>,
    isVisible: ( fieldName: EFieldNames ) => boolean,
    handleFieldsVisibility: ( fieldsVisibilityRules: (IFieldVisibilityRule<EFieldNames>)[] ) => () => void,
}

export default function useHiddenFields<EFieldNames>(
    initialHiddenFieldsState: EFieldNames[],
): IUseHiddenFieldsReturnType<EFieldNames> {

    const [ hiddenFields, setHiddenFields ] = useState<EFieldNames[]>( initialHiddenFieldsState );

    function handleFieldsVisibility(
        fieldsVisibilityRules: (IFieldVisibilityRule<EFieldNames>)[]
    ): () => void {

        return function() {

            const hiddenFieldsCopy = [ ...hiddenFields, ];

            for( const { name, isVisible } of fieldsVisibilityRules ) {

                const index = hiddenFieldsCopy.indexOf( name );

                if( isVisible && index > -1 ) {

                    hiddenFieldsCopy.splice( index, 1 );
                } else if( ! isVisible && index === -1 ) {
    
                    hiddenFieldsCopy.push( name );
                }
            }

            setHiddenFields( hiddenFieldsCopy );
        };
    }

    function isVisible(
        fieldName: EFieldNames,
    ): boolean {
        
        return ! hiddenFields.includes( fieldName );
    }

    return {
        hiddenFields,
        setHiddenFields,
        isVisible,
        handleFieldsVisibility,
    };
}