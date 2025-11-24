import WorkflowItem, { type IWorkflowItemData } from '../WorkflowItem.model';


export interface IWorkflowActionData<_, IFormItemKeyDatas, IFormValues> {
    // usersInCharge: ( keyof typeof EUserTypeKeys )[],
    // renderForm: ( viewType?: keyof typeof EFormViewTypes, customFormFoot?: React.ReactElement ) => React.ReactElement,
    // renderFormResult: ( values: WorkflowActionValues<IFormValues, EFormItemNames>) => React.ReactElement,
    optionId: string;
    peoplePickerFormItemNames: Array< keyof IFormValues >,
    keyDatas: ({
        name: keyof IFormItemKeyDatas,
        fn: ( sp: any, formValues: IFormValues ) => Promise<IFormItemKeyDatas[ keyof IFormItemKeyDatas]>,
    })[],
    // folderDatas: ({
    //     name: keyof IWriteFolderProperties,
    //     fn: ( sp: SPFI, formValues: IFormValues ) => Promise<unknown>,
    // })[];
    fileFormItemNames: Partial<Record< keyof IFormValues, string>>;
}

export type TWorkflowActionData<
    EFormItemNames, IFormItemKeyDatas, IFormValues
> = IWorkflowItemData & IWorkflowActionData< EFormItemNames, IFormItemKeyDatas, IFormValues>;

export default class WorkflowAction<EFormItemNames, IFormItemKeyDatas, IFormValues> extends WorkflowItem {

    static __name = 'WorkflowAction';

    // public usersInCharge?: ( keyof typeof EUserTypeKeys )[];
    // public renderForm?: (viewType?: keyof typeof EFormViewTypes, customFormFoot?: React.ReactElement) => React.ReactElement;
    // public renderFormResult?: (...args: any[]) => React.ReactElement;
    public optionId: string;
    public peoplePickerFormItemNames?: unknown[];
    public keyDatas?: ({
        name: keyof IFormItemKeyDatas,
        fn: ( sp: any, formValues: IFormValues ) => Promise<IFormItemKeyDatas[keyof IFormItemKeyDatas]>,
    })[];
    // public folderDatas?: ({
    //     name: keyof IWriteFolderProperties,
    //     fn: ( sp: SPFI, formValues: IFormValues ) => Promise<any>,
    // })[];
    public fileFormItemNames: Partial<Record< keyof IFormValues, string>>;

    constructor( props: TWorkflowActionData<EFormItemNames, IFormItemKeyDatas, IFormValues> ) {

        super( props );

        // this.usersInCharge = props.usersInCharge;
        // this.renderForm = props.renderForm;
        // this.renderFormResult = props.renderFormResult;
        this.optionId = props.optionId;
        this.peoplePickerFormItemNames = props.peoplePickerFormItemNames;
        this.keyDatas = props.keyDatas;
        // this.folderDatas = props.folderDatas;
        this.fileFormItemNames = props.fileFormItemNames;
    }

    extractFiles( formValues: IFormValues ): {
        name: unknown,
        file: File | null,
    }[] {

        const { fileFormItemNames } = this;

        const documents = Object.keys( fileFormItemNames ).map( name => {

            return {
                name: name as keyof EFormItemNames,
                file: formValues[ name as keyof IFormValues ] as unknown as File ?? null,
            };
        });

        return documents;
    }
}

Object.defineProperty( window, 'WorkflowAction', { value: WorkflowAction });
