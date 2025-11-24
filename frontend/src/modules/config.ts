import { type LucideProps } from "lucide-react";
import React from "react";
import { type TPage, type TPageComponent } from "./view/models/page.model";
import { type TModuleId } from "./modules-map";


export const componentCategories = [
    {
        id: 'layout',
        title: 'Layout',
        description: 'Basic components to organize and align content.',
    },
    {
        id: 'basic',
        title: 'Basic',
        description: 'Basic components used in most interfaces.',
    },
    {
        id: 'advanced',
        title: 'Ready-to-use features',
        description: 'Ready-to-use components that can be used in any project.',
    },
    {
        id: 'specific',
        title: 'Other',
        description: 'Project-specific or legacy components.',
    },
] as const;

const _componentCategoryIds = componentCategories.map(componentCategory => componentCategory.id);

type TComponentCategoryId = typeof _componentCategoryIds[number];

export interface IModuleComponent {
    titleKey: string,
    descriptionKey: string,
    Icon: React.ComponentType<LucideProps>,
    Component: React.ComponentType<any>,
    // Component: React.ForwardRefExoticComponent<
    //     React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>
    // >,
    PropsForm?: React.ComponentType<any>,
    categoryId: TComponentCategoryId,
    requirement?: {
        title: string,
        description: string,
        execute: ({
            sp,
            editedPage,
            pageContext,
        }: {
            sp: any,
            editedPage: TPage,
            pageContext: any,//TPageStoreState,
        }) => Promise<boolean>,
    };
    getLayerIds?: (pageComponent: TPageComponent) => { [key: string]: { id: string, title: string } },
    getDefaultProps?: () => Record<string, any>,
    keywords: string[],
}

export type IModuleFragment = {
    id: string,
    Icon: React.ComponentType<LucideProps>,
    titleKey: string,
    DataTable: React.ComponentType,
    DataTableOverride?: React.ComponentType,
    structure?: {
        type: 'list' | 'library',
        title: string,
        // fields: TModuleFragmentField[],
    },
    hidden?: boolean,
    dynamic?: boolean,
    installPriority?: number,
}

export interface IModuleConfig {
    id: TModuleId,
    titleKey: string,
    Icon: React.ComponentType<LucideProps>,
    fragments: IModuleFragment[],
    contextProvider: React.ComponentType | null,
    HeaderOverride?: React.ComponentType,
    components: IModuleComponent[],
    hidden?: boolean,
    installPriority?: number,
    isSystemModule?: boolean,
    isInstallationRestrictedToWebexprEnvironment?: boolean,
    translations: {
        fr: any,
        en: any,
    },
    marker: 'end',
}


// interface IModuleFragmentField {
//     title: string,
//     type: TSPFieldType,
// }

// interface ITextField extends IModuleFragmentField {
//     type: 'Text',
//     options?: AddTextProps & IFieldCreationProperties,
// }

// interface INoteField extends IModuleFragmentField {
//     type: 'Note',
//     options?: AddMultilineTextProps & IFieldCreationProperties & { RichText: false }, // RichText systématiquement à false, sinon ça fout la merde
// }

// interface IUrlField extends IModuleFragmentField {
//     type: 'URL',
//     options?: AddUrlProps & IFieldCreationProperties,
// }

// interface INumberField extends IModuleFragmentField {
//     type: 'Number',
//     options?: AddNumberProps & IFieldCreationProperties,
// }

// interface IDateTimeField extends IModuleFragmentField {
//     type: 'DateTime',
//     options?: AddDateTimeProps & IFieldCreationProperties,
// }

// type ILookupFieldBase = IModuleFragmentField & {
//     options?: IAddFieldProperties,
//     findLookupListGuid: (ctx: Record<string, any>, options: {
//         sp: SPFI,
//         moduleConfigs: IModuleConfig[],
//     }) => Promise<IListInfo['Id']>,
// }

// // Single-value Lookup field (indexed: true is automatic)
// type ILookupField = ILookupFieldBase & {
//     type: 'Lookup',
//     deleteBehavior: typeof relationshipDeleteBehavior[keyof typeof relationshipDeleteBehavior],
// }

// // Multi-value Lookup field (allowMultipleValues: true, indexed: false, deleteBehavior: NONE are automatic)
// type ILookupMultiField = ILookupFieldBase & {
//     type: 'LookupMulti',
// }

// interface IUserField extends IModuleFragmentField {
//     type: 'User',
//     options?: AddUserProps & IFieldCreationProperties,
// }

// export type TModuleFragmentField = ITextField | INoteField | IUrlField | INumberField | IDateTimeField | ILookupField | IUserField | ILookupMultiField;
