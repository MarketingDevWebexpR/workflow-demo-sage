import { Schema, model, Document } from 'mongoose';

// Interface TypeScript pour le workflow
export interface IWorkflow extends Document {
	title: string;
	description?: string;
	fragmentId?: string;
	isEnabled: boolean;
	workflowXML: string;
	preferences?: {
		zoom?: number;
		panX?: number;
		panY?: number;
	};
	createdAt: Date;
	updatedAt: Date;
	createdBy?: {
		id: string;
		email: string;
		displayName: string;
	};
}

// Schéma Mongoose
const WorkflowSchema = new Schema<IWorkflow>({
	title: {
		type: String,
		required: true,
		trim: true,
		maxlength: 255,
	},
	description: {
		type: String,
		trim: true,
	},
	fragmentId: {
		type: String,
		trim: true,
	},
	isEnabled: {
		type: Boolean,
		default: true,
	},
	workflowXML: {
		type: String,
		required: true,
	},
	preferences: {
		zoom: { type: Number, default: 1 },
		panX: { type: Number, default: 0 },
		panY: { type: Number, default: 0 },
	},
	createdBy: {
		id: { type: String },
		email: { type: String },
		displayName: { type: String },
	},
}, {
	timestamps: true, // Ajoute automatiquement createdAt et updatedAt
});

// Exporter le modèle
export const Workflow = model<IWorkflow>('Workflow', WorkflowSchema);

