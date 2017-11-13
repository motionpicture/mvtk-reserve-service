/**
 * 座席指定情報連携
 */
import * as debug from 'debug';
import * as httpStatus from 'http-status';
import * as soap from 'soap';
import { createSoapClientAsync } from '../../util/client';
import { ResultStatus } from '../../util/enums';
import { IResultInfo } from '../../util/interface';
import { MvtkReserveServiceError } from '../../util/mvtkReseveError';

const log = debug('mvtk-reserve-service:seat:seatInfoSync');
const WSDL = '/Seat/SeatInfoSyncSvc.svc?singleWsdl';

/**
 * 取消フラグ
 */
export enum DeleteFlag {
    /**
     * 登録
     */
    False = '0',
    /**
     * 削除
     */
    True = '1'
}

/**
 * 座席予約結果
 */
export enum ReservationResult {
    /**
     * 座席予約成功
     */
    Success = '01',
    /**
     * 座席予約失敗(無効券あり）
     */
    FailureInvalid = '02',
    /**
     * 座席予約失敗(購入管理番号が重複して送信された）
     */
    FailureOverlap = '03',
    /**
     * 座席予約失敗（着券を要求された券種は存在しない）
     */
    FailureNotExist = '04',
    /**
     * 座席予約失敗（その他）
     */
    FailureOther = '09',
    /**
     * 取消成功
     */
    CancelSuccess = '11',
    /**
     * 取消失敗
     */
    CancelFailure = '19'
}

/**
 * 購入管理番号無効事由区分
 */
export enum InvalidityCategory {
    /**
     * 購入管理番号が存在しない
     */
    NotFound = '01',
    /**
     * PINコードの入力がない
     */
    NoInputOfPinCode = '02',
    /**
     * PINコードに誤りがある
     */
    IncorrectPinCode = '03',
    /**
     * 当該購入管理番号に紐づく作品と、Inパラメーターで指定された作品コードの作品が一致しない
     */
    FilmNotMatch = '04',
    /**
     * アクティベートされていない
     */
    NotActivated = '05',
    /**
     * 他興行の劇場券である
     */
    OtherEntertainmentTheaterVouchers = '06',
    /**
     * （未使用の区分）有効期限切れ
     */
    Expired = '07',
    /**
     * その他
     */
    Other = '09',
    /**
     * 当該カード券の購入管理番号では、まだ座席指定ができない（購入翌日（例外あり）から座席指定ができるルール）
     */
    CanNotDesignateASeatYet = '11',
    /**
     * お直りした購入番号の数が、本APIのパラメータの購入番号の数と一致していない
     */
    notMatchThePurchaseNumber = '12'
}

/**
 * 予約デバイス区分
 */
export enum ReserveDeviceType {
    /**
     * ムビチケサイト ※未使用
     */
    MvtkSite = '01',
    /**
     * 興行サイト(PC)
     */
    EntertainerSitePC = '02',
    /**
     * 興行サイト(SP)
     */
    EntertainerSiteSP = '03',
    /**
     * 各劇場窓口(窓口PC)
     */
    TheaterPC = '04"',
    /**
     * 自動券売機
     */
    TicketMachine = '05',
    /**
     * 自動発券機(ﾑﾋﾞﾁｹ端末) ※未使用
     */
    MvtkTicketMachine = '06'
}

/**
 * 購入管理番号情報
 * @interface IKnyknrNoInfo
 */
export interface IKnyknrNoInfo {
    /**
     * 購入管理番号（ムビチケ購入番号）
     */
    knyknrNo: string;
    /**
     * pinコード（ムビチケ暗証番号）
     */
    pinCd: string;
    /**
     *  券種情報
     */
    knshInfo: {
        /**
         * 券種区分
         */
        knshTyp: string;
        /**
         * 枚数
         */
        miNum: number;
    }[];
}

/**
 * 座席指定情報連携In
 * @interface ISeatInfoSyncIn
 */
export interface ISeatInfoSyncIn {
    /**
     * 興行会社コード
     */
    kgygishCd: string;
    /**
     * 予約デバイス区分
     */
    yykDvcTyp: string;
    /**
     * 取消フラグ
     */
    trkshFlg: string;
    /**
     * 興行会社システム座席予約番号
     */
    kgygishSstmZskyykNo: string;
    /**
     * 興行会社ユーザー座席予約番号
     */
    kgygishUsrZskyykNo: string;
    /**
     * 上映日時
     */
    jeiDt: string;
    /**
     * 計上年月日
     */
    kijYmd: string;
    /**
     * サイトコード
     */
    stCd: string;
    /**
     * スクリーンコード
     */
    screnCd: string;
    /**
     * 購入管理番号情報
     */
    knyknrNoInfo: IKnyknrNoInfo[];
    /**
     * 座席情報（itemArray）
     */
    zskInfo: {
        /**
         * 座席コード
         */
        zskCd: string;
    }[];
    /**
     * 作品コード
     */
    skhnCd: string;
}

/**
 * 無効購入管理番号情報
 * @interface IInvalidPurchaseNumberInfo
 */
export interface IInvalidPurchaseNumberInfo {
    /**
     * 券種管理番号
     */
    knyknrNo: string;
    /**
     * 購入管理番号無効事由区分
     */
    knyknrNoMkujyuTyp: string;
    /**
     * 購入管理番号別無効券枚数
     */
    knyknrNobtsMkknmiNum: string;
    /**
     * 無効券種情報
     */
    mkknshInfo: InvalidTicketTypeInfo[];
    /**
     * 無効券詳細情報
     */
    mkknShsiInfo: InvalidTicketDetailInfo[];
}

