import { type FieldValues } from "react-hook-form";
import { type LogicRule } from "./types";
import {
    varOperator,
    equalsOperator,
    notEqualsOperator,
    greaterThanOperator,
    lessThanOperator,
    greaterThanOrEqualOperator,
    lessThanOrEqualOperator,
    includesOperator,
    startsWithOperator,
    endsWithOperator,
    arrayLengthOperator,
    arrayIsEmptyOperator,
    andOperator,
    orOperator,
    notOperator,
} from "./operators";


/**
 * Évalue une règle logique par rapport à des données
 *
 * @param rule - La règle à évaluer (type-safe)
 * @param data - Les données du formulaire
 * @param debug - Active le mode debug avec logs
 * @returns Le résultat de l'évaluation (boolean ou autre selon l'opérateur)
 */
const evaluate = <T extends FieldValues>(
    rule: LogicRule<T>,
    data: T,
    debug = false
): boolean | number | T[keyof T] | undefined => {

    if (debug) {
        console.log('[Logic Evaluator] Evaluating rule:', rule);
        console.log('[Logic Evaluator] With data:', data);
    }

    // Validation de base
    if (!rule || typeof rule !== 'object' || !('operator' in rule)) {
        throw new Error('[Logic Evaluator] Invalid rule: must be an object with an "operator" property');
    }

    let result: boolean | number | T[keyof T] | undefined;

    // Dispatch selon l'opérateur
    switch (rule.operator) {
        case 'var':
            result = varOperator(rule.args, data);
            break;

        case 'equals':
            result = equalsOperator(rule.args, data);
            break;

        case 'notEquals':
            result = notEqualsOperator(rule.args, data);
            break;

        case 'greaterThan':
            result = greaterThanOperator(rule.args, data);
            break;

        case 'lessThan':
            result = lessThanOperator(rule.args, data);
            break;

        case 'greaterThanOrEqual':
            result = greaterThanOrEqualOperator(rule.args, data);
            break;

        case 'lessThanOrEqual':
            result = lessThanOrEqualOperator(rule.args, data);
            break;

        case 'includes':
            result = includesOperator(rule.args, data);
            break;

        case 'startsWith':
            result = startsWithOperator(rule.args, data);
            break;

        case 'endsWith':
            result = endsWithOperator(rule.args, data);
            break;

        case 'arrayLength':
            result = arrayLengthOperator(rule.args, data);
            break;

        case 'arrayIsEmpty':
            result = arrayIsEmptyOperator(rule.args, data);
            break;

        case 'and':
            result = andOperator(rule.args, data, evaluate);
            break;

        case 'or':
            result = orOperator(rule.args, data, evaluate);
            break;

        case 'not':
            result = notOperator(rule.args, data, evaluate);
            break;

        default:
            // @ts-expect-error - Exhaustive check
            throw new Error(`[Logic Evaluator] Unknown operator: "${rule.operator}"`);
    }

    if (debug) {
        console.log('[Logic Evaluator] Result:', result);
    }

    return result;
};


export {
    evaluate,
};

