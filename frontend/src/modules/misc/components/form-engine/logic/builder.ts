import { type FieldValues, type Path } from "react-hook-form";
import {
    type LogicRule,
    type EqualsRule,
    type NotEqualsRule,
    type GreaterThanRule,
    type LessThanRule,
    type IncludesRule,
    type StartsWithRule,
    type EndsWithRule,
    type ArrayLengthRule,
    type ArrayIsEmptyRule,
    type AndRule,
    type OrRule,
    type NotRule,
    type VarRule,
} from "./types";


/**
 * Builder fluent pour créer des règles logiques de manière type-safe
 *
 * @example
 * ```typescript
 * const rule = Logic.includes('expertiseDomains', 'autre');
 * // → { operator: 'includes', args: ['expertiseDomains', 'autre'] }
 *
 * const complexRule = Logic.and(
 *   Logic.equals('role', 'manager'),
 *   Logic.greaterThan('experience', 5)
 * );
 * ```
 */
const Logic = {
    /**
     * Récupère la valeur d'un champ
     */
    var: <T extends FieldValues>(field: Path<T>): VarRule<T> => ({
        operator: 'var',
        args: [field],
    }),

    /**
     * Vérifie l'égalité stricte
     */
    equals: <T extends FieldValues>(
        field: Path<T>,
        value: T[Path<T>]
    ): EqualsRule<T> => ({
        operator: 'equals',
        args: [field, value],
    }),

    /**
     * Vérifie l'inégalité stricte
     */
    notEquals: <T extends FieldValues>(
        field: Path<T>,
        value: T[Path<T>]
    ): NotEqualsRule<T> => ({
        operator: 'notEquals',
        args: [field, value],
    }),

    /**
     * Vérifie si un nombre est supérieur à une valeur
     */
    greaterThan: <T extends FieldValues>(
        field: Path<T>,
        value: number
    ): GreaterThanRule<T> => ({
        operator: 'greaterThan',
        args: [field, value],
    }),

    /**
     * Vérifie si un nombre est inférieur à une valeur
     */
    lessThan: <T extends FieldValues>(
        field: Path<T>,
        value: number
    ): LessThanRule<T> => ({
        operator: 'lessThan',
        args: [field, value],
    }),

    /**
     * Vérifie si un tableau/string contient une valeur
     */
    includes: <T extends FieldValues>(
        field: Path<T>,
        value: unknown
    ): IncludesRule<T> => ({
        operator: 'includes',
        args: [field, value],
    }),

    /**
     * Vérifie si une chaîne commence par
     */
    startsWith: <T extends FieldValues>(
        field: Path<T>,
        value: string
    ): StartsWithRule<T> => ({
        operator: 'startsWith',
        args: [field, value],
    }),

    /**
     * Vérifie si une chaîne se termine par
     */
    endsWith: <T extends FieldValues>(
        field: Path<T>,
        value: string
    ): EndsWithRule<T> => ({
        operator: 'endsWith',
        args: [field, value],
    }),

    /**
     * Retourne la longueur d'un tableau
     */
    arrayLength: <T extends FieldValues>(
        field: Path<T>
    ): ArrayLengthRule<T> => ({
        operator: 'arrayLength',
        args: [field],
    }),

    /**
     * Vérifie si un tableau est vide
     */
    arrayIsEmpty: <T extends FieldValues>(
        field: Path<T>
    ): ArrayIsEmptyRule<T> => ({
        operator: 'arrayIsEmpty',
        args: [field],
    }),

    /**
     * ET logique (toutes les conditions doivent être vraies)
     */
    and: <T extends FieldValues>(
        ...conditions: LogicRule<T>[]
    ): AndRule<T> => ({
        operator: 'and',
        args: conditions,
    }),

    /**
     * OU logique (au moins une condition doit être vraie)
     */
    or: <T extends FieldValues>(
        ...conditions: LogicRule<T>[]
    ): OrRule<T> => ({
        operator: 'or',
        args: conditions,
    }),

    /**
     * NON logique (inverse la condition)
     */
    not: <T extends FieldValues>(
        condition: LogicRule<T>
    ): NotRule<T> => ({
        operator: 'not',
        args: [condition],
    }),
};


export {
    Logic,
};

