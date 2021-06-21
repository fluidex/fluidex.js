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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy50cyJdLCJuYW1lcyI6WyJwYWRkaW5nMjU2IiwibiIsIm5zdHIiLCJTY2FsYXIiLCJlIiwidG9TdHJpbmciLCJsZW5ndGgiLCJleHRyYWN0IiwibnVtIiwib3JpZ2luIiwibGVuIiwibWFzayIsInN1YiIsInNobCIsImJhbmQiLCJzaHIiLCJwYWRaZXJvcyIsInN0ciIsInJlcGVhdCIsInNoYTI1NlNuYXJrIiwiaGFzaCIsImNyeXB0byIsImNyZWF0ZUhhc2giLCJ1cGRhdGUiLCJkaWdlc3QiLCJoIiwibW9kIiwiZnJvbVN0cmluZyIsImJhYnlKdWIiLCJwIiwiYXJyYXlIZXhUb0JpZ0ludCIsImFycmF5SGV4IiwiYXJyYXlCaWdJbnQiLCJmb3JFYWNoIiwiZWxlbWVudCIsInB1c2giLCJidWlsZEVsZW1lbnQiLCJhcnJheVN0ciIsImZpbmFsU3RyIiwiY29uY2F0IiwiaGFzaFN0YXRlVHJlZSIsImJhbGFuY2UiLCJ0b2tlbklkIiwiQXgiLCJBeSIsImV0aEFkZHJlc3MiLCJub25jZSIsInRva2VuU3RyIiwibm9uY2VTdHIiLCJlMCIsImUxIiwiZTIiLCJlMyIsImU0IiwiZW50cnlCaWdJbnQiLCJsZWFmT2JqIiwiZWxlbWVudHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVNBLFVBQVQsQ0FBb0JDLENBQXBCLEVBQXVCO0FBQ3JCLE1BQUlDLElBQUksR0FBR0MsYUFBT0MsQ0FBUCxDQUFTSCxDQUFULEVBQVlJLFFBQVosQ0FBcUIsRUFBckIsQ0FBWDs7QUFDQSxTQUFPSCxJQUFJLENBQUNJLE1BQUwsR0FBYyxFQUFyQjtBQUF5QkosSUFBQUEsSUFBSSxHQUFHLE1BQU1BLElBQWI7QUFBekI7O0FBQ0FBLEVBQUFBLElBQUksZUFBUUEsSUFBUixDQUFKO0FBQ0EsU0FBT0EsSUFBUDtBQUNEO0FBRUQ7QUFDQTtBQUNBO0FB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dCI6WyJpbXBvcnQge1NjYWxhcn0gZnJvbSBcIi4vZmZqc1wiO1xuaW1wb3J0IHsgaGFzaCB9IGZyb20gJy4vaGFzaCc7XG5pbXBvcnQgKiBhcyBjcnlwdG8gZnJvbSAnY3J5cHRvJztcbmltcG9ydCB7YmFieUp1Yn0gIGZyb20gJ2NpcmNvbWxpYic7XG5cbi8qKlxuICogQ29udmVydCB0byBoZXhhZGVjaW1hbCBzdHJpbmcgcGFkZGluZyB1bnRpbCAyNTYgY2hhcmFjdGVyc1xuICogQHBhcmFtIHtOdW1iZXIgfCBTY2FsYXJ9IG4gLSBJbnB1dCBudW1iZXJcbiAqIEByZXR1cm5zIHtTdHJpbmd9IFN0cmluZyBlbmNvZGVkIGFzIGhleGFkZWNpbWFsIHdpdGggMjU2IGNoYXJhY3RlcnNcbiAqL1xuZnVuY3Rpb24gcGFkZGluZzI1NihuKSB7XG4gIGxldCBuc3RyID0gU2NhbGFyLmUobikudG9TdHJpbmcoMTYpO1xuICB3aGlsZSAobnN0ci5sZW5ndGggPCA2NCkgbnN0ciA9ICcwJyArIG5zdHI7XG4gIG5zdHIgPSBgMHgke25zdHJ9YDtcbiAgcmV0dXJuIG5zdHI7XG59XG5cbi8qKlxuICogTWFzayBhbmQgc2hpZnQgYSBTY2FsYXJcbiAqIEBwYXJhbSB7U2NhbGFyfSBudW0gLSBJbnB1dCBudW1iZXJcbiAqIEBwYXJhbSB7TnVtYmVyfSBvcmlnaW4gLSBJbml0aWFsIGJpdFxuICogQHBhcmFtIHtOdW1iZXJ9IGxlbiAtIEJpdCBsZW5naHQgb2YgdGhlIG1hc2tcbiAqIEByZXR1cm5zIHtTY2FsYXJ9IEV4dHJhY3RlZCBTY2FsYXJcbiAqL1xuZnVuY3Rpb24gZXh0cmFjdChudW0sIG9yaWdpbiwgbGVuKSB7XG4gIGNvbnN0IG1hc2sgPSBTY2FsYXIuc3ViKFNjYWxhci5zaGwoMSwgbGVuKSwgMSk7XG4gIHJldHVybiBTY2FsYXIuYmFuZChTY2FsYXIuc2hyKG51bSwgb3JpZ2luKSwgbWFzayk7XG59XG5cbi8qKlxuICogUGFkIGEgc3RyaW5nIGhleCBudW1iZXIgd2l0aCAwXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIC0gU3RyaW5nIGlucHV0XG4gKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIC0gTGVuZ3RoIG9mIHRoZSByZXN1bHRpbmcgc3RyaW5nXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBSZXN1bHRpbmcgc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIHBhZFplcm9zKHN0ciwgbGVuZ3RoKSB7XG4gIGlmIChsZW5ndGggPiBzdHIubGVuZ3RoKSBzdHIgPSAnMCcucmVwZWF0KGxlbmd0aCAtIHN0ci5sZW5ndGgpICsgc3RyO1xuICByZXR1cm4gc3RyO1xufVxuLyoqXG4gKiAoSGFzaCBTaGEyNTYgb2YgYW4gaGV4YWRlY2ltYWwgc3RyaW5nKSAlIChTbmFyayBmaWVsZClcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgLSBTdHJpbmcgaW5wdXQgaW4gaGV4YWRlY2ltYWwgZW5jb2RpbmdcbiAqIEByZXR1cm5zIHtTdHJpbmd9IFJlc3VsdGluZyBzdHJpbmcgZW5jb2RlZCBhcyBoZXhhZGVjaW1hbFxuICovXG5mdW5jdGlvbiBzaGEyNTZTbmFyayhzdHIpIHtcbiAgY29uc3QgaGFzaCA9IGNyeXB0by5jcmVhdGVIYXNoKCdzaGEyNTYnKS51cGRhdGUoc3RyKS5kaWdlc3QoJ2hleCcpO1xuICBjb25zdCBoID0gU2NhbGFyLm1vZChTY2FsYXIuZnJvbVN0cmluZyhoYXNoLCAxNiksIGJhYnlKdWIucCk7XG4gIHJldHVybiBoO1xufVxuXG4vKipcbiAqIENvbnZlcnQgQXJyYXkgb2YgaGV4YWRlY2ltYWxzIHN0cmluZ3MgdG8gYXJyYXkgb2YgQmlnSW50c1xuICogQHBhcmFtIHtBcnJheX0gYXJyYXlIZXggLSBhcnJheSBvZiBzdHJpbmdzIGVuY29kZWQgYXMgaGV4XG4gKiBAcmV0dXJucyB7QXJyYXl9IC0gYXJyYXkgb2YgQmlnSW50c1xuICovXG5mdW5jdGlvbiBhcnJheUhleFRvQmlnSW50KGFycmF5SGV4KSB7XG4gIGNvbnN0IGFycmF5QmlnSW50ID0gW107XG4gIGFycmF5SGV4LmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgYXJyYXlCaWdJbnQucHVzaChTY2FsYXIuZnJvbVN0cmluZyhlbGVtZW50LCAxNikpO1xuICB9KTtcbiAgcmV0dXJuIGFycmF5QmlnSW50O1xufVxuXG4vKipcbiAqIENvbmNhdGVuYXRlIGFycmF5IG9mIHN0cmluZ3Mgd2l0aCBmaXhlZCAzMmJ5dGVzIGZpeGVkIGxlbmd0aFxuICogQHBhcmFtIHtBcnJheX0gYXJyYXlTdHIgLSBhcnJheSBvZiBzdHJpbmdzXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIHJlc3VsdCBhcnJheVxuICovXG5mdW5jdGlvbiBidWlsZEVsZW1lbnQoYXJyYXlTdHIpIHtcbiAgbGV0IGZpbmFsU3RyID0gJyc7XG4gIGFycmF5U3RyLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgZmluYWxTdHIgPSBmaW5hbFN0ci5jb25jYXQoZWxlbWVudCk7XG4gIH0pO1xuICByZXR1cm4gYDB4JHtwYWRaZXJvcyhmaW5hbFN0ciwgNjQpfWA7XG59XG5cbi8qKlxuICogSGFzaCB0cmVlIHN0YXRlXG4gKiBAcGFyYW0ge1NjYWxhcn0gYmFsYW5jZSAtIGFjY291bnQgYmFsYW5jZVxuICogQHBhcmFtIHtTY2FsYXJ9IHRva2VuSWQgLSB0b2tlbmQgaWRlbnRpZmllclxuICogQHBhcmFtIHtTY2FsYXJ9IEF4IC0geCBjb29yZGluYXRlIGJhYnlqdWJqdWJcbiAqIEBwYXJhbSB7U2NhbGFyfSBBeSAtIHkgY29vcmRpbmF0ZSBiYWJ5anVianViXG4gKiBAcGFyYW0ge1NjYWxhcn0gZXRoQWRkcmVzcyAtIGV0aGVyZXVtIGFkZHJlc3NcbiAqIEBwYXJhbSB7U2NhbGFyfSBub25jZSAtIG5vbmNlXG4gKiBAcmV0dXJucyB7T2JqZWN0fSAtIENvbnRhaW5zIGhhc2ggc3RhdGUgdmFsdWUsIGVudHJ5IGVsZW1lbnRzIGFuZCBsZWFmIHJhdyBvYmplY3RcbiAqL1xuZnVuY3Rpb24gaGFzaFN0YXRlVHJlZShiYWxhbmNlLCB0b2tlbklkLCBBeCwgQXksIGV0aEFkZHJlc3MsIG5vbmNlKSB7XG4gIC8vIEJ1aWxkIEVudHJ5XG4gIC8vIGVsZW1lbnQgMFxuICBjb25zdCB0b2tlblN0ciA9IHBhZFplcm9zKHRva2VuSWQudG9TdHJpbmcoJzE2JyksIDgpO1xuICBjb25zdCBub25jZVN0ciA9IHBhZFplcm9zKG5vbmNlLnRvU3RyaW5nKCcxNicpLCAxMik7XG4gIGNvbnN0IGUwID0gYnVpbGRFbGVtZW50KFtub25jZVN0ciwgdG9rZW5TdHJdKTtcbiAgLy8gZWxlbWVudCAxXG4gIGNvbnN0IGUxID0gYnVpbGRFbGVtZW50KFtiYWxhbmNlLnRvU3RyaW5nKCcxNicpXSk7XG4gIC8vIGVsZW1lbnQgMlxuICBjb25zdCBlMiA9IGJ1aWxkRWxlbWVudChbQXgudG9TdHJpbmcoJzE2JyldKTtcbiAgLy8gZWxlbWVudCAzXG4gIGNvbnN0IGUzID0gYnVpbGRFbGVtZW50KFtBeS50b1N0cmluZygnMTYnKV0pO1xuICAvLyBlbGVtZW50IDRcbiAgY29uc3QgZTQgPSBidWlsZEVsZW1lbnQoW2V0aEFkZHJlc3MudG9TdHJpbmcoJzE2JyldKTtcbiAgLy8gR2V0IGFycmF5IEJpZ0ludFxuICBjb25zdCBlbnRyeUJpZ0ludCA9IGFycmF5SGV4VG9CaWdJbnQoW2UwLCBlMSwgZTIsIGUzLCBlNF0pO1xuICAvLyBPYmplY3QgbGVhZlxuICBjb25zdCBsZWFmT2JqID0ge1xuICAgIGJhbGFuY2UsXG4gICAgdG9rZW5JZCxcbiAgICBBeCxcbiAgICBBeSxcbiAgICBldGhBZGRyZXNzLFxuICAgIG5vbmNlLFxuICB9O1xuICAvLyBIYXNoIGVudHJ5IGFuZCBvYmplY3RcbiAgcmV0dXJuIHsgbGVhZk9iaiwgZWxlbWVudHM6IHsgZTAsIGUxLCBlMiwgZTMsIGU0IH0sIGhhc2g6IGhhc2goZW50cnlCaWdJbnQpIH07XG59XG5cbmV4cG9ydCB7IHBhZGRpbmcyNTYsIGV4dHJhY3QsIHBhZFplcm9zLCBoYXNoU3RhdGVUcmVlLCBzaGEyNTZTbmFyayB9O1xuIl19