import { v4 as uuidv4 } from 'uuid';


export function getAtomicWorkflowText(): string {

    const placeholderId = `PLACEHOLDER_${uuidv4()}`;
    const workflowStarted = 'Workflow started';
    const workflowCompleted = 'Workflow completed';
    const firstStep = 'First step';

    return `
<workflow>
    <boundary
        id="BOUNDARY_START_WORKFLOW"
        title="${workflowStarted}"
    />

    <placeholder
        id="${placeholderId}"
        title="${firstStep}"
    />

    <boundary
        id="BOUNDARY_END_WORKFLOW"
        title="${workflowCompleted}"
    />
</workflow>
`;
}
