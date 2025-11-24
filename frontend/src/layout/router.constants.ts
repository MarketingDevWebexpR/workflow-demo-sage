const paths = {
    automation: `/`,
    workflowDesigner: `/workflow/:workflowId`,
    workflowIhm: `/workflow/:workflowId/:stepId/ihm`,
    '*': '*',
} as const;


export {
    paths,
};
