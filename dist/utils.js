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
//# sourceMappingURL=utils.js.map