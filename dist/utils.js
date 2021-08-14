"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.padding256 = padding256;
exports.extract = extract;
exports.padZeros = padZeros;
exports.hashStateTree = hashStateTree;
exports.sha256Snark = sha256Snark;

var _ffjs = require("./ffjs");

var _hash = require("./hash");

var crypto = _interopRequireWildcard(require("crypto"));

var _circomlib = require("circomlib");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * Convert to hexadecimal string padding until 256 characters
 * @param {Number | Scalar} n - Input number
 * @returns {String} String encoded as hexadecimal with 256 characters
 */
function padding256(n) {
  var nstr = _ffjs.Scalar.e(n).toString(16);

  while (nstr.length < 64) {
    nstr = '0' + nstr;
  }

  nstr = "0x".concat(nstr);
  return nstr;
}
/**
 * Mask and shift a Scalar
 * @param {Scalar} num - Input number
 * @param {Number} origin - Initial bit
 * @param {Number} len - Bit lenght of the mask
 * @returns {Scalar} Extracted Scalar
 */


function extract(num, origin, len) {
  var mask = _ffjs.Scalar.sub(_ffjs.Scalar.shl(1, len), 1);

  return _ffjs.Scalar.band(_ffjs.Scalar.shr(num, origin), mask);
}
/**
 * Pad a string hex number with 0
 * @param {String} str - String input
 * @param {Number} length - Length of the resulting string
 * @returns {String} Resulting string
 */


function padZeros(str, length) {
  if (length > str.length) str = '0'.repeat(length - str.length) + str;
  return str;
}
/**
 * (Hash Sha256 of an hexadecimal string) % (Snark field)
 * @param {String} str - String input in hexadecimal encoding
 * @returns {String} Resulting string encoded as hexadecimal
 */


function sha256Snark(str) {
  var hash = crypto.createHash('sha256').update(str).digest('hex');

  var h = _ffjs.Scalar.mod(_ffjs.Scalar.fromString(hash, 16), _circomlib.babyJub.p);

  return h;
}
/**
 * Convert Array of hexadecimals strings to array of BigInts
 * @param {Array} arrayHex - array of strings encoded as hex
 * @returns {Array} - array of BigInts
 */


function arrayHexToBigInt(arrayHex) {
  var arrayBigInt = [];
  arrayHex.forEach(function (element) {
    arrayBigInt.push(_ffjs.Scalar.fromString(element, 16));
  });
  return arrayBigInt;
}
/**
 * Concatenate array of strings with fixed 32bytes fixed length
 * @param {Array} arrayStr - array of strings
 * @returns {String} - result array
 */


