import { Schema, model, Document } from 'mongoose';

// Interface TypeScript pour un message
export interface IMessage extends Document {
	Id: string; // L'_id de MongoDB sera mappé sur Id
	WorkflowId: string; // ID du workflow associé
	Role: 'user' | 'assistant' | 'system';
	Content: string; // Contenu du message
	Status: 'pending' | 'streaming' | 'completed' | 'error';
	WorkflowData?: string; // JSON stringifié du workflow généré (si applicable)
	ErrorMessage?: string; // Message d'erreur (si status = error)
	TokensUsed?: number; // Nombre de tokens utilisés (si applicable)
	createdAt: Date;
	updatedAt: Date;
}

// Schéma Mongoose pour les messages
const MessageSchema = new Schema<IMessage>({
	WorkflowId: {
		type: String,
		required: true,
		index: true, // Index pour récupérer rapidement les messages d'un workflow
	},
	Role: {
		type: String,
		required: true,
		enum: ['user', 'assistant', 'system'],
	},
	Content: {
		type: String,
		required: true,
	},
	Status: {
		type: String,
		required: true,
		enum: ['pending', 'streaming', 'completed', 'error'],
		default: 'completed',
	},
	WorkflowData: {
		type: String, // JSON stringifié
		required: false,
	},
	ErrorMessage: {
		type: String,
		required: false,
	},
	TokensUsed: {
		type: Number,
		required: false,
	},
}, {
	timestamps: true, // Ajoute automatiquement createdAt et updatedAt
});

// Champ virtuel pour compatibilité
MessageSchema.virtual('Id').get(function() {
	return this._id.toString();
});

// S'assurer que les champs virtuels sont inclus dans JSON
MessageSchema.set('toJSON', {
	virtuals: true,
	transform: function(doc, ret: any) {
		ret.Id = ret._id.toString();
		delete ret._id;
		delete ret.__v;
		return ret;
	}
});

// Exporter le modèle
export const Message = model<IMessage>('Message', MessageSchema);

