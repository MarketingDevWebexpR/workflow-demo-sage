import { Schema, model, Document } from 'mongoose';

// Interface TypeScript pour le workflow (format compatible SharePoint)
export interface IWorkflow extends Document {
	Id: string; // L'_id de MongoDB sera mappé sur Id
	Title: string;
	Description?: string;
	FragmentId?: string;
	IsEnabled: number; // 0 ou 1 pour compatibilité SharePoint
	WorkflowText: string;
	Preferences?: string; // JSON stringifié des préférences d'affichage
	Created?: Date;
	Modified?: Date;
	createdAt: Date;
	updatedAt: Date;
}

// Schéma Mongoose avec noms de champs compatibles SharePoint
const WorkflowSchema = new Schema<IWorkflow>({
	Title: {
		type: String,
		required: true,
		trim: true,
		maxlength: 255,
	},
	Description: {
		type: String,
		trim: true,
	},
	FragmentId: {
		type: String,
		trim: true,
		default: 'DEFAULT',
	},
	IsEnabled: {
		type: Number,
		default: 0, // 0 = désactivé, 1 = activé
		enum: [0, 1],
	},
	WorkflowText: {
		type: String,
		required: true,
	},
	Preferences: {
		type: String, // JSON stringifié
		default: JSON.stringify({
			xCoefficient: 200,
			yCoefficient: 30,
			xAxisThickness: 2,
			yAxisThickness: 2,
			elementWidth: 12,
			elementHeight: 12,
			connectorThickness: 2,
			connectorRadius: 15,
			arrowPointerThickness: 8,
			showIndexes: true,
		}),
	},
}, {
	timestamps: true, // Ajoute automatiquement createdAt et updatedAt
});

// Ajouter des champs virtuels pour compatibilité
WorkflowSchema.virtual('Id').get(function() {
	return this._id.toString();
});

WorkflowSchema.virtual('Created').get(function() {
	return this.createdAt;
});

WorkflowSchema.virtual('Modified').get(function() {
	return this.updatedAt;
});

// S'assurer que les champs virtuels sont inclus dans JSON
WorkflowSchema.set('toJSON', {
	virtuals: true,
	transform: function(doc, ret: any) {
		ret.Id = ret._id.toString();
		ret.Created = ret.createdAt;
		ret.Modified = ret.updatedAt;
		delete ret._id;
		delete ret.__v;
		return ret;
	}
});

// Exporter le modèle
export const Workflow = model<IWorkflow>('Workflow', WorkflowSchema);

