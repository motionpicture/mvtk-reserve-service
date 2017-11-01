/**
 * mvtk-reserve-service
 * @ignore
 */

import * as purchaseNumberAuthService from './services/auth/purchaseNumberAuth.service';

/**
 * サービスモジュール群
 * @namespace
 */
export namespace services {
    export namespace auth {
        export import purchaseNumberAuth = purchaseNumberAuthService;
    }
}
