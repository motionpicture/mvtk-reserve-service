/**
 * mvtk-reserve-service
 * @ignore
 */

import * as purchaseNumberAuthService from './services/auth/purchaseNumberAuth.service';
import * as seatInfoSyncService from './services/seat/seatInfoSync.service';
import * as utilEnums from './util/enums';

/**
 * サービスモジュール群
 * @namespace
 */
export namespace services {
    export namespace auth {
        export import purchaseNumberAuth = purchaseNumberAuthService;
    }
    export namespace seat {
        export import seatInfoSync = seatInfoSyncService;
    }
}

/**
 * ユーティリティモジュール群
 * @namespace
 */
export namespace util {
    export import enums = utilEnums;
}
