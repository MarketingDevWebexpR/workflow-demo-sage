import { type FieldValues } from "react-hook-form";
import { type LogicRule } from "./types";


/**
 * Opérateur : Récupère la valeur d'un champ
 */
const varOperator = <T extends FieldValues>(
    args: [keyof T],
    data: T
): T[keyof T] | undefined => {
    return data[args[0]];
};


/**
 * Opérateur : Égalité stricte
 */
const equalsOperator = <T extends FieldValues>(
    args: [keyof T, unknown],
    data: T
): boolean => {
    return data[args[0]] === args[1];
};


/**
 * Opérateur : Inégalité stricte
 */
const notEqualsOperator = <T extends FieldValues>(
    args: [keyof T, unknown],
    data: T
): boolean => {
    return data[args[0]] !== args[1];
};


/**
 * Opérateur : Supérieur à
 */
const greaterThanOperator = <T extends FieldValues>(
    args: [keyof T, number],
    data: T
): boolean => {
    const value = data[args[0]];
    if (typeof value !== 'number') return false;
    return value > args[1];
};


/**
 * Opérateur : Inférieur à
 */
const lessThanOperator = <T extends FieldValues>(
    args: [keyof T, number],
    data: T
): boolean => {
    const value = data[args[0]];
    if (typeof value !== 'number') return false;
    return value < args[1];
};


/**
 * Opérateur : Supérieur ou égal à
 */
const greaterThanOrEqualOperator = <T extends FieldValues>(
    args: [keyof T, number],
    data: T
): boolean => {
    const value = data[args[0]];
    if (typeof value !== 'number') return false;
    return value >= args[1];
};


/**
 * Opérateur : Inférieur ou égal à
 */
const lessThanOrEqualOperator = <T extends FieldValues>(
    args: [keyof T, number],
    data: T
): boolean => {
    const value = data[args[0]];
    if (typeof value !== 'number') return false;
    return value <= args[1];
};


/**
 * Opérateur : Vérifie si un tableau/string contient une valeur
 */
const includesOperator = <T extends FieldValues>(
    args: [keyof T, unknown],
    data: T
): boolean => {
    const value = data[args[0]];

    if (Array.isArray(value)) {
        return value.includes(args[1]);
    }

    if (typeof value === 'string' && typeof args[1] === 'string') {
        return value.includes(args[1]);
    }

    return false;
};


/**
 * Opérateur : Vérifie si une chaîne commence par
 */
const startsWithOperator = <T extends FieldValues>(
    args: [keyof T, string],
    data: T
): boolean => {
    const value = data[args[0]];
    if (typeof value !== 'string') return false;
    return value.startsWith(args[1]);
};


/**
 * Opérateur : Vérifie si une chaîne se termine par
 */
const endsWithOperator = <T extends FieldValues>(
    args: [keyof T, string],
    data: T
): boolean => {
    const value = data[args[0]];
    if (typeof value !== 'string') return false;
    return value.endsWith(args[1]);
};


/**
 * Opérateur : Retourne la longueur d'un tableau
 */
const arrayLengthOperator = <T extends FieldValues>(
    args: [keyof T],
    data: T
): number => {
    const value = data[args[0]];
    if (!Array.isArray(value)) return 0;
    return value.length;
};


/**
 * Opérateur : Vérifie si un tableau est vide
 */
const arrayIsEmptyOperator = <T extends FieldValues>(
    args: [keyof T],
    data: T
): boolean => {
    const value = data[args[0]];
    if (!Array.isArray(value)) return true;
    return value.length === 0;
};


/**
 * Opérateur : ET logique
 */
const andOperator = <T extends FieldValues>(
    args: LogicRule<T>[],
    data: T,
    evaluate: (rule: LogicRule<T>, data: T) => unknown
): boolean => {
    return args.every(rule => Boolean(evaluate(rule, data)));
};


/**
 * Opérateur : OU logique
 */
const orOperator = <T extends FieldValues>(
    args: LogicRule<T>[],
    data: T,
    evaluate: (rule: LogicRule<T>, data: T) => unknown
): boolean => {
    return args.some(rule => Boolean(evaluate(rule, data)));
};


/**
 * Opérateur : NON logique
 */
const notOperator = <T extends FieldValues>(
    args: [LogicRule<T>],
    data: T,
    evaluate: (rule: LogicRule<T>, data: T) => unknown
): boolean => {
    return !evaluate(args[0], data);
};


export {
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
};

