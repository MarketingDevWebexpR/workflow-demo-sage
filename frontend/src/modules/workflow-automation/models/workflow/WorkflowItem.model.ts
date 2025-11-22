// @@ models
declare global {
    interface Window {
        WorkflowAction: ({ __name: string } & (new (...args: any[]) => any));
        WorkflowStatus: ({ __name: string } & (new (...args: any[]) => any));
        WorkflowSwitch: ({ __name: string } & (new (...args: any[]) => any));
        WorkflowBoundary: ({ __name: string } & (new (...args: any[]) => any));
        WorkflowPlaceholder: ({ __name: string } & (new (...args: any[]) => any));
    }
}


export interface IWorkflowItemType {
    id: string,
    title: string,
}

export interface IWorkflowItemData {
    id: string,
    title: string,
    type?: IWorkflowItemType,
    currentLoopTurn?: number,
}

export default class WorkflowItem {

    static __name: string;

    public id: string;
    public title: string;
    public type: IWorkflowItemType;
    public currentLoopTurn: number | null;

    constructor( props: IWorkflowItemData ) {

        this.id = props.id;
        this.title = props.title;
        this.type = this.getType();
        this.currentLoopTurn = props.currentLoopTurn ?? null;
        // ATTENTION: null a son importance, ne pas remplacer par undefined
        // => null est utilisé par les list item SharePoint lorsque la valeur de la colonne est vide
        // et les comparaisons dans l'applications se font de manière stricte,
        // or null est strictement différent de undefined
    }

    getType( this: WorkflowItem ): IWorkflowItemType {

        const id = this.constructor.prototype.constructor.__name;
        let title;

        try {
            title = [
                {
                    itemName: window.WorkflowAction.__name,
                    title: 'Étape à compléter',
                },
                {
                    itemName: window.WorkflowStatus.__name,
                    title: 'Changement de statut',
                },
                {
                    itemName: window.WorkflowSwitch.__name,
                    title: 'Bifurcation',
                },
                {
                    itemName: window.WorkflowBoundary.__name,
                    title: 'Frontière',
                },
                {
                    itemName: window.WorkflowPlaceholder.__name,
                    title: 'Placeholder',
                },
                {
                    itemName: 'WorkflowVerticalLineDown',
                    title: `Ligne verticale dans la partie inférieure d'une case`,
                },
                {
                    itemName: 'WorkflowVerticalLineUp',
                    title: `Ligne verticale dans la partie supérieure d'une case`,
                },
                {
                    itemName: 'WorkflowHorizontalLineLeft',
                    title: `Ligne horizontale dans la partie gauche d'une case`,
                },
                {
                    itemName: 'WorkflowHorizontalLineRight',
                    title: `Ligne horizontale dans la partie droite d'une case`,
                },
                {
                    itemName: 'WorkflowUpToLeft',
                    title: '',
                },
                {
                    itemName: 'WorkflowUpToRight',
                    title: '',
                },
                {
                    itemName: 'WorkflowBottomToLeft',
                    title: '',
                },
                {
                    itemName: 'WorkflowYes',
                    title: 'Réponse "Oui" à la bifurcation qui précède cet élément',
                },
                {
                    itemName: 'WorkflowNo',
                    title: 'Réponse "Non" à la bifurcation qui précède cet élément',
                },
            ].find( ({ itemName }) => itemName === id )?.title ?? 'Unknown';
        } catch( error ) {

            console.error(`Type d'item du workflow non implémenté pour "${ id }".`, { error });
        }

        return {
            id,
            title: title ?? 'Unknown',
        };
    }
}
