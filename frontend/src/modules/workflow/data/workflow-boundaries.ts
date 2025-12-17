// @@ models
import { MODULE_IDS } from '../../modules-map';
import type { PathsWithNoParams } from '../../../../i18n/lib/init';
import WorkflowBoundary from '../models/workflow/elements/WorkflowBoundary.model';


export function start(t: (key: PathsWithNoParams) => string): WorkflowBoundary {

    return new WorkflowBoundary({
        id: 'WORKFLOW_START_BOUNDARY',
        title: t(`modules.${MODULE_IDS.WORKFLOW_AUTOMATION}.boundaries.workflowStarted`),
    });
}

export function end(t: (key: PathsWithNoParams) => string): WorkflowBoundary {

    return new WorkflowBoundary({
        id: 'WORKFLOW_END_BOUNDARY',
        title: t(`modules.${MODULE_IDS.WORKFLOW_AUTOMATION}.boundaries.workflowCompleted`),
    });
}

