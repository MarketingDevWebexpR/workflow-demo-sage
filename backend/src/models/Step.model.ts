import mongoose, { Schema, Document } from 'mongoose';


export interface IStep extends Document {
	executionId: mongoose.Types.ObjectId;
	workflowItemId: string;
	keyDatas: string;
	loopTurn: number | null;
	createdAt: Date;
	updatedAt: Date;
	
	getKeyDatas(): Record<string, any>;
	setKeyDatas(keyDatas: Record<string, any>): void;
	getDocuments(): any[];
	setDocuments(documents: any[]): void;
}

const StepSchema = new Schema<IStep>(
	{
		executionId: {
			type: Schema.Types.ObjectId,
			ref: 'Execution',
			required: true,
			index: true,
		},
		workflowItemId: {
			type: String,
			required: true,
			index: true,
		},
		keyDatas: {
			type: String,
			default: '{}',
		},
		loopTurn: {
			type: Number,
			default: null,
		},
	},
	{
		timestamps: true,
		collection: 'steps',
	}
);

StepSchema.index({ executionId: 1, createdAt: 1 });
StepSchema.index({ workflowItemId: 1 });

StepSchema.methods.getKeyDatas = function (): Record<string, any> {
	try {
		return JSON.parse(this.keyDatas);
	} catch {
		return {};
	}
};

StepSchema.methods.setKeyDatas = function (keyDatas: Record<string, any>): void {
	this.keyDatas = JSON.stringify(keyDatas);
};

StepSchema.methods.getDocuments = function (): any[] {
	try {
		return JSON.parse(this.documents);
	} catch {
		return [];
	}
};

StepSchema.methods.setDocuments = function (documents: any[]): void {
	this.documents = JSON.stringify(documents);
};

const Step = mongoose.model<IStep>('Step', StepSchema);

export default Step;

