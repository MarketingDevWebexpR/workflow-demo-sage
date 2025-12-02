/**
 * Configuration de base du formulaire étudiant VJ2
 *
 * ⚠️ CE FICHIER EST 100% JSON-SERIALIZABLE ET DOIT LE RESTER.
 * AUCUNE fonction, JSX, ou instance Date/File => le custom doit aller
 * dans le fichier config.overrides.tsx
 */
const studentFormBaseConfig = {
    fields: {
        // Fields qui seront overridés avec custom render (section headers)
        academicProfileTitle: {
            type: 'custom' as const,
        },
        professionalProjectTitle: {
            type: 'custom' as const,
        },
        skillsTitle: {
            type: 'custom' as const,
        },
        contactInfoTitle: {
            type: 'custom' as const,
        },
        rgpdComment: {
            type: 'custom' as const,
        },

        // Fields standards
        currentPosition: {
            type: 'input' as const,
            label: 'Quel est votre poste actuel ?',
            validationRules: [{ type: 'required' as const }],
            props: {
                placeholder: 'Votre poste actuel...',
                description: "Si l'intitulé ne correspond pas à votre poste, merci de le modifier",
            },
        },
        degreeLevel: {
            type: 'select' as const,
            label: 'Quel sera le niveau de diplôme obtenu à l\'issue du contrat en cours ?',
            validationRules: [{ type: 'required' as const }],
            props: {
                placeholder: 'Sélectionnez un niveau',
                items: [
                    { value: 'bac+2', label: 'Bac+2' },
                    { value: 'bac+3', label: 'Bac+3' },
                    { value: 'bac+4', label: 'Bac+4' },
                    { value: 'bac+5', label: 'Bac+5' },
                    { value: 'bac+6', label: 'Bac+6 et plus' },
                ],
            },
        },
        currentDegree: {
            type: 'input' as const,
            label: 'Quel diplôme préparez-vous ?',
            validationRules: [{ type: 'required' as const }],
            props: {
                placeholder: 'Nom du diplôme...',
            },
        },
        institution: {
            type: 'select' as const,
            label: 'Dans quel établissement ?',
            validationRules: [{ type: 'required' as const }],
            props: {
                placeholder: 'Sélectionnez votre établissement',
                description: "Si l'intitulé ne correspond pas à votre école, merci de le modifier en sélectionnant votre école",
                items: [
                    { value: 'universite-paris-1', label: 'Université Paris 1 Panthéon-Sorbonne' },
                    { value: 'hec', label: 'HEC Paris' },
                    { value: 'essec', label: 'ESSEC Business School' },
                    { value: 'sciences-po', label: 'Sciences Po' },
                    { value: 'centrale', label: 'CentraleSupélec' },
                    { value: 'polytechnique', label: 'École Polytechnique' },
                    { value: 'autre', label: 'Autre' },
                ],
            },
        },
        institutionOther: {
            type: 'input' as const,
            label: 'Veuillez préciser l\'établissement',
            validationRules: [{ type: 'required' as const }],
            props: {
                placeholder: 'Nom de l\'établissement...',
            },
        },
        expertiseDomains: {
            type: 'multiSelect' as const,
            label: 'Veuillez préciser les domaines d\'expertise principaux associés à votre formation en cours de préparation',
            validationRules: [],
            props: {
                placeholder: 'Sélectionnez jusqu\'à 3 domaines',
                max: 3,
                items: [
                    { value: 'finance', label: 'Finance' },
                    { value: 'banque', label: 'Banque' },
                    { value: 'assurance', label: 'Assurance' },
                    { value: 'risk-management', label: 'Risk Management' },
                    { value: 'comptabilite', label: 'Comptabilité' },
                    { value: 'audit', label: 'Audit' },
                    { value: 'marketing', label: 'Marketing' },
                    { value: 'commerce', label: 'Commerce' },
                    { value: 'rh', label: 'Ressources Humaines' },
                    { value: 'it', label: 'Informatique / IT' },
                    { value: 'data-science', label: 'Data Science' },
                    { value: 'juridique', label: 'Juridique' },
                    { value: 'compliance', label: 'Compliance' },
                    { value: 'autre', label: 'Autre' },
                ],
            },
        },
        expertiseDomainsOther: {
            type: 'input' as const,
            label: 'Veuillez préciser le(s) domaine(s) d\'expertise',
            validationRules: [{ type: 'required' as const }],
            props: {
                placeholder: 'Vos domaines d\'expertise...',
            },
        },
        continueBNPParibas: {
            type: 'select' as const,
            label: 'Souhaitez-vous poursuivre votre parcours professionnel au sein de BNP Paribas ?',
            validationRules: [{ type: 'required' as const }],
            props: {
                placeholder: 'Sélectionnez une option',
                items: [
                    { value: 'oui', label: 'Oui' },
                    { value: 'non', label: 'Non' },
                ],
            },
        },
        reasonsForLeaving: {
            type: 'textarea' as const,
            label: 'Quelles sont les raisons qui motivent votre choix de quitter l\'entreprise ?',
            validationRules: [],
            props: {
                placeholder: 'Vos raisons...',
            },
        },
        prioritySearch: {
            type: 'select' as const,
            label: 'Que recherchez-vous en priorité à l\'issue de votre contrat ?',
            validationRules: [{ type: 'required' as const }],
            props: {
                placeholder: 'Sélectionnez un type de contrat',
                items: [
                    { value: 'cdi', label: 'CDI' },
                    { value: 'cdd', label: 'CDD' },
                    { value: 'vie', label: 'VIE (Volontariat International en Entreprise)' },
                    { value: 'alternance', label: 'Alternance' },
                    { value: 'stage', label: 'Stage' },
                ],
            },
        },
        vieGeographicZones: {
            type: 'multiSelect' as const,
            label: 'Dans quelles zones géographiques recherchez-vous une mission VIE ?',
            validationRules: [{ type: 'required' as const }],
            props: {
                placeholder: 'Sélectionnez une ou plusieurs zones',
                items: [
                    { value: 'europe', label: 'Europe' },
                    { value: 'amerique-nord', label: 'Amérique du Nord' },
                    { value: 'amerique-sud', label: 'Amérique du Sud' },
                    { value: 'asie', label: 'Asie' },
                    { value: 'afrique', label: 'Afrique' },
                    { value: 'oceanie', label: 'Océanie' },
                    { value: 'moyen-orient', label: 'Moyen-Orient' },
                ],
            },
        },
        employmentRegion: {
            type: 'select' as const,
            label: 'Dans quelle région recherchez-vous prioritairement un emploi ?',
            validationRules: [{ type: 'required' as const }],
            props: {
                placeholder: 'Sélectionnez une région',
                items: [
                    { value: 'ile-de-france', label: 'Île-de-France' },
                    { value: 'auvergne-rhone-alpes', label: 'Auvergne-Rhône-Alpes' },
                    { value: 'nouvelle-aquitaine', label: 'Nouvelle-Aquitaine' },
                    { value: 'occitanie', label: 'Occitanie' },
                    { value: 'hauts-de-france', label: 'Hauts-de-France' },
                    { value: 'grand-est', label: 'Grand Est' },
                    { value: 'provence-alpes-cote-azur', label: 'Provence-Alpes-Côte d\'Azur' },
                    { value: 'pays-de-la-loire', label: 'Pays de la Loire' },
                    { value: 'bretagne', label: 'Bretagne' },
                    { value: 'normandie', label: 'Normandie' },
                    { value: 'bourgogne-franche-comte', label: 'Bourgogne-Franche-Comté' },
                    { value: 'centre-val-de-loire', label: 'Centre-Val de Loire' },
                    { value: 'corse', label: 'Corse' },
                ],
            },
        },
        otherRegionsAvailable: {
            type: 'multiSelect' as const,
            label: 'Êtes-vous disponible pour d\'autres régions ?',
            validationRules: [{ type: 'required' as const }],
            props: {
                placeholder: 'Sélectionnez une ou plusieurs régions',
                items: [
                    { value: 'ile-de-france', label: 'Île-de-France' },
                    { value: 'auvergne-rhone-alpes', label: 'Auvergne-Rhône-Alpes' },
                    { value: 'nouvelle-aquitaine', label: 'Nouvelle-Aquitaine' },
                    { value: 'occitanie', label: 'Occitanie' },
                    { value: 'hauts-de-france', label: 'Hauts-de-France' },
                    { value: 'grand-est', label: 'Grand Est' },
                    { value: 'provence-alpes-cote-azur', label: 'Provence-Alpes-Côte d\'Azur' },
                    { value: 'pays-de-la-loire', label: 'Pays de la Loire' },
                    { value: 'bretagne', label: 'Bretagne' },
                    { value: 'normandie', label: 'Normandie' },
                    { value: 'bourgogne-franche-comte', label: 'Bourgogne-Franche-Comté' },
                    { value: 'centre-val-de-loire', label: 'Centre-Val de Loire' },
                    { value: 'corse', label: 'Corse' },
                ],
            },
        },
        availabilityDate: {
            type: 'input' as const,
            label: 'À partir de quelle date serez-vous disponible ?',
            validationRules: [{ type: 'required' as const }],
            props: {
                type: 'date',
                placeholder: 'jj/mm/aaaa',
            },
        },
        specificSkills: {
            type: 'multiSelect' as const,
            label: 'Quelles compétences métiers spécifiques souhaitez-vous valoriser dans le cadre de votre prochain poste ?',
            validationRules: [],
            props: {
                placeholder: 'Sélectionnez une ou plusieurs compétences',
                items: [
                    { value: 'analyse-financiere', label: 'Analyse financière' },
                    { value: 'gestion-portefeuille', label: 'Gestion de portefeuille' },
                    { value: 'trading', label: 'Trading' },
                    { value: 'risk-management', label: 'Risk Management' },
                    { value: 'audit', label: 'Audit' },
                    { value: 'conseil', label: 'Conseil' },
                    { value: 'gestion-projet', label: 'Gestion de projet' },
                    { value: 'data-analysis', label: 'Analyse de données' },
                    { value: 'programmation', label: 'Programmation' },
                    { value: 'marketing-digital', label: 'Marketing digital' },
                    { value: 'relation-client', label: 'Relation client' },
                    { value: 'negociation', label: 'Négociation' },
                ],
            },
        },
        englishLevel: {
            type: 'select' as const,
            label: 'Quel est votre niveau d\'anglais ?',
            validationRules: [{ type: 'required' as const }],
            props: {
                placeholder: 'Sélectionnez votre niveau',
                items: [
                    { value: 'a1', label: 'A1 - Débutant' },
                    { value: 'a2', label: 'A2 - Élémentaire' },
                    { value: 'b1', label: 'B1 - Intermédiaire' },
                    { value: 'b2', label: 'B2 - Intermédiaire avancé' },
                    { value: 'c1', label: 'C1 - Avancé' },
                    { value: 'c2', label: 'C2 - Maîtrise' },
                    { value: 'natif', label: 'Natif / Bilingue' },
                ],
            },
        },
        mobilePhone: {
            type: 'input' as const,
            label: 'Votre numéro de mobile',
            validationRules: [],
            props: {
                type: 'tel',
                placeholder: '06 12 34 56 78',
            },
        },
        personalEmail: {
            type: 'input' as const,
            label: 'Votre adresse mail personnelle',
            validationRules: [],
            props: {
                type: 'email',
                placeholder: 'exemple@email.com',
            },
        },
        linkedinProfile: {
            type: 'input' as const,
            label: 'Votre profil LinkedIn',
            validationRules: [],
            props: {
                type: 'url',
                placeholder: 'https://www.linkedin.com/in/...',
                description: "Votre profil LinkedIn peut remplacer votre CV si celui-ci n'est pas à jour par exemple. Attention à renseigner un lien valide",
            },
        },
        cvFile: {
            type: 'file' as const,
            label: 'Vous pouvez déposer ici votre CV à jour',
            validationRules: [],
            props: {
                accept: '.pdf,.doc,.docx',
                description: "Si vous souhaitez l'actualiser avant partage avec nos équipes de recrutement, vous pourrez l'ajouter ultérieurement",
            },
        },
    },

    layout: {
        structure: [
            {
                rowLayoutType: 'ALWAYS_1_SLOT' as const,
                items: ['academicProfileTitle'],
                itemsPerRow: 1,
            },
            {
                rowLayoutType: 'FROM_3_SLOTS_TO_2_SLOTS_TO_1_SLOT' as const,
                items: ['currentPosition', 'degreeLevel', 'currentDegree'],
                itemsPerRow: 3,
            },
            {
                rowLayoutType: 'FROM_3_SLOTS_TO_2_SLOTS_TO_1_SLOT' as const,
                items: ['institution', 'institutionOther'],
                itemsPerRow: 3,
            },
            {
                rowLayoutType: 'FROM_3_SLOTS_TO_2_SLOTS_TO_1_SLOT' as const,
                items: ['expertiseDomains', 'expertiseDomainsOther'],
                itemsPerRow: 3,
            },
            {
                rowLayoutType: 'ALWAYS_1_SLOT' as const,
                items: ['professionalProjectTitle'],
                itemsPerRow: 1,
            },
            {
                rowLayoutType: 'FROM_4_SLOTS_TO_2_SLOTS_TO_1_SLOT' as const,
                items: ['continueBNPParibas', 'reasonsForLeaving', 'prioritySearch', 'vieGeographicZones'],
                itemsPerRow: 4,
            },
            {
                rowLayoutType: 'FROM_4_SLOTS_TO_2_SLOTS_TO_1_SLOT' as const,
                items: ['employmentRegion', 'otherRegionsAvailable', 'availabilityDate'],
                itemsPerRow: 4,
            },
            {
                rowLayoutType: 'ALWAYS_1_SLOT' as const,
                items: ['skillsTitle'],
                itemsPerRow: 1,
            },
            {
                rowLayoutType: 'FROM_3_SLOTS_TO_2_SLOTS_TO_1_SLOT' as const,
                items: ['specificSkills', 'englishLevel'],
                itemsPerRow: 3,
            },
            {
                rowLayoutType: 'ALWAYS_1_SLOT' as const,
                items: ['contactInfoTitle'],
                itemsPerRow: 1,
            },
            {
                rowLayoutType: 'FROM_2_SLOTS_TO_1_SLOT' as const,
                items: ['mobilePhone', 'personalEmail'],
                itemsPerRow: 2,
            },
            {
                rowLayoutType: 'FROM_2_SLOTS_TO_1_SLOT' as const,
                items: ['linkedinProfile', 'cvFile'],
                itemsPerRow: 2,
            },
            {
                rowLayoutType: 'ALWAYS_1_SLOT' as const,
                items: ['rgpdComment'],
                itemsPerRow: 1,
            },
        ],
    },

    behavior: {
        initiallyHiddenFields: [
            'expertiseDomainsOther',
            'institutionOther',
            'reasonsForLeaving',
            'vieGeographicZones',
            'employmentRegion',
        ],
        visibilityRules: [
            {
                field: 'expertiseDomainsOther',
                condition: {
                    operator: 'includes' as const,
                    args: ['expertiseDomains', 'autre'],
                },
                dependencies: ['expertiseDomains'],
            },
            {
                field: 'reasonsForLeaving',
                condition: {
                    operator: 'equals' as const,
                    args: ['continueBNPParibas', 'non'],
                },
                dependencies: ['continueBNPParibas'],
            },
            {
                field: 'vieGeographicZones',
                condition: {
                    operator: 'equals' as const,
                    args: ['prioritySearch', 'vie'],
                },
                dependencies: ['prioritySearch'],
            },
            {
                field: 'employmentRegion',
                condition: {
                    operator: 'and' as const,
                    args: [
                        {
                            operator: 'notEquals' as const,
                            args: ['prioritySearch', 'vie'],
                        },
                        {
                            operator: 'notEquals' as const,
                            args: ['prioritySearch', 'stage'],
                        },
                    ],
                },
                dependencies: ['prioritySearch'],
            },
            {
                field: 'institutionOther',
                condition: {
                    operator: 'equals' as const,
                    args: ['institution', 'autre'],
                },
                dependencies: ['institution'],
            },
        ],
        computedFields: [],
        defaultValues: {},
    },
};


export {
    studentFormBaseConfig,
};

