import Service from "../models/service.model";

export enum EServiceNames {
    FETCH_LIMITED = 'fetchLimited',
    FETCH_ALL = 'fetchAll',
    FETCH_BY_ID = 'fetchById',
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    DELETE_BULK = 'deleteBulk',
}

export interface IServiceFns<TItem, TCreate, TUpdate> {

    fetchLimited: ({
        sp,
        filterQuery,
        orderBy,
        top,
    }: {
        sp: any,
        filterQuery?: string,
        orderBy?: [string, boolean],
        top?: number,
    }) => Promise<TItem[]>,

    fetchAll: ({
        sp,
        filterQuery,
        orderBy,
        top,
    }: {
        sp: any,
        filterQuery?: string,
        orderBy?: [string, boolean],
        top?: number,
    }) => Promise<TItem[]>,

    fetchById: ({
        sp,
        id,
    }: {
        sp: any,
        id: number,
    }) => Promise<TItem>,

    create: ({
        sp,
        props,
    }: {
        sp: any,
        props: TCreate,
    }) => Promise<TItem>,

    update: ({
        sp,
        id,
        props,
    }: {
        sp: any,
        id: number,
        props: TUpdate,
    }) => Promise<TItem>,

    delete: ({
        sp,
        id,
    }: {
        sp: any,
        id: number,
    }) => Promise<number>,

    deleteBulk: ({
        sp,
        ids,
    }: {
        sp: any,
        ids: number[],
    }) => Promise<{
        successes: number[],
        failures: {
            id: number,
            error: Error,
        }[],
    }>,
}

export type TServices<TItem, TCreate, TUpdate> = {
    [key in EServiceNames]: Service<IServiceFns<TItem, TCreate, TUpdate>[key]>
}

export function generateCrudActions<T extends string>(entity: T) {
    const upperEntity = entity.toUpperCase() as Uppercase<T>;

    // Définition des types d'actions comme des constantes explicites

    const FETCH_CURRENT_USER_EFFECTIVE_PERMISSIONS = `FETCH_CURRENT_USER_EFFECTIVE_PERMISSIONS_${upperEntity}` as const;
    const FETCH_CURRENT_USER_EFFECTIVE_PERMISSIONS_FULFILLED = `FETCH_CURRENT_USER_EFFECTIVE_PERMISSIONS_${upperEntity}_FULFILLED` as const;

    const FETCH_ALL = `FETCH_ALL_${upperEntity}` as const;
    const FETCH_ALL_FULFILLED = `FETCH_ALL_${upperEntity}_FULFILLED` as const;
    const SET_FILTERS = `SET_FILTERS_${upperEntity}` as const;

    const SET_PAGER = `SET_PAGER_${upperEntity}` as const;
    const SET_CURRENT_PAGE_POINTER = `SET_CURRENT_PAGE_POINTER_${upperEntity}` as const;
    const SET_IS_PAGE_LOADING = `SET_IS_PAGE_LOADING_${upperEntity}` as const;
    const SET_MAX_PAGE_POINTER = `SET_MAX_PAGE_POINTER_${upperEntity}` as const
    const SET_FILTER_QUERY = `SET_FILTER_QUERY_${upperEntity}` as const;

    const SELECT = `SELECT_${upperEntity}` as const;
    const CREATE = `CREATE_${upperEntity}` as const;
    const CREATE_FULFILLED = `CREATE_${upperEntity}_FULFILLED` as const;
    const UPDATE = `UPDATE_${upperEntity}` as const;
    const UPDATE_FULFILLED = `UPDATE_${upperEntity}_FULFILLED` as const;
    const DELETE = `DELETE_${upperEntity}` as const;
    const DELETE_FULFILLED = `DELETE_${upperEntity}_FULFILLED` as const;
    const DELETE_BULK = `DELETE_BULK_${upperEntity}` as const;
    const DELETE_BULK_FULFILLED = `DELETE_BULK_${upperEntity}_FULFILLED` as const;
    const SET_QUERY_TEXT = `SET_QUERY_TEXT_${upperEntity}` as const;
    const SET_IS_FORM_MODIFIED = `SET_IS_${upperEntity}_FORM_MODIFIED` as const;
    const SET_IDS_BEING_DELETED_IN_BULK = `SET_${upperEntity}_IDS_BEING_DELETED_IN_BULK` as const;

    return {
        FETCH_CURRENT_USER_EFFECTIVE_PERMISSIONS,
        FETCH_CURRENT_USER_EFFECTIVE_PERMISSIONS_FULFILLED,

        FETCH_ALL,
        FETCH_ALL_FULFILLED,
        SET_FILTERS,

        SET_PAGER,
        SET_CURRENT_PAGE_POINTER,
        SET_IS_PAGE_LOADING,
        SET_MAX_PAGE_POINTER,
        SET_FILTER_QUERY,

        SELECT,
        CREATE,
        CREATE_FULFILLED,
        UPDATE,
        UPDATE_FULFILLED,
        DELETE,
        DELETE_FULFILLED,
        DELETE_BULK,
        DELETE_BULK_FULFILLED,
        SET_QUERY_TEXT,
        SET_IS_FORM_MODIFIED,
        SET_IDS_BEING_DELETED_IN_BULK,
    };
}