/**
 * 無効券種情報
 */
export interface InvalidTicketTypeInfo {
    /**
     * 無効券種区分
     */
    mkknshTyp: string;
    /**
     * 要求枚数
     */
    reqMiNum: string;
    /**
     * 有効枚数
     */
    ykMiNum: string;
    /**
     * 無効枚数
     */
    mkMiNum: string;
}

/**
 * 無効券詳細情報
 */
export interface InvalidTicketDetailInfo {
    /**
     * 券種区分
     */
    knshTyp: string;
    /**
     * 枚数
     */
    miNum: string;
    /**
     * 無効事由区分
     */
    mkjyTyp: string;
    /**
     * 予約日時
     */
    yykDt: string;
    /**
     * 使用上映日時
     */
    shyJeiDt: string;
    /**
     * 使用サイトコード
     */
    shyStCd: string;
    /**
     * 使用スクリーンコード
     */
    shyScrnCd: string;
    /**
     * 使用作品コード
     */
    shySkhnCd: string;
    /**
     * 使用作品名
     */
    shySkhnNm: string;
}

/**
 * 座席指定情報連携Out
 */
export interface ISeatInfoSyncResult extends IResultInfo {
    /**
     * 座席予約結果
     */
    zskyykResult: ReservationResult;
    /**
     * 無効購入管理番号情報
     */
    mkknyknrNoInfo: IInvalidPurchaseNumberInfo[];
}

/**
 * 座席指定情報連携
 * @function seatInfoSync
 *
 */
export async function seatInfoSync(args: ISeatInfoSyncIn, options?: soap.IOptions): Promise<ISeatInfoSyncResult> {
    log('seatInfoSync');
    // tslint:disable-next-line:no-http-string max-line-length
    const namespace = 'http://schemas.datacontract.org/2004/07/MTBS.WCFModel.Seat.SeatInfoSyncSvc.SeatInfoSyncModel';
    // Inのkey順番は固定
    const input = {
        kgygishCd: args.kgygishCd,
        yykDvcTyp: args.yykDvcTyp,
        trkshFlg: args.trkshFlg,
        kgygishSstmZskyykNo: args.kgygishSstmZskyykNo,
        kgygishUsrZskyykNo: args.kgygishUsrZskyykNo,
        jeiDt: args.jeiDt,
        kijYmd: args.kijYmd,
        stCd: args.stCd,
        screnCd: args.screnCd,
        knyknrNoInfo: {
            KnyknrNoInfo: args.knyknrNoInfo.map((knyknrNoInfo) => {
                return {
                    KNSH_INFO: {
                        KnshInfo: knyknrNoInfo.knshInfo.map((knshInfo) => {
                            return {
                                KNSH_TYP: knshInfo.knshTyp,
                                MI_NUM: String(knshInfo.miNum),
                                targetNSAlias: 'tns',
                                targetNamespace: namespace
                            };
                        }),
                        targetNSAlias: 'tns',
                        targetNamespace: namespace
                    },
                    KNYKNR_NO: knyknrNoInfo.knyknrNo,
                    PIN_CD: knyknrNoInfo.pinCd,
                    targetNSAlias: 'tns',
                    targetNamespace: namespace
                };
            }),
            targetNSAlias: 'q1',
            targetNamespace: namespace
        },
        zskInfo: {
            ZskInfo: args.zskInfo.map((zskInfo) => {
                return {
                    ZSK_CD: zskInfo.zskCd,
                    targetNSAlias: 'tns',
                    targetNamespace: namespace
                };
            }),
            targetNSAlias: 'q2',
            targetNamespace: namespace
        },
        skhnCd: args.skhnCd
    };
    // log('input', JSON.stringify(input));
    const method = 'SeatInfoSyncAsync';
    const url = `${(<string>process.env.MVTK_RESERVE_ENDPOINT)}${WSDL}`;
    const client = await createSoapClientAsync(url, options);
    // log('describe', JSON.stringify(client.describe())); // 定義確認
    const result = await (<Function>client[method])(input);
    if (result.SeatInfoSyncResult.RESULT_INFO.STATUS !== ResultStatus.Success) {
        throw new MvtkReserveServiceError(
            httpStatus.BAD_REQUEST,
            result.SeatInfoSyncResult.RESULT_INFO.STATUS,
            result.SeatInfoSyncResult.RESULT_INFO.MESSAGE
        );
    }

    if (result.SeatInfoSyncResult.ZSKYYK_RESULT !== ReservationResult.Success
        && result.SeatInfoSyncResult.ZSKYYK_RESULT !== ReservationResult.CancelSuccess) {
        throw new MvtkReserveServiceError(
            httpStatus.BAD_REQUEST,
            result.SeatInfoSyncResult.RESULT_INFO.STATUS,
            `ReservationResult ${result.SeatInfoSyncResult.ZSKYYK_RESULT}`
        );
    }

    return {
        resultInfo: {
            status: result.SeatInfoSyncResult.RESULT_INFO.STATUS,
            message: result.SeatInfoSyncResult.RESULT_INFO.MESSAGE
        },
        zskyykResult: result.SeatInfoSyncResult.ZSKYYK_RESULT,
        mkknyknrNoInfo: result.SeatInfoSyncResult.MKKNYKNR_NO_INFO
    };
}
