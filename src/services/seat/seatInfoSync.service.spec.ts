/**
 * 座席指定情報連携
 * @ignore
 */

import * as assert from 'assert';
import * as sinon from 'sinon';
import * as soap from 'soap';
import { ResultStatus } from '../../util/enums';
import * as seatInfoSyncService from './seatInfoSync.service';

describe('座席指定情報連携', () => {

    it('正常', async () => {
        const createClientAsync = sinon.stub(soap, 'createClientAsync').returns(
            Promise.resolve({
                SeatInfoSyncAsync: () => {
                    return Promise.resolve({
                        SeatInfoSyncResult: {
                            RESULT_INFO: {
                                STATUS: ResultStatus.Success,
                                MESSAGE: ''
                            },
                            ZSKYYK_RESULT: seatInfoSyncService.ReservationResult.Success,
                            MKKNYKNR_NO_INFO: null
                        }
                    });
                }
            })
        );

        const args: seatInfoSyncService.ISeatInfoSyncIn = {
            kgygishCd: 'SSK000', //興行会社コード
            yykDvcTyp: seatInfoSyncService.ReserveDeviceType.EntertainerSitePC, //予約デバイス区分
            trkshFlg: seatInfoSyncService.DeleteFlag.False, //取消フラグ
            kgygishSstmZskyykNo: '118124', //興行会社システム座席予約番号
            kgygishUsrZskyykNo: '124', //興行会社ユーザー座席予約番号
            jeiDt: '2017/03/02 10:00:00', //上映日時
            kijYmd: '2017/03/02', //計上年月日
            stCd: '18', //サイトコード
            screnCd: '10', //スクリーンコード
            knyknrNoInfo: [
                {
                    knyknrNo: '4450899842', //購入管理番号（ムビチケ購入番号）
                    pinCd: '7648', //pinコード（ムビチケ暗証番号）
                    knshInfo: [
                        {
                            knshTyp: '01', //券種区分
                            miNum: 2 //枚数
                        }
                    ]
                }
            ],
            zskInfo: [
                { zskCd: 'Ａ－２' }, { zskCd: 'Ａ－３' }
            ],
            skhnCd: '1622700' //作品コード
        };

        const result = await seatInfoSyncService.seatInfoSync(args);
        assert(result.resultInfo.status === ResultStatus.Success);
        createClientAsync.restore();
    });

    it('レスポンスステータスエラー', async () => {
        const createClientAsync = sinon.stub(soap, 'createClientAsync').returns(
            Promise.resolve({
                SeatInfoSyncAsync: () => {
                    return Promise.resolve({
                        SeatInfoSyncResult: {
                            RESULT_INFO: {
                                STATUS: ResultStatus.CriticalError,
                                MESSAGE: ''
                            },
                            ZSKYYK_RESULT: seatInfoSyncService.ReservationResult.Success,
                            MKKNYKNR_NO_INFO: null
                        }
                    });
                }
            })
        );

        const args: seatInfoSyncService.ISeatInfoSyncIn = {
            kgygishCd: 'SSK000', //興行会社コード
            yykDvcTyp: seatInfoSyncService.ReserveDeviceType.EntertainerSitePC, //予約デバイス区分
            trkshFlg: seatInfoSyncService.DeleteFlag.False, //取消フラグ
            kgygishSstmZskyykNo: '118124', //興行会社システム座席予約番号
            kgygishUsrZskyykNo: '124', //興行会社ユーザー座席予約番号
            jeiDt: '2017/03/02 10:00:00', //上映日時
            kijYmd: '2017/03/02', //計上年月日
            stCd: '18', //サイトコード
            screnCd: '10', //スクリーンコード
            knyknrNoInfo: [
                {
                    knyknrNo: '4450899842', //購入管理番号（ムビチケ購入番号）
                    pinCd: '7648', //pinコード（ムビチケ暗証番号）
                    knshInfo: [
                        {
                            knshTyp: '01', //券種区分
                            miNum: 2 //枚数
                        }
                    ]
                }
            ],
            zskInfo: [
                { zskCd: 'Ａ－２' }, { zskCd: 'Ａ－３' }
            ],
            skhnCd: '1622700' //作品コード
        };

        try {
            await seatInfoSyncService.seatInfoSync(args);
        } catch (err) {
            assert(err.status === ResultStatus.CriticalError);
        }
        createClientAsync.restore();
    });

    it('座席予約結果エラー', async () => {
        const createClientAsync = sinon.stub(soap, 'createClientAsync').returns(
            Promise.resolve({
                SeatInfoSyncAsync: () => {
                    return Promise.resolve({
                        SeatInfoSyncResult: {
                            RESULT_INFO: {
                                STATUS: ResultStatus.Success,
                                MESSAGE: ''
                            },
                            ZSKYYK_RESULT: seatInfoSyncService.ReservationResult.FailureInvalid,
                            MKKNYKNR_NO_INFO: null
                        }
                    });
                }
            })
        );

        const args: seatInfoSyncService.ISeatInfoSyncIn = {
            kgygishCd: 'SSK000', //興行会社コード
            yykDvcTyp: seatInfoSyncService.ReserveDeviceType.EntertainerSitePC, //予約デバイス区分
            trkshFlg: seatInfoSyncService.DeleteFlag.False, //取消フラグ
            kgygishSstmZskyykNo: '118124', //興行会社システム座席予約番号
            kgygishUsrZskyykNo: '124', //興行会社ユーザー座席予約番号
            jeiDt: '2017/03/02 10:00:00', //上映日時
            kijYmd: '2017/03/02', //計上年月日
            stCd: '18', //サイトコード
            screnCd: '10', //スクリーンコード
            knyknrNoInfo: [
                {
                    knyknrNo: '4450899842', //購入管理番号（ムビチケ購入番号）
                    pinCd: '7648', //pinコード（ムビチケ暗証番号）
                    knshInfo: [
                        {
                            knshTyp: '01', //券種区分
                            miNum: 2 //枚数
                        }
                    ]
                }
            ],
            zskInfo: [
                { zskCd: 'Ａ－２' }, { zskCd: 'Ａ－３' }
            ],
            skhnCd: '1622700' //作品コード
        };

        try {
            await seatInfoSyncService.seatInfoSync(args);
        } catch (err) {
            assert(err.message === `ReservationResult ${seatInfoSyncService.ReservationResult.FailureInvalid}`);
        }
        createClientAsync.restore();
    });

    it('サービス側のサーバーエラー', async () => {
        const createClientAsync = sinon.stub(soap, 'createClientAsync').returns(
            Promise.reject(new Error('ERROR'))
        );

        const args: seatInfoSyncService.ISeatInfoSyncIn = {
            kgygishCd: 'SSK000', //興行会社コード
            yykDvcTyp: seatInfoSyncService.ReserveDeviceType.EntertainerSitePC, //予約デバイス区分
            trkshFlg: seatInfoSyncService.DeleteFlag.False, //取消フラグ
            kgygishSstmZskyykNo: '118124', //興行会社システム座席予約番号
            kgygishUsrZskyykNo: '124', //興行会社ユーザー座席予約番号
            jeiDt: '2017/03/02 10:00:00', //上映日時
            kijYmd: '2017/03/02', //計上年月日
            stCd: '18', //サイトコード
            screnCd: '10', //スクリーンコード
            knyknrNoInfo: [
                {
                    knyknrNo: '4450899842', //購入管理番号（ムビチケ購入番号）
                    pinCd: '7648', //pinコード（ムビチケ暗証番号）
                    knshInfo: [
                        {
                            knshTyp: '01', //券種区分
                            miNum: 2 //枚数
                        }
                    ]
                }
            ],
            zskInfo: [
                { zskCd: 'Ａ－２' }, { zskCd: 'Ａ－３' }
            ],
            skhnCd: '1622700' //作品コード
        };

        try {
            await seatInfoSyncService.seatInfoSync(args);
        } catch (err) {
            assert(err.message === 'ERROR');
        }
        createClientAsync.restore();
    });
});