export type TActionTypes<T extends string> = {
    FETCH_CURRENT_USER_EFFECTIVE_PERMISSIONS: `FETCH_CURRENT_USER_EFFECTIVE_PERMISSIONS_${T}`;
    FETCH_CURRENT_USER_EFFECTIVE_PERMISSIONS_FULFILLED: `FETCH_CURRENT_USER_EFFECTIVE_PERMISSIONS_${T}_FULFILLED`;

    FETCH_ALL: `FETCH_ALL_${T}`;
    FETCH_ALL_FULFILLED: `FETCH_ALL_${T}_FULFILLED`;
    SET_FILTERS: `SET_FILTERS_${T}`;

    SET_PAGER: `SET_PAGER_${T}`;
    SET_CURRENT_PAGE_POINTER: `SET_CURRENT_PAGE_POINTER_${T}`;
    SET_IS_PAGE_LOADING: `SET_IS_PAGE_LOADING_${T}`;
    SET_MAX_PAGE_POINTER: `SET_MAX_PAGE_POINTER_${T}`;

    SELECT: `SELECT_${T}`;
    CREATE: `CREATE_${T}`;
    CREATE_FULFILLED: `CREATE_${T}_FULFILLED`;
    UPDATE: `UPDATE_${T}`;
    UPDATE_FULFILLED: `UPDATE_${T}_FULFILLED`;
    DELETE: `DELETE_${T}`;
    DELETE_FULFILLED: `DELETE_${T}_FULFILLED`;
    DELETE_BULK: `DELETE_BULK_${T}`;
    DELETE_BULK_FULFILLED: `DELETE_BULK_${T}_FULFILLED`;
    SET_QUERY_TEXT: `SET_QUERY_TEXT_${T}`;
    SET_IS_FORM_MODIFIED: `SET_IS_${T}_FORM_MODIFIED`;
    SET_IDS_BEING_DELETED_IN_BULK: `SET_${T}_IDS_BEING_DELETED_IN_BULK`;
    SET_FILTER_QUERY: `SET_FILTER_QUERY_${T}`;
};

export type TSynchronousCommonActionInterfaces<T extends string, TItem> =
| { type: TActionTypes<Uppercase<T>>["SELECT"]; payload: TItem | null }
| { type: TActionTypes<Uppercase<T>>["SET_QUERY_TEXT"], payload: string | undefined }
| { type: TActionTypes<Uppercase<T>>["SET_IS_FORM_MODIFIED"], payload: boolean }
| { type: TActionTypes<Uppercase<T>>["SET_IDS_BEING_DELETED_IN_BULK"], payload: number[] }
// | { type: TActionTypes<Uppercase<T>>["FETCH_CURRENT_USER_EFFECTIVE_PERMISSIONS"] }
// | { type: TActionTypes<Uppercase<T>>["FETCH_CURRENT_USER_EFFECTIVE_PERMISSIONS_FULFILLED"]; payload: TSPPermissionMap }


export type TAsynchronousCommonActionInterfacesInvolvingServices<T extends string, S extends TServices<any, any, any>> =
| { type: TActionTypes<Uppercase<T>>["CREATE"] }
| { type: TActionTypes<Uppercase<T>>["CREATE_FULFILLED"]; payload: Awaited<ReturnType<S[EServiceNames.CREATE]['execute']>> }
| { type: TActionTypes<Uppercase<T>>["UPDATE"] }
| { type: TActionTypes<Uppercase<T>>["UPDATE_FULFILLED"]; payload: Awaited<ReturnType<S[EServiceNames.UPDATE]['execute']>> }
| { type: TActionTypes<Uppercase<T>>["DELETE"] }
| { type: TActionTypes<Uppercase<T>>["DELETE_FULFILLED"]; payload: Awaited<ReturnType<S[EServiceNames.DELETE]['execute']>> }
| { type: TActionTypes<Uppercase<T>>["DELETE_BULK"]; payload: number[] }
| { type: TActionTypes<Uppercase<T>>["DELETE_BULK_FULFILLED"]; payload: Awaited<ReturnType<S[EServiceNames.DELETE_BULK]['execute']>> }

export type TAllCommonActionInterfaces<T extends string, TItem, S extends TServices<any, any, any>> =
| TSynchronousCommonActionInterfaces<T, TItem>
| TAsynchronousCommonActionInterfacesInvolvingServices<T, S>

// Type simple pour remplacer AsyncPager (à améliorer plus tard si nécessaire)
export type AsyncPager<T> = {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    data: T;
};

export type TCrudActionInterfacesRestrictedToDynamicData<T extends string, TItem> =
| { type: TActionTypes<Uppercase<T>>["SET_PAGER"], payload: AsyncPager<TItem[]> | null }
| { type: TActionTypes<Uppercase<T>>["SET_CURRENT_PAGE_POINTER"], payload: number }
| { type: TActionTypes<Uppercase<T>>["SET_IS_PAGE_LOADING"], payload: boolean }
| { type: TActionTypes<Uppercase<T>>["SET_MAX_PAGE_POINTER"], payload: number | null }
| { type: TActionTypes<Uppercase<T>>["SET_FILTER_QUERY"], payload: string | undefined }

export type TStaticDataCrudActionInterfaces<T extends string, TItem, S extends TServices<any, any, any>> =
| TAllCommonActionInterfaces<T, TItem, S>
| { type: TActionTypes<Uppercase<T>>["FETCH_ALL"] }
| { type: TActionTypes<Uppercase<T>>["FETCH_ALL_FULFILLED"]; payload: Awaited<ReturnType<S[EServiceNames.FETCH_ALL]['execute']>> }
| { type: TActionTypes<Uppercase<T>>["SET_FILTERS"], payload: Record<string, any> }

export type TDynamicDataCrudActionInterfaces<T extends string, TItem, S extends TServices<any, any, any>> =
| TAllCommonActionInterfaces<T, TItem, S>
| TCrudActionInterfacesRestrictedToDynamicData<T, TItem>
