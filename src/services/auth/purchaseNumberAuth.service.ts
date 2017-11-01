import * as debug from 'debug';
import * as httpStatus from 'http-status';
import * as soap from 'soap';
import { ResultStatus } from '../../util/enums';
import { IResultInfo } from '../../util/interface';
import { MvtkReserveServiceError } from '../../util/mvtkReseveError';

const log = debug('mvtk-reserve-service:auth:purchaseNumberAuth');
const WSDL = '/Auth/PurchaseNumberAuthSvc.svc?singleWsdl';

/**
 * 購入管理番号情報
 * @interface IKnyknrNoInfoIn
 */
export interface IKnyknrNoInfoIn {
    /**
     * 購入管理番号（ムビチケ購入番号）
     */
    knyknrNo: string;
    /**
     * PINコード（ムビチケ暗証番号）
     */
    pinCd: string;
}

/**
 * 購入管理番号認証In
 * @interface IPurchaseNumberAuthIn
 */
export interface IPurchaseNumberAuthIn {
    /**
     * 興行会社コード
     */
    kgygishCd: string;
    /**
     * 情報種別コード
     */
    jhshbtsCd: InformationTypeCode;
    /**
     * 購入管理番号情報
     */
    knyknrNoInfoIn: IKnyknrNoInfoIn[];
    /**
     * 作品コード
     */
    skhnCd: string;
    /**
     * サイトコード
     */
    stCd: string;
    /**
     * 上映年月日(YYYY/MM/DD)
     */
    jeiYmd: string;
}

/**
 * 有効券情報
 * @interface IValidTicket
 */
export interface IValidTicket {
    /**
     * 有効券種区分
     */
    ykknshTyp: string;
    /**
     * 映写方式区分
     */
    eishhshkTyp: string;
    /**
     * 有効券種別枚数
     */
    ykknKnshbtsmiNum: string;
    /**
     * 鑑賞券販売単価
     */
    knshknhmbiUnip: string;
    /**
     * 計上単価
     */
    kijUnip: string;
}

/**
 * 無効券情報
 * @interface INvalidTicket
 */