function buildElement(arrayStr) {
  var finalStr = '';
  arrayStr.forEach(function (element) {
    finalStr = finalStr.concat(element);
  });
  return "0x".concat(padZeros(finalStr, 64));
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
  var tokenStr = padZeros(tokenId.toString('16'), 8);
  var nonceStr = padZeros(nonce.toString('16'), 12);
  var e0 = buildElement([nonceStr, tokenStr]); // element 1

  var e1 = buildElement([balance.toString('16')]); // element 2

  var e2 = buildElement([Ax.toString('16')]); // element 3

  var e3 = buildElement([Ay.toString('16')]); // element 4

  var e4 = buildElement([ethAddress.toString('16')]); // Get array BigInt

  var entryBigInt = arrayHexToBigInt([e0, e1, e2, e3, e4]); // Object leaf

  var leafObj = {
    balance: balance,
    tokenId: tokenId,
    Ax: Ax,
    Ay: Ay,
    ethAddress: ethAddress,
    nonce: nonce
  }; // Hash entry and object

  return {
    leafObj: leafObj,
    elements: {
      e0: e0,
      e1: e1,
      e2: e2,
      e3: e3,
      e4: e4
    },
    hash: (0, _hash.hash)(entryBigInt)
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy50cyJdLCJuYW1lcyI6WyJwYWRkaW5nMjU2IiwibiIsIm5zdHIiLCJTY2FsYXIiLCJlIiwidG9TdHJpbmciLCJsZW5ndGgiLCJleHRyYWN0IiwibnVtIiwib3JpZ2luIiwibGVuIiwibWFzayIsInN1YiIsInNobCIsImJhbmQiLCJzaHIiLCJwYWRaZXJvcyIsInN0ciIsInJlcGVhdCIsInNoYTI1NlNuYXJrIiwiaGFzaCIsImNyeXB0byIsImNyZWF0ZUhhc2giLCJ1cGRhdGUiLCJkaWdlc3QiLCJoIiwibW9kIiwiZnJvbVN0cmluZyIsImJhYnlKdWIiLCJwIiwiYXJyYXlIZXhUb0JpZ0ludCIsImFycmF5SGV4IiwiYXJyYXlCaWdJbnQiLCJmb3JFYWNoIiwiZWxlbWVudCIsInB1c2giLCJidWlsZEVsZW1lbnQiLCJhcnJheVN0ciIsImZpbmFsU3RyIiwiY29uY2F0IiwiaGFzaFN0YXRlVHJlZSIsImJhbGFuY2UiLCJ0b2tlbklkIiwiQXgiLCJBeSIsImV0aEFkZHJlc3MiLCJub25jZSIsInRva2VuU3RyIiwibm9uY2VTdHIiLCJlMCIsImUxIiwiZTIiLCJlMyIsImU0IiwiZW50cnlCaWdJbnQiLCJsZWFmT2JqIiwiZWxlbWVudHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVNBLFVBQVQsQ0FBb0JDLENBQXBCLEVBQXVCO0FBQ3JCLE1BQUlDLElBQUksR0FBR0MsYUFBT0MsQ0FBUCxDQUFTSCxDQUFULEVBQVlJLFFBQVosQ0FBcUIsRUFBckIsQ0FBWDs7QUFDQSxTQUFPSCxJQUFJLENBQUNJLE1BQUwsR0FBYyxFQUFyQjtBQUF5QkosSUFBQUEsSUFBSSxHQUFHLE1BQU1BLElBQWI7QUFBekI7O0FBQ0FBLEVBQUFBLElBQUksZUFBUUEsSUFBUixDQUFKO0FBQ0EsU0FBT0EsSUFBUDtBQUNEO0FBRUQ7QUFDQTtBQUNBO0FB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dCI6WyJpbXBvcnQgeyBTY2FsYXIgfSBmcm9tICcuL2ZmanMnO1xuaW1wb3J0IHsgaGFzaCB9IGZyb20gJy4vaGFzaCc7XG5pbXBvcnQgKiBhcyBjcnlwdG8gZnJvbSAnY3J5cHRvJztcbmltcG9ydCB7IGJhYnlKdWIgfSBmcm9tICdjaXJjb21saWInO1xuXG4vKipcbiAqIENvbnZlcnQgdG8gaGV4YWRlY2ltYWwgc3RyaW5nIHBhZGRpbmcgdW50aWwgMjU2IGNoYXJhY3RlcnNcbiAqIEBwYXJhbSB7TnVtYmVyIHwgU2NhbGFyfSBuIC0gSW5wdXQgbnVtYmVyXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBTdHJpbmcgZW5jb2RlZCBhcyBoZXhhZGVjaW1hbCB3aXRoIDI1NiBjaGFyYWN0ZXJzXG4gKi9cbmZ1bmN0aW9uIHBhZGRpbmcyNTYobikge1xuICBsZXQgbnN0ciA9IFNjYWxhci5lKG4pLnRvU3RyaW5nKDE2KTtcbiAgd2hpbGUgKG5zdHIubGVuZ3RoIDwgNjQpIG5zdHIgPSAnMCcgKyBuc3RyO1xuICBuc3RyID0gYDB4JHtuc3RyfWA7XG4gIHJldHVybiBuc3RyO1xufVxuXG4vKipcbiAqIE1hc2sgYW5kIHNoaWZ0IGEgU2NhbGFyXG4gKiBAcGFyYW0ge1NjYWxhcn0gbnVtIC0gSW5wdXQgbnVtYmVyXG4gKiBAcGFyYW0ge051bWJlcn0gb3JpZ2luIC0gSW5pdGlhbCBiaXRcbiAqIEBwYXJhbSB7TnVtYmVyfSBsZW4gLSBCaXQgbGVuZ2h0IG9mIHRoZSBtYXNrXG4gKiBAcmV0dXJucyB7U2NhbGFyfSBFeHRyYWN0ZWQgU2NhbGFyXG4gKi9cbmZ1bmN0aW9uIGV4dHJhY3QobnVtLCBvcmlnaW4sIGxlbikge1xuICBjb25zdCBtYXNrID0gU2NhbGFyLnN1YihTY2FsYXIuc2hsKDEsIGxlbiksIDEpO1xuICByZXR1cm4gU2NhbGFyLmJhbmQoU2NhbGFyLnNocihudW0sIG9yaWdpbiksIG1hc2spO1xufVxuXG4vKipcbiAqIFBhZCBhIHN0cmluZyBoZXggbnVtYmVyIHdpdGggMFxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciAtIFN0cmluZyBpbnB1dFxuICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCAtIExlbmd0aCBvZiB0aGUgcmVzdWx0aW5nIHN0cmluZ1xuICogQHJldHVybnMge1N0cmluZ30gUmVzdWx0aW5nIHN0cmluZ1xuICovXG5mdW5jdGlvbiBwYWRaZXJvcyhzdHIsIGxlbmd0aCkge1xuICBpZiAobGVuZ3RoID4gc3RyLmxlbmd0aCkgc3RyID0gJzAnLnJlcGVhdChsZW5ndGggLSBzdHIubGVuZ3RoKSArIHN0cjtcbiAgcmV0dXJuIHN0cjtcbn1cbi8qKlxuICogKEhhc2ggU2hhMjU2IG9mIGFuIGhleGFkZWNpbWFsIHN0cmluZykgJSAoU25hcmsgZmllbGQpXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIC0gU3RyaW5nIGlucHV0IGluIGhleGFkZWNpbWFsIGVuY29kaW5nXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBSZXN1bHRpbmcgc3RyaW5nIGVuY29kZWQgYXMgaGV4YWRlY2ltYWxcbiAqL1xuZnVuY3Rpb24gc2hhMjU2U25hcmsoc3RyKSB7XG4gIGNvbnN0IGhhc2ggPSBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMjU2JykudXBkYXRlKHN0cikuZGlnZXN0KCdoZXgnKTtcbiAgY29uc3QgaCA9IFNjYWxhci5tb2QoU2NhbGFyLmZyb21TdHJpbmcoaGFzaCwgMTYpLCBiYWJ5SnViLnApO1xuICByZXR1cm4gaDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IEFycmF5IG9mIGhleGFkZWNpbWFscyBzdHJpbmdzIHRvIGFycmF5IG9mIEJpZ0ludHNcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5SGV4IC0gYXJyYXkgb2Ygc3RyaW5ncyBlbmNvZGVkIGFzIGhleFxuICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIEJpZ0ludHNcbiAqL1xuZnVuY3Rpb24gYXJyYXlIZXhUb0JpZ0ludChhcnJheUhleCkge1xuICBjb25zdCBhcnJheUJpZ0ludCA9IFtdO1xuICBhcnJheUhleC5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgIGFycmF5QmlnSW50LnB1c2goU2NhbGFyLmZyb21TdHJpbmcoZWxlbWVudCwgMTYpKTtcbiAgfSk7XG4gIHJldHVybiBhcnJheUJpZ0ludDtcbn1cblxuLyoqXG4gKiBDb25jYXRlbmF0ZSBhcnJheSBvZiBzdHJpbmdzIHdpdGggZml4ZWQgMzJieXRlcyBmaXhlZCBsZW5ndGhcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5U3RyIC0gYXJyYXkgb2Ygc3RyaW5nc1xuICogQHJldHVybnMge1N0cmluZ30gLSByZXN1bHQgYXJyYXlcbiAqL1xuZnVuY3Rpb24gYnVpbGRFbGVtZW50KGFycmF5U3RyKSB7XG4gIGxldCBmaW5hbFN0ciA9ICcnO1xuICBhcnJheVN0ci5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgIGZpbmFsU3RyID0gZmluYWxTdHIuY29uY2F0KGVsZW1lbnQpO1xuICB9KTtcbiAgcmV0dXJuIGAweCR7cGFkWmVyb3MoZmluYWxTdHIsIDY0KX1gO1xufVxuXG4vKipcbiAqIEhhc2ggdHJlZSBzdGF0ZVxuICogQHBhcmFtIHtTY2FsYXJ9IGJhbGFuY2UgLSBhY2NvdW50IGJhbGFuY2VcbiAqIEBwYXJhbSB7U2NhbGFyfSB0b2tlbklkIC0gdG9rZW5kIGlkZW50aWZpZXJcbiAqIEBwYXJhbSB7U2NhbGFyfSBBeCAtIHggY29vcmRpbmF0ZSBiYWJ5anVianViXG4gKiBAcGFyYW0ge1NjYWxhcn0gQXkgLSB5IGNvb3JkaW5hdGUgYmFieWp1Ymp1YlxuICogQHBhcmFtIHtTY2FsYXJ9IGV0aEFkZHJlc3MgLSBldGhlcmV1bSBhZGRyZXNzXG4gKiBAcGFyYW0ge1NjYWxhcn0gbm9uY2UgLSBub25jZVxuICogQHJldHVybnMge09iamVjdH0gLSBDb250YWlucyBoYXNoIHN0YXRlIHZhbHVlLCBlbnRyeSBlbGVtZW50cyBhbmQgbGVhZiByYXcgb2JqZWN0XG4gKi9cbmZ1bmN0aW9uIGhhc2hTdGF0ZVRyZWUoYmFsYW5jZSwgdG9rZW5JZCwgQXgsIEF5LCBldGhBZGRyZXNzLCBub25jZSkge1xuICAvLyBCdWlsZCBFbnRyeVxuICAvLyBlbGVtZW50IDBcbiAgY29uc3QgdG9rZW5TdHIgPSBwYWRaZXJvcyh0b2tlbklkLnRvU3RyaW5nKCcxNicpLCA4KTtcbiAgY29uc3Qgbm9uY2VTdHIgPSBwYWRaZXJvcyhub25jZS50b1N0cmluZygnMTYnKSwgMTIpO1xuICBjb25zdCBlMCA9IGJ1aWxkRWxlbWVudChbbm9uY2VTdHIsIHRva2VuU3RyXSk7XG4gIC8vIGVsZW1lbnQgMVxuICBjb25zdCBlMSA9IGJ1aWxkRWxlbWVudChbYmFsYW5jZS50b1N0cmluZygnMTYnKV0pO1xuICAvLyBlbGVtZW50IDJcbiAgY29uc3QgZTIgPSBidWlsZEVsZW1lbnQoW0F4LnRvU3RyaW5nKCcxNicpXSk7XG4gIC8vIGVsZW1lbnQgM1xuICBjb25zdCBlMyA9IGJ1aWxkRWxlbWVudChbQXkudG9TdHJpbmcoJzE2JyldKTtcbiAgLy8gZWxlbWVudCA0XG4gIGNvbnN0IGU0ID0gYnVpbGRFbGVtZW50KFtldGhBZGRyZXNzLnRvU3RyaW5nKCcxNicpXSk7XG4gIC8vIEdldCBhcnJheSBCaWdJbnRcbiAgY29uc3QgZW50cnlCaWdJbnQgPSBhcnJheUhleFRvQmlnSW50KFtlMCwgZTEsIGUyLCBlMywgZTRdKTtcbiAgLy8gT2JqZWN0IGxlYWZcbiAgY29uc3QgbGVhZk9iaiA9IHtcbiAgICBiYWxhbmNlLFxuICAgIHRva2VuSWQsXG4gICAgQXgsXG4gICAgQXksXG4gICAgZXRoQWRkcmVzcyxcbiAgICBub25jZSxcbiAgfTtcbiAgLy8gSGFzaCBlbnRyeSBhbmQgb2JqZWN0XG4gIHJldHVybiB7IGxlYWZPYmosIGVsZW1lbnRzOiB7IGUwLCBlMSwgZTIsIGUzLCBlNCB9LCBoYXNoOiBoYXNoKGVudHJ5QmlnSW50KSB9O1xufVxuXG5leHBvcnQgeyBwYWRkaW5nMjU2LCBleHRyYWN0LCBwYWRaZXJvcywgaGFzaFN0YXRlVHJlZSwgc2hhMjU2U25hcmsgfTtcbiJdfQ==