// @@ map engine
import mapEngine from './mapEngine';

// @@ models
import WorkflowSwitch from '../models/workflow/elements/WorkflowSwitch.model';
import WorkflowStatus from '../models/workflow/elements/WorkflowStatus.model';
import WorkflowAction from '../models/workflow/elements/WorkflowAction.model';
import WorkflowBoundary from '../models/workflow/elements/WorkflowBoundary.model';

// @@ react
import { useEffect, useRef, useState } from 'react';
import { createWorkflowFromText } from '../engine/create-workflow-from-text';

// @@ workflow
// import workflow from '../index';


type TUseWorkflowProps = {
    workflowInfos: ReturnType<typeof createWorkflowFromText> ,
} & {
    folder?: unknown & {
        workflowSwitchValues: { id: string, value: boolean, }[],
        currentWorkflowItemId: string,
        currentLoopTurn: number,
    };
};

export default function useWorkflow({
    workflowInfos,
    folder,
}: TUseWorkflowProps) {

    type WorkflowYieldType = WorkflowAction<unknown, unknown, unknown> | WorkflowStatus | WorkflowSwitch | WorkflowBoundary;
    const workflowRef = useRef<Generator<WorkflowYieldType, void, unknown> | undefined>(undefined);
    const [pathTakenByFolder, setPathTakenByFolder] = useState<(WorkflowAction<unknown, unknown, unknown> | WorkflowStatus | WorkflowSwitch | WorkflowBoundary)[]>([]);
    const [currentWorkflowItem, setCurrentWorkflowItem] = useState<WorkflowAction<unknown, unknown, unknown> | null>(null);

    useEffect(() => {

        const abortController = new AbortController();
        const switchValues = folder?.workflowSwitchValues?.map(({ id, value, }) => ({ id, value, }));

        workflowRef.current = workflowInfos.generatorFn(folder, switchValues) as Generator<WorkflowYieldType, void, unknown>;

        let isDone: boolean = false;
        let value: WorkflowYieldType | undefined;

        const pathTakenByFolder: WorkflowYieldType[] = [];

        if (folder?.currentWorkflowItemId) {

            const initialNext = workflowRef.current.next();
            value = initialNext.value as WorkflowYieldType | undefined;
            // console.log({ value });
            let y = 0;

            try {
                while (
                    value!.id !== folder.currentWorkflowItemId
                    || value!.currentLoopTurn !== folder.currentLoopTurn
                ) {

                    if (value) {
                        pathTakenByFolder.push(value);
                    }

                    const next = workflowRef.current!.next();
                    isDone = next.done ?? false;
                    value = next.value as WorkflowYieldType | undefined;
                    y++;
                    if (y > 100) {

                        throw new Error('Infinite loop');
                    }
                    // value = workflowRef.current.next().value;
                }
            } catch (error) {
                alert('Infinite loop');
                console.log('value?.currentLoopTurn', value?.currentLoopTurn);
                console.log('folder?.currentLoopTurn', folder?.currentLoopTurn);
                console.log('error', {error});
            }
        } else if (workflowRef.current) {

            const next = workflowRef.current.next();
            isDone = next.done ?? false;
            value = next.value as WorkflowYieldType | undefined;
        }

        // console.log({ isDone, value,})
        setPathTakenByFolder(pathTakenByFolder);

        if (isDone) {

            alert('Workflow is done');
        }

        if (!isDone && value?.id !== currentWorkflowItem?.id) {

            if (sessionStorage.isWaitingUntilProgressBarHasReachedTheEnd) {

                document.addEventListener('TRIGGER_CURRENT_WORKFLOW_ACTION_SIGNAL', () => {

                    setCurrentWorkflowItem(value as WorkflowAction<unknown, unknown, unknown>);
                    delete sessionStorage.isWaitingUntilProgressBarHasReachedTheEnd;
                }, {
                    signal: abortController.signal,
                });
            } else {

                setCurrentWorkflowItem(value as WorkflowAction<unknown, unknown, unknown>);
            }
        } else if (isDone) {

        }

        return () => {

            abortController.abort();
        };
    }, [folder,]);

    // TODO: add switches to the map engine
    console.log('workflowInfos', workflowInfos);
    const calcWorkflowMapPoints = mapEngine(workflowInfos);

    return {
        calcWorkflowMapPoints,
        currentWorkflowItem,
        workflowRef,
        pathTakenByFolder,
    };
}
