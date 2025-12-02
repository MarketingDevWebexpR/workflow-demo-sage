import { type FieldValues, type Path } from "react-hook-form";


/**
 * Opérateurs de comparaison basiques
 */
type EqualsRule<T extends FieldValues> = {
    operator: 'equals';
    args: [Path<T>, T[Path<T>]];
};

type NotEqualsRule<T extends FieldValues> = {
    operator: 'notEquals';
    args: [Path<T>, T[Path<T>]];
};

type GreaterThanRule<T extends FieldValues> = {
    operator: 'greaterThan';
    args: [Path<T>, number];
};

type LessThanRule<T extends FieldValues> = {
    operator: 'lessThan';
    args: [Path<T>, number];
};

type GreaterThanOrEqualRule<T extends FieldValues> = {
    operator: 'greaterThanOrEqual';
    args: [Path<T>, number];
};

type LessThanOrEqualRule<T extends FieldValues> = {
    operator: 'lessThanOrEqual';
    args: [Path<T>, number];
};


/**
 * Opérateurs de chaînes
 */
type IncludesRule<T extends FieldValues> = {
    operator: 'includes';
    args: [Path<T>, unknown];
};

type StartsWithRule<T extends FieldValues> = {
    operator: 'startsWith';
    args: [Path<T>, string];
};

type EndsWithRule<T extends FieldValues> = {
    operator: 'endsWith';
    args: [Path<T>, string];
};


/**
 * Opérateurs de tableau
 */
type ArrayLengthRule<T extends FieldValues> = {
    operator: 'arrayLength';
    args: [Path<T>];
};

type ArrayIsEmptyRule<T extends FieldValues> = {
    operator: 'arrayIsEmpty';
    args: [Path<T>];
};


/**
 * Opérateurs logiques
 */
type AndRule<T extends FieldValues> = {
    operator: 'and';
    args: LogicRule<T>[];
};

type OrRule<T extends FieldValues> = {
    operator: 'or';
    args: LogicRule<T>[];
};

type NotRule<T extends FieldValues> = {
    operator: 'not';
    args: [LogicRule<T>];
};


/**
 * Opérateur de variable (pour récupérer une valeur)
 */
type VarRule<T extends FieldValues> = {
    operator: 'var';
    args: [Path<T>];
};


/**
 * Union de tous les opérateurs possibles
 */
type LogicRule<T extends FieldValues> =
    | EqualsRule<T>
    | NotEqualsRule<T>
    | GreaterThanRule<T>
    | LessThanRule<T>
    | GreaterThanOrEqualRule<T>
    | LessThanOrEqualRule<T>
    | IncludesRule<T>
    | StartsWithRule<T>
    | EndsWithRule<T>
    | ArrayLengthRule<T>
    | ArrayIsEmptyRule<T>
    | AndRule<T>
    | OrRule<T>
    | NotRule<T>
    | VarRule<T>;


/**
 * Type utilitaire pour extraire le type de retour d'une règle
 */
type LogicRuleResult<T extends FieldValues, R extends LogicRule<T>> =
    R extends ArrayLengthRule<T> ? number :
    R extends VarRule<T> ? T[R['args'][0]] :
    boolean;


export {
    type LogicRule,
    type LogicRuleResult,
    type EqualsRule,
    type NotEqualsRule,
    type GreaterThanRule,
    type LessThanRule,
    type GreaterThanOrEqualRule,
    type LessThanOrEqualRule,
    type IncludesRule,
    type StartsWithRule,
    type EndsWithRule,
    type ArrayLengthRule,
    type ArrayIsEmptyRule,
    type AndRule,
    type OrRule,
    type NotRule,
    type VarRule,
};

