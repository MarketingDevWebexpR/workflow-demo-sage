import { type TConfigOverrides } from "../../types/config-overrides.types";
import type { TQuestionnaireFormValues } from "../types";


const studentFormOverrides: TConfigOverrides<TQuestionnaireFormValues> = {

    fields: {
        // Section header : Profil académique
        academicProfileTitle: {
            type: 'custom',
            render: () => (
                <>
                    <h2>Profil académique</h2>
                    <p>Veuillez renseigner les informations relatives à votre formation actuelle.</p>
                </>
            ),
        },
        // Section header : Projet professionnel
        professionalProjectTitle: {
            type: 'custom',
            render: () => (
                <>
                    <h2>Projet professionnel</h2>
                    <p>Veuillez nous indiquer vos intentions pour la suite de votre parcours professionnel.</p>
                </>
            ),
        },
        // Section header : Compétences
        skillsTitle: {
            type: 'custom',
            render: () => (
                <>
                    <h2>Compétences</h2>
                    <p>Aidez-nous à mieux cerner vos compétences et votre niveau linguistique.</p>
                </>
            ),
        },
        // Section header : Coordonnées
        contactInfoTitle: {
            type: 'custom',
            render: () => (
                <>
                    <h2>Coordonnées</h2>
                    <p>Merci de renseigner vos coordonnées pour que nous puissions vous recontacter.</p>
                </>
            ),
        },
        // Section header : Commentaire RGPD
        rgpdComment: {
            type: 'custom',
            render: () => (
                <>
                    <h2>Commentaire</h2>
                    <p>
                        En partageant votre CV vous vous engagez à ne pas y faire figurer de données personnelles
                        dites sensibles (au sens de l'article 9 du RGPD, non requises pour les présentes finalités)
                        à savoir des données révélant l'origine raciale ou ethnique, les opinions politiques,
                        les convictions religieuses ou philosophiques ou l'appartenance syndicale, ainsi que des
                        données génétiques, des données biométriques, des données concernant la santé ou des
                        données concernant la vie sexuelle ou l'orientation sexuelle.
                    </p>
                </>
            ),
        },

        // Validator custom pour expertiseDomains (max 3 items)
        expertiseDomains: {
            validationRules: [
                {
                    type: 'custom',
                    validator: value => {
                        if (value && Array.isArray(value) && value.length > 3) {
                            return 'Vous pouvez sélectionner maximum 3 domaines';
                        }
                        return true;
                    },
                },
            ],
        },
    },

    behavior: {
        computedFields: [],
        onSubmit: data => {
            console.log('📋 Form submitted:', { data });
           // TODO: Ajouter la logique de soumission BNPP
        },
    },
};


export {
    studentFormOverrides,
};

