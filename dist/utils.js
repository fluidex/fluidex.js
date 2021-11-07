"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha256Snark = exports.hashStateTree = exports.padZeros = exports.extract = exports.padding256 = void 0;
const ffjs_1 = require("./ffjs");
const hash_1 = require("./hash");
const crypto = require("crypto");
const circomlib_1 = require("circomlib");
/**
 * Convert to hexadecimal string padding until 256 characters
 * @param {Number | Scalar} n - Input number
 * @returns {String} String encoded as hexadecimal with 256 characters
 */
function padding256(n) {
    let nstr = ffjs_1.Scalar.e(n).toString(16);
    while (nstr.length < 64)
        nstr = '0' + nstr;
    nstr = `0x${nstr}`;
    return nstr;
}
exports.padding256 = padding256;
/**
 * Mask and shift a Scalar
 * @param {Scalar} num - Input number
 * @param {Number} origin - Initial bit
 * @param {Number} len - Bit lenght of the mask
 * @returns {Scalar} Extracted Scalar
 */
function extract(num, origin, len) {
    const mask = ffjs_1.Scalar.sub(ffjs_1.Scalar.shl(1, len), 1);
    return ffjs_1.Scalar.band(ffjs_1.Scalar.shr(num, origin), mask);
}
exports.extract = extract;
/**
 * Pad a string hex number with 0
 * @param {String} str - String input
 * @param {Number} length - Length of the resulting string
 * @returns {String} Resulting string
 */
function padZeros(str, length) {
    if (length > str.length)
        str = '0'.repeat(length - str.length) + str;
    return str;
}
exports.padZeros = padZeros;
/**
 * (Hash Sha256 of an hexadecimal string) % (Snark field)
 * @param {String} str - String input in hexadecimal encoding
 * @returns {String} Resulting string encoded as hexadecimal
 */
function sha256Snark(str) {
    const hash = crypto.createHash('sha256').update(str).digest('hex');
    const h = ffjs_1.Scalar.mod(ffjs_1.Scalar.fromString(hash, 16), circomlib_1.babyJub.p);
    return h;
}
exports.sha256Snark = sha256Snark;
/**
 * Convert Array of hexadecimals strings to array of BigInts
 * @param {Array} arrayHex - array of strings encoded as hex
 * @returns {Array} - array of BigInts
 */
function arrayHexToBigInt(arrayHex) {
    const arrayBigInt = [];
    arrayHex.forEach(element => {
        arrayBigInt.push(ffjs_1.Scalar.fromString(element, 16));
    });
    return arrayBigInt;
}
/**
 * Concatenate array of strings with fixed 32bytes fixed length
 * @param {Array} arrayStr - array of strings
 * @returns {String} - result array
 */
function buildElement(arrayStr) {
    let finalStr = '';
    arrayStr.forEach(element => {
        finalStr = finalStr.concat(element);
    });
    return `0x${padZeros(finalStr, 64)}`;
}
/**
 * Hash tree state
 * @param {Scalar} balance - account balance
 * @param {Scalar} tokenId - tokend identifier
 * @param {Scalar} Ax - x coordinate babyjubjub
 * @param {Scalar} Ay - y coordinate babyjubjub
 * @param {Scalar} ethAddress - ethereum address
 * @param {Scalar} nonce - nonce
 * @returns {Object} - Contains hash state value, entry elements and leaf raw object
 */
function hashStateTree(balance, tokenId, Ax, Ay, ethAddress, nonce) {
    // Build Entry
    // element 0
    const tokenStr = padZeros(tokenId.toString('16'), 8);
    const nonceStr = padZeros(nonce.toString('16'), 12);
    const e0 = buildElement([nonceStr, tokenStr]);
    // element 1
    const e1 = buildElement([balance.toString('16')]);
    // element 2
    const e2 = buildElement([Ax.toString('16')]);
    // element 3
    const e3 = buildElement([Ay.toString('16')]);
    // element 4
    const e4 = buildElement([ethAddress.toString('16')]);
    // Get array BigInt
    const entryBigInt = arrayHexToBigInt([e0, e1, e2, e3, e4]);
    // Object leaf
    const leafObj = {
        balance,
        tokenId,
        Ax,
        Ay,
        ethAddress,
        nonce,
    };
    // Hash entry and object
    return { leafObj, elements: { e0, e1, e2, e3, e4 }, hash: hash_1.hash(entryBigInt) };
}
exports.hashStateTree = hashStateTree;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQWdDO0FBQ2hDLGlDQUE4QjtBQUM5QixpQ0FBaUM7QUFDakMseUNBQW9DO0FBRXBDOzs7O0dBSUc7QUFDSCxTQUFTLFVBQVUsQ0FBQyxDQUFDO0lBQ25CLElBQUksSUFBSSxHQUFHLGFBQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3BDLE9BQU8sSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFO1FBQUUsSUFBSSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7SUFDM0MsSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFLENBQUM7SUFDbkIsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBb0dRLGdDQUFVO0FBbEduQjs7Ozs7O0dBTUc7QUFDSCxTQUFTLE9BQU8sQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUc7SUFDL0IsTUFBTSxJQUFJLEdBQUcsYUFBTSxDQUFDLEdBQUcsQ0FBQyxhQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMvQyxPQUFPLGFBQU0sQ0FBQyxJQUFJLENBQUMsYUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDcEQsQ0FBQztBQXdGb0IsMEJBQU87QUF0RjVCOzs7OztHQUtHO0FBQ0gsU0FBUyxRQUFRLENBQUMsR0FBRyxFQUFFLE1BQU07SUFDM0IsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU07UUFBRSxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUNyRSxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7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