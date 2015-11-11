/**
 * @fileOverview
 * 関数の引数検査用の関数群。
 * 関数が許容しない型や値が来た場合に例外をスローします。
 *
 * これらは契約プログラミング手法で言う事前条件チェックに使用します。
 *
 * 例えば、DBのupdateを行う関数に、ID値としてstring値が渡されるべき場面で
 * string以外の値が渡されるのはプログラミング上のバグです。
 * このように想定外の値が渡されるのはバグである、という場面で使用してください。
 * そもそもどのような値が来るか想定できない
 * ユーザの入力値バリデーションには用いないでください。
 *
 * @author Tomonori Kawano <kawano_tomonori@cyberagent.co.jp>
 */

/**
 * mongoDBの_id, キーとして使用可能な文字列かチェックする
 * mongoは文字列を受け入れるが、ここでは許可しない文字列とする。
 *
 * @param {*} str 検査する値
 * @param {string} name 文字列の名前
 * @throw str が不適切な場合
 */
function isString(str, name) {
    if (typeof str !== 'string') {
        throw new Error(name + ' must be a string, but it is a ' + (typeof str));
    }
    if (str === '') {
        throw new Error(name + ' must not be an empty string');
    }
}

exports.isString = isString;

/**
 * 非負整数（0,1,2,3..）かどうかチェック
 *
 * @param {*} num 検査する値
 * @param {string} name 検査する値の名前
 * @throw num が非負整数でない場合
 */
function isNonNegativeInteger(num, name) {

    if (typeof num !== 'number') {
        throw new Error(name +  'must be a number, but it is a ' + (typeof num));
    }

    // 9007199254740992 = 2の53乗より大きい場合は浮動小数点
    if (!Number.isFinite(num) || num < 0 || num >= 9007199254740992 || ~~num !== num) {
        throw new Error(name + ' must be a non negetive integer');
    }
}
exports.isNonNegativeInteger = isNonNegativeInteger;

/**
 * プレーンオブジェクトであることを確認
 *
 * @param obj 検査する値
 * @param name なまえ
 * @throw objがプレーンオブジェクトでない場合
 */
function isPlainObject(obj, name) {
    if (!obj || obj.constructor !== Object) {
        throw new Error(name + ' must be a plain object');
    }
}
exports.isPlainObject = isPlainObject;


/**
 * nullでないことを確認
 *
 * @param obj 検査する値
 * @param name なまえ
 * @throw objがnullでない場合
 */
function isNotNull(obj, name) {
    if (obj === null || obj === undefined) {
        throw new Error(name + ' must not be null');
    }
}
exports.isNotNull = isNotNull;

/**
 * 指定の型の配列であることを確認
 * @param obj 検査する値
 * @param type 型名（typeofでチェックする）
 * @param name なまえ
 */
function isArray(obj, type, name) {
    if (!Array.isArray(obj)) {
       throw new Error(name + ' must be an string array');
    }
    if (obj.some(function(item) { return typeof item !== type;})) {
       throw new Error(name + ' must be an string array');
    }
}
exports.isArray = isArray;

/**
 * プレーンオブジェクト、もしくは配列であることを確認
 *
 * @param obj 検査する値
 * @param name なまえ
 * @throw objがプレーンオブジェクト、もしくは配列でない場合
 */
function isPlainObjectOrArray(obj, name) {
    var isError = true;

    // オブジェクトだったらエラーとみなさない
    if (obj && obj.constructor === Object) {
        isError = false;
    }

    // もしくは配列だったらエラーとみなさない
    if (Array.isArray(obj)) {
        isError = false;
    }

    if (isError) {
        throw new Error(name + ' must be a plan object or an string array ');
    }
}
exports.isPlainObjectOrArray = isPlainObjectOrArray;
