import { Schema, model, Document } from 'mongoose';

// Interface TypeScript pour une vue IHM d'étape de workflow
export interface IView extends Document {
	Id: string; // L'_id de MongoDB sera mappé sur Id
	workflowId: string; // Référence au workflow parent
	stepId: string; // ID de l'étape (ACTION_123, IF_456, etc.)
	components: string; // JSON stringifié des composants IHM
	createdAt: Date;
	updatedAt: Date;
}

// Schéma Mongoose
const ViewSchema = new Schema<IView>({
	workflowId: {
		type: String,
		required: true,
		index: true, // Index pour les requêtes par workflowId
	},
	stepId: {
		type: String,
		required: true,
	},
	components: {
		type: String,
		required: true,
		default: '[]', // Tableau vide par défaut
	},
}, {
	timestamps: true, // Ajoute automatiquement createdAt et updatedAt
});

// Index composé pour recherche rapide par (workflowId, stepId)
ViewSchema.index({ workflowId: 1, stepId: 1 }, { unique: true });

// Champ virtuel pour compatibilité
ViewSchema.virtual('Id').get(function() {
	return this._id.toString();
});

// S'assurer que les champs virtuels sont inclus dans JSON
ViewSchema.set('toJSON', {
	virtuals: true,
	transform: function(doc, ret: any) {
		ret.Id = ret._id.toString();
		delete ret._id;
		delete ret.__v;
		return ret;
	}
});

// Exporter le modèle
export const View = model<IView>('View', ViewSchema);
