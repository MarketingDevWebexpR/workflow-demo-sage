import mongoose, { Schema, Document } from 'mongoose';

/**
 * Structure d'une étape dans WorkflowResume (version légère)
 */
export interface IWorkflowResumeStep {
	stepId: string;
	workflowItemId: string;
	loopTurn: number | null;
}

/**
 * WorkflowResume : array léger des étapes complétées (détail dans Step)
 */
export type IWorkflowResume = IWorkflowResumeStep[];

/**
 * Structure d'une valeur de switch
 */
export interface IWorkflowSwitchValue {
	id: string;
	value: boolean;
}

export interface IExecution extends Document {
	workflowId: mongoose.Types.ObjectId;
	currentWorkflowItemId: string;
	currentLoopTurn: number | null;
	workflowResume: string; // JSON stringifié de IWorkflowResume
	workflowSwitchValues: string; // JSON stringifié de IWorkflowSwitchValue[]
	createdAt: Date;
	updatedAt: Date;
	
	// Méthodes helper
	getWorkflowResume(): IWorkflowResume;
	setWorkflowResume(resume: IWorkflowResume): void;
	getWorkflowSwitchValues(): IWorkflowSwitchValue[];
	setWorkflowSwitchValues(switchValues: IWorkflowSwitchValue[]): void;
}

const ExecutionSchema = new Schema<IExecution>(
	{
		workflowId: {
			type: Schema.Types.ObjectId,
			ref: 'Workflow',
			required: true,
			index: true,
		},
		currentWorkflowItemId: {
			type: String,
			required: true,
		},
		currentLoopTurn: {
			type: Number,
			default: null,
		},
		workflowResume: {
			type: String,
			default: '[]',
		},
		workflowSwitchValues: {
			type: String,
			default: '[]',
		},
	},
	{
		timestamps: true,
		collection: 'executions',
	}
);

ExecutionSchema.index({ workflowId: 1, createdAt: -1 });
ExecutionSchema.index({ currentWorkflowItemId: 1 });

// Méthodes helper pour parser les JSON
ExecutionSchema.methods.getWorkflowResume = function (): IWorkflowResume {
	try {
		return JSON.parse(this.workflowResume);
	} catch {
		return [];
	}
};

ExecutionSchema.methods.setWorkflowResume = function (resume: IWorkflowResume): void {
	this.workflowResume = JSON.stringify(resume);
};

ExecutionSchema.methods.getWorkflowSwitchValues = function (): IWorkflowSwitchValue[] {
	try {
		return JSON.parse(this.workflowSwitchValues);
	} catch {
		return [];
	}
};

ExecutionSchema.methods.setWorkflowSwitchValues = function (switchValues: IWorkflowSwitchValue[]): void {
	this.workflowSwitchValues = JSON.stringify(switchValues);
};

const Execution = mongoose.model<IExecution>('Execution', ExecutionSchema);

export default Execution;