export interface INvalidTicket {
    /**
     * 無効券種区分
     */
    mkknshTyp: string;
    /**
     * 無効券種別枚数
     */
    mkknKnshbtsmiNum: string;
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
 * 購入管理番号情報Out
 * @interface IPurchaseNumberInfo
 */
export interface IPurchaseNumberInfo {
    /**
     * 購入管理番号
     */
    knyknrNo: string;
    /**
     * 購入管理番号無効事由区分
     */
    knyknrNoMkujyuCd: string;
    /**
     * 興行ギフト券購入年月日
     */
    kgygftknknyYmd: string;
    /**
     * 興行ギフト券有効期間
     */
    kgygftknykTm: string;
    /**
     * 電子券区分
     */
    dnshKmTyp: string;
    /**
     * 全国共通券・劇場券区分
     */
    znkkkytsknGkjknTyp: string;
    /**
     * 有効券枚数
     */
    ykknmiNum: string;
    /**
     * 無効券枚数
     */
    mkknmiNum: string;
    /**
     * 有効券情報リスト
     */
    ykknInfo: IValidTicket[];
    /**
     * 無効券情報リスト
     */
    mkknInfo: INvalidTicket[];
}

/**
 * 購入管理番号認証Out
 */
export interface IPurchaseNumberAuthResult extends IResultInfo {
    /**
     * 有効券枚数合計
     */
    ykknmiNumSum: number;
    /**
     * 無効券枚数合計
     */
    mkknmiNumSum: number;
    /**
     * 購入管理番号情報
     */
    knyknrNoInfoOut: IPurchaseNumberInfo[];
}

/**
 * 購入管理番号認証
 * @function purchaseNumberAuth
 *
 */
export async function purchaseNumberAuth(args: IPurchaseNumberAuthIn, options?: soap.IOptions): Promise<IPurchaseNumberAuthResult> {
    log('purchaseNumberAuth');
    // tslint:disable-next-line:no-http-string max-line-length
    const namespace = 'http://schemas.datacontract.org/2004/07/MTBS.WCFModel.Auth.PurchaseNumberAuthSvc.PurchaseNumberAuthModel';
    // Inのkey順番は固定
    const input = {
        kgygishCd: args.kgygishCd,
        jhshbtsCd: args.jhshbtsCd,
        knyknrNoInfoIn: {
            KnyknrNoInfoIn: args.knyknrNoInfoIn.map((knyknrNoInfo) => {
                return {
                    KNYKNR_NO: knyknrNoInfo.knyknrNo,
                    PIN_CD: knyknrNoInfo.pinCd,
                    targetNSAlias: 'tns',
                    targetNamespace: namespace
                };
            }),
            targetNSAlias: 'q1',
            // tslint:disable-next-line:no-http-string max-line-length
            targetNamespace: namespace
        },
        skhnCd: args.skhnCd,
        stCd: args.stCd,
        jeiYmd: args.jeiYmd
    };
    const method = 'PurchaseNumberAuthAsync';
    const url = `${(<string>process.env.MVTK_RESERVE_ENDPOINT)}${WSDL}`;
    const client = await soap.createClientAsync(url, options);
    // log('describe', JSON.stringify(client.describe())); // 定義確認
    const result = await (<Function>client[method])(input);
    if (result.PurchaseNumberAuthResult.RESULT_INFO.STATUS !== ResultStatus.Success) {
        throw new MvtkReserveServiceError(
            httpStatus.BAD_REQUEST,
            result.PurchaseNumberAuthResult.RESULT_INFO.STATUS,
            result.PurchaseNumberAuthResult.RESULT_INFO.MESSAGE
        );
    }

    return {
        resultInfo: {
            status: result.PurchaseNumberAuthResult.RESULT_INFO.STATUS,
            message: result.PurchaseNumberAuthResult.RESULT_INFO.MESSAGE
        },
        ykknmiNumSum: result.PurchaseNumberAuthResult.YKKNMI_NUM_SUM,
        mkknmiNumSum: result.PurchaseNumberAuthResult.MKKNMI_NUM_SUM,
        knyknrNoInfoOut: result.PurchaseNumberAuthResult.KNYKNR_NO_INFO_OUT.KnyknrNoInfoOut
    };
}

/**
 * 情報種別コード
 */
export enum InformationTypeCode {
    /**
     * 有効券の情報のみ
     */
    Valid = '1',
    /**
     * 無効券の情報のみ
     */
    Invalid = '2',
    /**
     * 有効券・無効券の情報両方
     */
    All = '3'
}

/**
 * 購入管理番号無効事由
 */
export enum PurchaseInvalidityReason {
    /**
     * 存在無
     */
    NoExistence = '01',
    /**
     * Pinｺｰﾄﾞ必須
     */
    PinCodeRequired = '02',
    /**
     * Pinｺｰﾄﾞ認証ｴﾗ-
     */
    PinCodeError = '03',
    /**
     * 作品不一致
     */
    FilmDiscrepancy = '04',
    /**
     * 未ｱｸﾃｨﾍﾞｰﾄ
     */
    Unactivated = '05',
    /**
     * 選択興行対象外
     */
    NotEligibleForSelection = '06',
    /**
     * 有効期限切れ
     */
    Expired = '07',
    /**
     * 座席予約期間外
     */
    OutsideSeatingReservationPeriod = '08',
    /**
     * その他
     */
    Other = '09',
    /**
     * 座席予約開始前
     */
    BeforeTheSeatReservationStarts = '11',
    /**
     * 仮お直り購入番号数不一致
     */
    TemporaryRedemptionNumberPurchaseNumberMismatch = '12'
}
