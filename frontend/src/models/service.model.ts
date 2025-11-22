/**
 * Service Model - Version simplifiée pour automation-poc
 * 
 * Cette classe sert uniquement de wrapper autour de fonctions async
 * pour fournir le typage nécessaire aux actions du store.
 */

export enum EServiceExecutionMomentNames {
    BEFORE_EXECUTE = 'beforeExecute',
    AFTER_EXECUTE_SUCCESS = 'afterExecuteSuccess',
    AFTER_EXECUTE_ERROR = 'afterExecuteError',
    AFTER_EXECUTE = 'afterExecute',
}

export default class Service<Fn extends TAsyncFunction | TGeneratorFunction> {

    readonly fn: Fn;
    readonly executionMoments: {
        [key in EServiceExecutionMomentNames]: string
    };

    constructor(fn: Fn, _props: IServiceData = {}) {
        this.fn = fn;
        this.executionMoments = this.buildExecutionMoments();
    }

    /**
     * Exécute la fonction wrappée et retourne le résultat ou une erreur
     */
    public async execute(...args: Parameters<Fn>): Promise<Awaited<ReturnType<Fn>> | Error> {
        try {
            console.log(`%c Service "${this.fn.name}": Exécution...`, 'color: royalblue;', { args });

            this.dispatchSignal({
                executionMomentName: EServiceExecutionMomentNames.BEFORE_EXECUTE,
                args,
            });

            const result = await this.fn(...args);

            console.log(`%c Service "${this.fn.name}": Succès!`, 'color: seagreen;', { result });

            this.dispatchSignal({
                executionMomentName: EServiceExecutionMomentNames.AFTER_EXECUTE_SUCCESS,
                payload: result,
                args,
            });

            this.dispatchSignal({
                executionMomentName: EServiceExecutionMomentNames.AFTER_EXECUTE,
                args,
            });

            return result;

        } catch (error) {
            console.log(`%c Service "${this.fn.name}": Erreur! (${(error as Error).message})`, 'color: indianred;', { error });

            this.dispatchSignal({
                executionMomentName: EServiceExecutionMomentNames.AFTER_EXECUTE_ERROR,
                payload: error as Error,
                args,
            });

            this.dispatchSignal({
                executionMomentName: EServiceExecutionMomentNames.AFTER_EXECUTE,
                args,
            });

            return error as Error;
        }
    }

    /**
     * Exécute la fonction avec un identifiant de signal unique
     */
    public async executeWithUniqueSignal(_uniqueSignalIdentifier: string, ...args: Parameters<Fn>): Promise<Awaited<ReturnType<Fn>> | Error> {
        // Pour l'instant, on ignore le uniqueSignalIdentifier et on exécute normalement
        // (fonctionnalité à implémenter plus tard si nécessaire)
        return await this.execute(...args);
    }

    private buildExecutionMoments() {
        return {
            beforeExecute: `${this.fn.name}.${EServiceExecutionMomentNames.BEFORE_EXECUTE}`,
            afterExecuteSuccess: `${this.fn.name}.${EServiceExecutionMomentNames.AFTER_EXECUTE_SUCCESS}`,
            afterExecuteError: `${this.fn.name}.${EServiceExecutionMomentNames.AFTER_EXECUTE_ERROR}`,
            afterExecute: `${this.fn.name}.${EServiceExecutionMomentNames.AFTER_EXECUTE}`,
        };
    }

    public buildUniqueSignal(initialSignal: string, uniqueSignalIdentifier: string): string {
        return `${initialSignal}.${uniqueSignalIdentifier}`;
    }

    private dispatchSignal({
        executionMomentName,
        payload,
        args,
        uniqueSignalIdentifier,
    }: {
        executionMomentName: EServiceExecutionMomentNames,
        payload?: ReturnType<Fn> | Error,
        args?: Parameters<Fn>,
        uniqueSignalIdentifier?: string,
    }): void {

        const executionMoment = this.executionMoments[executionMomentName];
        const signal = executionMoment;

        const usedSignal = uniqueSignalIdentifier
            ? this.buildUniqueSignal(signal, uniqueSignalIdentifier)
            : signal;

        document.dispatchEvent(new CustomEvent(usedSignal, {
            detail: {
                payload,
                args,
            },
        }));
    }
}

export type TAsyncFunction = (...args: any[]) => Promise<any>;
export type TGeneratorFunction = (...args: any[]) => Generator<any, any, any>;

export interface IServiceData {
    // Props vides pour l'instant, extensible plus tard si besoin
}
