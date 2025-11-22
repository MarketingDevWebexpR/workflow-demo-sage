import { type TWorkflowItem } from "../models/workflow-item.model";
import { type TStaticDataCrudActionInterfaces } from "../../../utils/context.utils";
import WorkflowItemServices from "../services/workflow-item.services";


type TWorkflowItemAction = TStaticDataCrudActionInterfaces<"workflow_item", TWorkflowItem, typeof WorkflowItemServices>;


// Actions optimistes
type TCreateWorkflowItemOptimisticAction = {
    type: 'CREATE_WORKFLOW_ITEM_OPTIMISTIC';
    payload: Omit<TWorkflowItem, 'Id' | 'Created' | 'Modified'>;
};

type TUpdateWorkflowItemOptimisticAction = {
    type: 'UPDATE_WORKFLOW_ITEM_OPTIMISTIC';
    payload: TWorkflowItem;
};


// Actions pour le module Workflow Automation

type TSetWorkflowXCoefficientAction = {
    type: 'SET_WORKFLOW_X_COEFFICIENT';
    payload: number;
};

type TSetWorkflowYCoefficientAction = {
    type: 'SET_WORKFLOW_Y_COEFFICIENT';
    payload: number;
};

type TSetWorkflowXAxisThicknessAction = {
    type: 'SET_WORKFLOW_X_AXIS_THICKNESS';
    payload: number;
};

type TSetWorkflowYAxisThicknessAction = {
    type: 'SET_WORKFLOW_Y_AXIS_THICKNESS';
    payload: number;
};

type TSetWorkflowConnectorThicknessAction = {
    type: 'SET_WORKFLOW_CONNECTOR_THICKNESS';
    payload: number;
};

type TSetWorkflowArrowPointerThicknessAction = {
    type: 'SET_WORKFLOW_ARROW_POINTER_THICKNESS';
    payload: number;
};

type TSetWorkflowElementWidthAction = {
    type: 'SET_WORKFLOW_ELEMENT_WIDTH';
    payload: number;
};

type TSetWorkflowElementHeightAction = {
    type: 'SET_WORKFLOW_ELEMENT_HEIGHT';
    payload: number;
};

type TSetWorkflowConnectorRadiusAction = {
    type: 'SET_WORKFLOW_CONNECTOR_RADIUS';
    payload: number;
};

// Actions pour le designer de workflow
type TSetSelectedPlaceholderIdAction = {
    type: 'SET_SELECTED_PLACEHOLDER_ID';
    payload: string | null;
};

type TSetHoveredWorkflowElementIdAction = {
    type: 'SET_HOVERED_WORKFLOW_ELEMENT_ID';
    payload: string | null;
};

type TSetEditedWorkflowElementIdAction = {
    type: 'SET_EDITED_WORKFLOW_ELEMENT_ID';
    payload: string | null;
};

export type TWorkflowAutomationModuleAction =
    | TWorkflowItemAction
    | TCreateWorkflowItemOptimisticAction
    | TUpdateWorkflowItemOptimisticAction
    | TSetWorkflowXCoefficientAction
    | TSetWorkflowYCoefficientAction
    | TSetWorkflowXAxisThicknessAction
    | TSetWorkflowYAxisThicknessAction
    | TSetWorkflowConnectorThicknessAction
    | TSetWorkflowArrowPointerThicknessAction
    | TSetWorkflowElementWidthAction
    | TSetWorkflowElementHeightAction
    | TSetWorkflowConnectorRadiusAction
    | TSetSelectedPlaceholderIdAction
    | TSetHoveredWorkflowElementIdAction
    | TSetEditedWorkflowElementIdAction;
