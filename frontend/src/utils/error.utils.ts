// @@ pnp
// import { HttpRequestError } from '@pnp/queryable';


export function extractErrorMessage( error: Error ): string {

    const { message } = error;
    const stringifiedJsonDataStart = message.indexOf('{');
    const stringifiedJsonDataEnd = message.length;
    const stringifiedJsonData = message.slice( stringifiedJsonDataStart, stringifiedJsonDataEnd );
    
    try {

        return JSON.parse( stringifiedJsonData )['odata.error'].message.value;
    } catch {

        return message;
    }
}