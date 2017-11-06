import * as debug from 'debug';
import * as soap from 'soap';

const log = debug('mvtk-reserve-service:util:client');
/**
 * soapClient生成
 * @function createSoapClientAsync
 */
export async function createSoapClientAsync(url: string, options?: soap.IOptions) {
    log('createSoapClientAsync');

    return new Promise<soap.Client>((resolve, reject) => {
        soap.createClientAsync(url, options).then((client) => {
            // log('client', client);
            // if (process.env.MVTK_RESERVE_USER !== undefined
            //     && process.env.MVTK_RESERVE_PASSWORD !== undefined) {
            //     // BASIC認証
            //     client.setSecurity(
            //         new soap.BasicAuthSecurity(
            //             (<string>process.env.MVTK_RESERVE_USER),
            //             (<string>process.env.MVTK_RESERVE_PASSWORD)
            //         )
            //     );
            // }
            resolve(client);
        }).catch((err) => {
            reject(err);
        });
    });
}
