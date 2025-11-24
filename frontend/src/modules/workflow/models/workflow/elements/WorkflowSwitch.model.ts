// @@ models
import WorkflowItem, { type IWorkflowItemData } from '../WorkflowItem.model';


export interface IWorkflowSwitchData {
    optionId: string;
    defineSwitchValue?: () => void,
}

export type TWorkflowSwitchData = IWorkflowItemData & IWorkflowSwitchData;

export default class WorkflowSwitch extends WorkflowItem {
    static __name = 'WorkflowSwitch';

    public optionId: string;
    public defineSwitchValue: IWorkflowSwitchData['defineSwitchValue'];
    private value: boolean = false;

    constructor( props: TWorkflowSwitchData ) {

        super( props );

        this.optionId = props.optionId;
        this.defineSwitchValue = props.defineSwitchValue || (() => {
            console.log('defineSwitchValue', this.id);
            this.value = true;
        });
    }

    setSwitchValue( preDefinedSwitchValues?: { id: string, value: boolean, hasBeenUsed?: boolean, }[] ): void {

        if( preDefinedSwitchValues ) {

            const preDefinedSwitchValue = preDefinedSwitchValues.find( ({ id, hasBeenUsed }) => {

                return id === this.id && ! hasBeenUsed;
            });

            if( preDefinedSwitchValue ) {

                preDefinedSwitchValue.hasBeenUsed = true;

                this.value = preDefinedSwitchValue.value;
                return;
            }
        }

        this.defineSwitchValue?.();
    }

    // defineSwitchValue() {
    //     this.value = true;
    // }

    getSwitchValue(): boolean {

        return this.value;
    }
}

Object.defineProperty( window, 'WorkflowSwitch', { value: WorkflowSwitch });
