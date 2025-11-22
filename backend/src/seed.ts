import mongoose from 'mongoose';
import { Workflow } from './models/Workflow.model';

// Exemples de workflows simples pour tester
const sampleWorkflows = [
  {
    title: "Workflow de test simple",
    description: "Un workflow basique pour valider l'API",
    isEnabled: true,
    workflowXML: `<workflow>
  <boundary id="START" title="Début" />
  <action id="INIT" title="Initialiser" />
  <status id="PENDING" title="En attente" />
  <boundary id="END" title="Fin" />
</workflow>`,
    preferences: {
      zoom: 1,
      panX: 0,
      panY: 0,
    },
    createdBy: {
      id: "user-1",
      email: "jordan@example.com",
      displayName: "Jordan Caron",
    },
  },
  {
    title: "Processus d'approbation",
    description: "Workflow avec une bifurcation simple",
    isEnabled: true,
    workflowXML: `<workflow>
  <boundary id="START" title="Début" />
  <action id="SUBMIT" title="Soumettre la demande" />
  <status id="AWAITING_APPROVAL" title="En attente d'approbation" />
  <switch id="IS_APPROVED" title="Approuvé ?">
    <yes>
      <action id="APPROVE" title="Approuver" />
      <status id="APPROVED" title="Approuvé" />
    </yes>
    <no>
      <action id="REJECT" title="Rejeter" />
      <status id="REJECTED" title="Rejeté" />
    </no>
  </switch>
  <boundary id="END" title="Fin" />
</workflow>`,
    createdBy: {
      id: "user-1",
      email: "jordan@example.com",
      displayName: "Jordan Caron",
    },
  },
];

async function seed() {
  try {
    // Connexion à MongoDB
    await mongoose.connect('mongodb://root:root@localhost:27017/automation_poc?authSource=admin');
    console.log('✅ Connecté à MongoDB');

    // Supprimer les workflows existants (attention en prod !)
    await Workflow.deleteMany({});
    console.log('🗑️  Workflows existants supprimés');

    // Insérer les workflows d'exemple
    const inserted = await Workflow.insertMany(sampleWorkflows);
    console.log(`✅ ${inserted.length} workflows insérés avec succès`);

    // Afficher les IDs
    inserted.forEach((workflow) => {
      console.log(`   - ${workflow.title} (ID: ${workflow._id})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
}

// Lancer le seed
seed();

