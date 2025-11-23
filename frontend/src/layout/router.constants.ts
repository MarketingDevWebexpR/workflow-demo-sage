const paths = {
    automation: `/`,
    workflowDesigner: `/workflow/:workflowId`,
    workflowIhm: `/workflow/:workflowId/ihm`,
    '*': '*',
} as const;


export {
    paths,
};
