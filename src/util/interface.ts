/**
 * 処理結果情報
 * @interface IResultInfo
 */
export interface IResultInfo {
    resultInfo: {
        status: string,
        message: string
    };
}

/**
 * methodオプション
 * @interface IOption
 */
export interface IOption {
    timeout: number;
}
