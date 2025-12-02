const paths = {
    automation: `/`,
    workflowDesigner: `/workflow/:workflowId`,
    workflowIhm: `/workflow/:workflowId/:stepId/ihm`,
    fileUploadTest: `/test/file-upload`,
    '*': '*',
} as const;


export {
    paths,
};
