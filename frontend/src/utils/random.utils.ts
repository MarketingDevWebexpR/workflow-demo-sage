export const getRandomKey = (obj: Record<string, any>) => {
    return Object.keys(obj)[Math.floor(Math.random() * Object.keys(obj).length)];
};

export const getRandomValue = (obj: Record<string, any>) => {
    return obj[getRandomKey(obj)];
};