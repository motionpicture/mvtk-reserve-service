/**
 * 購入管理番号認証
 * @ignore
 */

import * as assert from 'assert';
import * as sinon from 'sinon';
import * as soap from 'soap';
import { ResultStatus } from '../../util/enums';
import * as purchaseNumberAuthService from './purchaseNumberAuth.service';

describe('購入管理番号認証', () => {

    it('正常', async () => {
        const createClientAsync = sinon.stub(soap, 'createClientAsync').returns(
            Promise.resolve({
                PurchaseNumberAuthAsync: () => {
                    return Promise.resolve({
                        PurchaseNumberAuthResult: {
                            RESULT_INFO: {
                                STATUS: ResultStatus.Success,
                                MESSAGE: ''
                            },
                            YKKNMI_NUM_SUM: 1,
                            MKKNMI_NUM_SUM: 1,
                            KNYKNR_NO_INFO_OUT: {
                                KnyknrNoInfoOut: [
                                    {
                                        YKKN_INFO: {
                                            YkknInfo: [{}]
                                        },
                                        MKKN_INFO: {
                                            MkknInfo: [{}]
                                        }
                                    }
                                ]
                            }
                        }
                    });
                }
            })
        );

        const args: purchaseNumberAuthService.IPurchaseNumberAuthIn = {
            kgygishCd: '000000', //興行会社コード
            jhshbtsCd: purchaseNumberAuthService.InformationTypeCode.All, //情報種別コード
            knyknrNoInfoIn: [
                {
                    knyknrNo: '0123456789', //購入管理番号
                    pinCd: '0000' // PINコード
                }
            ],
            skhnCd: '1000000', //作品コード
            stCd: '00', //サイトコード
            jeiYmd: '2017/02/16' //上映年月日
        };

        const result = await purchaseNumberAuthService.purchaseNumberAuth(args);
        assert(result.resultInfo.status === ResultStatus.Success);
        createClientAsync.restore();
    });

    it('レスポンスステータスエラー', async () => {
        const createClientAsync = sinon.stub(soap, 'createClientAsync').returns(
            Promise.resolve({
                PurchaseNumberAuthAsync: () => {
                    return Promise.resolve({
                        PurchaseNumberAuthResult: {
                            RESULT_INFO: {
                                STATUS: ResultStatus.CriticalError,
                                MESSAGE: ''
                            }
                        }
                    });
                }
            })
        );

        const args: purchaseNumberAuthService.IPurchaseNumberAuthIn = {
            kgygishCd: '000000', //興行会社コード
            jhshbtsCd: purchaseNumberAuthService.InformationTypeCode.All, //情報種別コード
            knyknrNoInfoIn: [
                {
                    knyknrNo: '0123456789', //購入管理番号
                    pinCd: '0000' // PINコード
                }
            ],
            skhnCd: '1000000', //作品コード
            stCd: '00', //サイトコード
            jeiYmd: '2017/02/16' //上映年月日
        };

        try {
            await purchaseNumberAuthService.purchaseNumberAuth(args);
        } catch (err) {
            assert(err.status === ResultStatus.CriticalError);
        }
        createClientAsync.restore();
    });

    it('サービス側のサーバーエラー', async () => {
        const createClientAsync = sinon.stub(soap, 'createClientAsync').returns(
            Promise.reject(new Error('ERROR'))
        );

        const args: purchaseNumberAuthService.IPurchaseNumberAuthIn = {
            kgygishCd: '000000', //興行会社コード
            jhshbtsCd: purchaseNumberAuthService.InformationTypeCode.All, //情報種別コード
            knyknrNoInfoIn: [
                {
                    knyknrNo: '0123456789', //購入管理番号
                    pinCd: '0000' // PINコード
                }
            ],
            skhnCd: '1000000', //作品コード
            stCd: '00', //サイトコード
            jeiYmd: '2017/02/16' //上映年月日
        };

        try {
            await purchaseNumberAuthService.purchaseNumberAuth(args);
        } catch (err) {
            assert(err.message === 'ERROR');
        }
        createClientAsync.restore();
    });
});
