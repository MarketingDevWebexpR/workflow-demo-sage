// enum EUserRole {
//     PSR = 'PSR',
//     DIRECTION = 'DIRECTION',
// }

// type TPsrThenDirectionSequence = {
//     [key in EUserRole]: {
//         statusIdPrefix: string,
//         statusTitlePrefix: string,
//         actionIdPrefix: string,
//         actionTitle: string,
//         buildStatusId( number: number ): string,
//         buildStatusTitle( number: number ): string,
//         buildActionId( number: number ): string,
//     }
// }

// export const psrThenDirectionSequence: TPsrThenDirectionSequence = {
//     PSR: {
//         statusIdPrefix: 'FOLDER_BEING_PROCESSED_BY_PSR_',
//         statusTitlePrefix: 'En cours de traitement chez PSR',
//         actionIdPrefix: 'PSR_OPINION_',
//         actionTitle: 'Avis PSR',
//         buildStatusId( number ) {
//             return this.statusIdPrefix + number + '_STATUS';
//         },
//         buildStatusTitle( number ) {
//             return this.statusTitlePrefix + ' (' + number + ')';
//         },
//         buildActionId( number ) {
//             return this.actionIdPrefix + number + '_ACTION';
//         },
//     },

//     DIRECTION: {
//         statusIdPrefix: 'FOLDER_BEING_PROCESSED_BY_DIRECTION_',
//         statusTitlePrefix: 'En attente comité RHG',
//         actionIdPrefix: 'DIRECTION_OPINION_',
//         actionTitle: 'Comité de décision RHG',
//         buildStatusId( number ) {
//             return this.statusIdPrefix + number + '_STATUS';
//         },
//         buildStatusTitle( number ) {
//             return this.statusTitlePrefix + ' (' + number + ')';
//         },
//         buildActionId( number ) {
//             return this.actionIdPrefix + number + '_ACTION';
//         },
//     },
// };
