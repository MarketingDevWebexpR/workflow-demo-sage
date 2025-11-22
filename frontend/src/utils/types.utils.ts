type RequiredKey<T> = {
    [K in keyof T]-?: T[K] | undefined;
};
type ValueCanBeUndefined<T> = {
    [K in keyof T]-?: T[K] | undefined;
};

// On doit passer ValueCanBeUndefined dans RequiredKey pour bien prendre en compte la possibilité du Undefined
type RequiredButCanBeUndefined<T> = RequiredKey<ValueCanBeUndefined<T>>;


export type {
    RequiredButCanBeUndefined,
};