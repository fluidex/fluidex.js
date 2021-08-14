"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var ethers = _interopRequireWildcard(require("ethers"));

var assert = _interopRequireWildcard(require("assert"));

var eddsa = _interopRequireWildcard(require("./eddsa"));

var _hash = require("./hash");

var _account = require("./account");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var babyJub = require('circomlib').babyJub;

var keccak256 = require('js-sha3').keccak256;

function TestRecoverPublicKeyAndAddress() {
  return _TestRecoverPublicKeyAndAddress.apply(this, arguments);
}

function _TestRecoverPublicKeyAndAddress() {
  _TestRecoverPublicKeyAndAddress = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var MNEMONIC, wallet, message, expectedAddress, expectedPublicKey, signature, pk, addr;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            MNEMONIC = 'radar blur cabbage chef fix engine embark joy scheme fiction master release';
            wallet = ethers.Wallet.fromMnemonic(MNEMONIC, null);
            message = (0, _account.get_CREATE_L2_ACCOUNT_MSG)(null);
            _context.next = 5;
            return wallet.getAddress();

          case 5:
            expectedAddress = _context.sent;
            expectedPublicKey = wallet._signingKey().publicKey;
            _context.next = 9;
            return wallet.signMessage(message);

          case 9:
            signature = _context.sent;
            // console.log("Address:", expectedAddress);
            // console.log("PublicKey:", expectedPublicKey);
            // console.log("Message:", message);
            // console.log("Signature:", signature);
            pk = (0, _account.recoverPublicKeyFromSignature)(message, signature);
            assert(pk == expectedPublicKey, 'PublicKey mismatch');
            addr = ethers.utils.computeAddress(pk);
            assert(addr == expectedAddress, 'Address mismatch');

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _TestRecoverPublicKeyAndAddress.apply(this, arguments);
}

var privKey = '0x0b22f852cd07386bce533f2038821fdcebd9c5ced9e3cd51e3a05d421dbfd785';

function testL2Sign() {
  var acc = _account.Account.fromPrivkey(privKey); // 0x7b70843a42114e88149e3961495c03f9a41292c8b97bd1e2026597d185478293


  console.log(acc.bjjPubKey);
}

function ethersSign() {
  return _ethersSign.apply(this, arguments);
}

function _ethersSign() {
  _ethersSign = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var signer, message, signature, acc;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            signer = new ethers.Wallet(privKey);
            message = (0, _account.get_CREATE_L2_ACCOUNT_MSG)(null);
            _context2.next = 4;
            return signer.signMessage(message);

          case 4:
            signature = _context2.sent;
            // 0x9982364bf709fecdf830a71f417182e3a7f717a6363180ff33784e2823935f8b55932a5353fb128fc7e3d6c4aed57138adce772ce594338a8f4985d6668627b31c
            console.log(signature);
            acc = _account.Account.fromSignature(signature); // 0x7b70843a42114e88149e3961495c03f9a41292c8b97bd1e2026597d185478293

            console.log(acc.bjjPubKey);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _ethersSign.apply(this, arguments);
}

function TestL2AccountKeyAndSign() {
  /*
  const wallet = ethers.Wallet.createRandom();
  const msgHash = ethers.utils.hashMessage(get_CREATE_L2_ACCOUNT_MSG(null));
  const signature = ethers.utils.joinSignature(wallet._signingKey().signDigest(msgHash));
  const seed = ethers.utils.arrayify(signature).slice(0, 32);
  */
  var seed = ethers.utils.arrayify('0x87b34b2b842db0cc945659366068053f325ff227fd9c6788b2504ac2c4c5dc2a');
  var account = new _account.L2Account(seed);
  assert(account.bjjPubKey == '0xa59226beb68d565521497d38e37f7d09c9d4e97ac1ebc94fba5de524cb1ca4a0');
  assert(account.ax.toString(16) == '1fce25ec2e7eeec94079ec7866a933a8b21f33e0ebd575f3001d62d19251d455');
  assert(account.ay.toString(16) == '20a41ccb24e55dba4fc9ebc17ae9d4c9097d7fe3387d492155568db6be2692a5');
  assert(account.sign.toString(16) == '1');
  var sig = account.signHash(1357924680n);
  assert(sig.R8x.toString(10) == '15679698175365968671287592821268512384454163537665670071564984871581219397966');
  assert(sig.R8y.toString(10) == '1705544521394286010135369499330220710333064238375605681220284175409544486013');
  assert(sig.S.toString(10) == '2104729104368328243963691045555606467740179640947024714099030450797354625308');
  var packedSig = account.signHashPacked(1357924680n);
  assert(packedSig.toString('hex') == '7ddc5c6aadf5e80200bd9f28e9d5bf932cbb7f4224cce0fa11154f4ad24dc5831c295fb522b7b8b4921e271bc6b265f4d7114fbe9516d23e69760065053ca704'); //console.log(packedSig.toString('hex'));
  //console.log(eddsa.unpackSignature(packedSig));
}

function TestL2SigVerify() {
  // copied from TestL2AccountKeyAndSign
  var pubkey = 'a59226beb68d565521497d38e37f7d09c9d4e97ac1ebc94fba5de524cb1ca4a0';
  var msg = 1357924680n;
  var sig = '7ddc5c6aadf5e80200bd9f28e9d5bf932cbb7f4224cce0fa11154f4ad24dc5831c295fb522b7b8b4921e271bc6b265f4d7114fbe9516d23e69760065053ca704';
  var pubkeyPoint = babyJub.unpackPoint(Buffer.from(pubkey, 'hex'));
  assert(eddsa.verifyWithHasher(msg, eddsa.unpackSignature(Buffer.from(sig, 'hex')), pubkeyPoint, _hash.hash));
}

function main() {
  return _main.apply(this, arguments);
}

function _main() {
  _main = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return TestL2SigVerify();

          case 2:
            _context3.next = 4;
            return TestL2AccountKeyAndSign();

          case 4:
            _context3.next = 6;
            return TestRecoverPublicKeyAndAddress();

          case 6:
            _context3.next = 8;
            return ethersSign();

          case 8:
            _context3.next = 10;
            return testL2Sign();

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _main.apply(this, arguments);
}

main();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hY2NvdW50X3Rlc3QudHMiXSwibmFtZXMiOlsiYmFieUp1YiIsInJlcXVpcmUiLCJrZWNjYWsyNTYiLCJUZXN0UmVjb3ZlclB1YmxpY0tleUFuZEFkZHJlc3MiLCJNTkVNT05JQyIsIndhbGxldCIsImV0aGVycyIsIldhbGxldCIsImZyb21NbmVtb25pYyIsIm1lc3NhZ2UiLCJnZXRBZGRyZXNzIiwiZXhwZWN0ZWRBZGRyZXNzIiwiZXhwZWN0ZWRQdWJsaWNLZXkiLCJfc2lnbmluZ0tleSIsInB1YmxpY0tleSIsInNpZ25NZXNzYWdlIiwic2lnbmF0dXJlIiwicGsiLCJhc3NlcnQiLCJhZGRyIiwidXRpbHMiLCJjb21wdXRlQWRkcmVzcyIsInByaXZLZXkiLCJ0ZXN0TDJTaWduIiwiYWNjIiwiQWNjb3VudCIsImZyb21Qcml2a2V5IiwiY29uc29sZSIsImxvZyIsImJqalB1YktleSIsImV0aGVyc1NpZ24iLCJzaWduZXIiLCJmcm9tU2lnbmF0dXJlIiwiVGVzdEwyQWNjb3VudEtleUFuZFNpZ24iLCJzZWVkIiwiYXJyYXlpZnkiLCJhY2NvdW50IiwiTDJBY2NvdW50IiwiYXgiLCJ0b1N0cmluZyIsImF5Iiwic2lnbiIsInNpZyIsInNpZ25IYXNoIiwiUjh4IiwiUjh5IiwiUyIsInBhY2tlZFNpZyIsInNpZ25IYXNoUGFja2VkIiwiVGVzdEwyU2lnVmVyaWZ5IiwicHVia2V5IiwibXNnIiwicHVia2V5UG9pbnQiLCJ1bnBhY2tQb2ludCIsIkJ1ZmZlciIsImZyb20iLCJlZGRzYSIsInZlcmlmeVdpdGhIYXNoZXIiLCJ1bnBhY2tTaWduYXR1cmUiLCJoYXNoIiwibWFpbiJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUdBOzs7Ozs7Ozs7O0FBRkEsSUFBTUEsT0FBTyxHQUFHQyxPQUFPLENBQUMsV0FBRCxDQUFQLENBQXFCRCxPQUFyQzs7QUFDQSxJQUFNRSxTQUFTLEdBQUdELE9BQU8sQ0FBQyxTQUFELENBQVAs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LHVCQUF1QixFQUYvQjs7QUFBQTtBQUFBO0FBQUEsbUJBR1E5Qiw4QkFBOEIsRUFIdEM7O0FBQUE7QUFBQTtBQUFBLG1CQUlRMkIsVUFBVSxFQUpsQjs7QUFBQTtBQUFBO0FBQUEsbUJBS1FQLFVBQVUsRUFMbEI7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRzs7OztBQVFBcUMsSUFBSSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGV0aGVycyBmcm9tICdldGhlcnMnO1xuaW1wb3J0ICogYXMgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XG5pbXBvcnQgKiBhcyBlZGRzYSBmcm9tICcuL2VkZHNhJztcbmltcG9ydCB7IGhhc2ggfSBmcm9tICcuL2hhc2gnO1xuY29uc3QgYmFieUp1YiA9IHJlcXVpcmUoJ2NpcmNvbWxpYicpLmJhYnlKdWI7XG5jb25zdCBrZWNjYWsyNTYgPSByZXF1aXJlKCdqcy1zaGEzJykua2VjY2FrMjU2O1xuaW1wb3J0IHsgTDJBY2NvdW50LCBBY2NvdW50LCBnZXRfQ1JFQVRFX0wyX0FDQ09VTlRfTVNHLCByZWNvdmVyUHVibGljS2V5RnJvbVNpZ25hdHVyZSB9IGZyb20gJy4vYWNjb3VudCc7XG5cbmFzeW5jIGZ1bmN0aW9uIFRlc3RSZWNvdmVyUHVibGljS2V5QW5kQWRkcmVzcygpIHtcbiAgY29uc3QgTU5FTU9OSUMgPSAncmFkYXIgYmx1ciBjYWJiYWdlIGNoZWYgZml4IGVuZ2luZSBlbWJhcmsgam95IHNjaGVtZSBmaWN0aW9uIG1hc3RlciByZWxlYXNlJztcbiAgY29uc3Qgd2FsbGV0ID0gZXRoZXJzLldhbGxldC5mcm9tTW5lbW9uaWMoTU5FTU9OSUMsIG51bGwpO1xuICBjb25zdCBtZXNzYWdlID0gZ2V0X0NSRUFURV9MMl9BQ0NPVU5UX01TRyhudWxsKTtcbiAgY29uc3QgZXhwZWN0ZWRBZGRyZXNzID0gYXdhaXQgd2FsbGV0LmdldEFkZHJlc3MoKTtcbiAgY29uc3QgZXhwZWN0ZWRQdWJsaWNLZXkgPSB3YWxsZXQuX3NpZ25pbmdLZXkoKS5wdWJsaWNLZXk7XG4gIGNvbnN0IHNpZ25hdHVyZSA9IGF3YWl0IHdhbGxldC5zaWduTWVzc2FnZShtZXNzYWdlKTtcblxuICAvLyBjb25zb2xlLmxvZyhcIkFkZHJlc3M6XCIsIGV4cGVjdGVkQWRkcmVzcyk7XG4gIC8vIGNvbnNvbGUubG9nKFwiUHVibGljS2V5OlwiLCBleHBlY3RlZFB1YmxpY0tleSk7XG4gIC8vIGNvbnNvbGUubG9nKFwiTWVzc2FnZTpcIiwgbWVzc2FnZSk7XG4gIC8vIGNvbnNvbGUubG9nKFwiU2lnbmF0dXJlOlwiLCBzaWduYXR1cmUpO1xuXG4gIGNvbnN0IHBrID0gcmVjb3ZlclB1YmxpY0tleUZyb21TaWduYXR1cmUobWVzc2FnZSwgc2lnbmF0dXJlKTtcbiAgYXNzZXJ0KHBrID09IGV4cGVjdGVkUHVibGljS2V5LCAnUHVibGljS2V5IG1pc21hdGNoJyk7XG4gIGNvbnN0IGFkZHIgPSBldGhlcnMudXRpbHMuY29tcHV0ZUFkZHJlc3MocGspO1xuICBhc3NlcnQoYWRkciA9PSBleHBlY3RlZEFkZHJlc3MsICdBZGRyZXNzIG1pc21hdGNoJyk7XG59XG5jb25zdCBwcml2S2V5ID0gJzB4MGIyMmY4NTJjZDA3Mzg2YmNlNTMzZjIwMzg4MjFmZGNlYmQ5YzVjZWQ5ZTNjZDUxZTNhMDVkNDIxZGJmZDc4NSc7XG5mdW5jdGlvbiB0ZXN0TDJTaWduKCkge1xuICBjb25zdCBhY2MgPSBBY2NvdW50LmZyb21Qcml2a2V5KHByaXZLZXkpO1xuICAvLyAweDdiNzA4NDNhNDIxMTRlODgxNDllMzk2MTQ5NWMwM2Y5YTQxMjkyYzhiOTdiZDFlMjAyNjU5N2QxODU0NzgyOTNcbiAgY29uc29sZS5sb2coYWNjLmJqalB1YktleSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGV0aGVyc1NpZ24oKSB7XG4gIGxldCBzaWduZXIgPSBuZXcgZXRoZXJzLldhbGxldChwcml2S2V5KTtcbiAgY29uc3QgbWVzc2FnZSA9IGdldF9DUkVBVEVfTDJfQUNDT1VOVF9NU0cobnVsbCk7XG4gIGNvbnN0IHNpZ25hdHVyZSA9IGF3YWl0IHNpZ25lci5zaWduTWVzc2FnZShtZXNzYWdlKTtcbiAgLy8gMHg5OTgyMzY0YmY3MDlmZWNkZjgzMGE3MWY0MTcxODJlM2E3ZjcxN2E2MzYzMTgwZmYzMzc4NGUyODIzOTM1ZjhiNTU5MzJhNTM1M2ZiMTI4ZmM3ZTNkNmM0YWVkNTcxMzhhZGNlNzcyY2U1OTQzMzhhOGY0OTg1ZDY2Njg2MjdiMzFjXG4gIGNvbnNvbGUubG9nKHNpZ25hdHVyZSk7XG4gIGNvbnN0IGFjYyA9IEFjY291bnQuZnJvbVNpZ25hdHVyZShzaWduYXR1cmUpO1xuICAvLyAweDdiNzA4NDNhNDIxMTRlODgxNDllMzk2MTQ5NWMwM2Y5YTQxMjkyYzhiOTdiZDFlMjAyNjU5N2QxODU0NzgyOTNcbiAgY29uc29sZS5sb2coYWNjLmJqalB1YktleSk7XG59XG5cbmZ1bmN0aW9uIFRlc3RMMkFjY291bnRLZXlBbmRTaWduKCkge1xuICAvKlxuICBjb25zdCB3YWxsZXQgPSBldGhlcnMuV2FsbGV0LmNyZWF0ZVJhbmRvbSgpO1xuICBjb25zdCBtc2dIYXNoID0gZXRoZXJzLnV0aWxzLmhhc2hNZXNzYWdlKGdldF9DUkVBVEVfTDJfQUNDT1VOVF9NU0cobnVsbCkpO1xuICBjb25zdCBzaWduYXR1cmUgPSBldGhlcnMudXRpbHMuam9pblNpZ25hdHVyZSh3YWxsZXQuX3NpZ25pbmdLZXkoKS5zaWduRGlnZXN0KG1zZ0hhc2gpKTtcbiAgY29uc3Qgc2VlZCA9IGV0aGVycy51dGlscy5hcnJheWlmeShzaWduYXR1cmUpLnNsaWNlKDAsIDMyKTtcbiAgKi9cbiAgY29uc3Qgc2VlZCA9IGV0aGVycy51dGlscy5hcnJheWlmeSgnMHg4N2IzNGIyYjg0MmRiMGNjOTQ1NjU5MzY2MDY4MDUzZjMyNWZmMjI3ZmQ5YzY3ODhiMjUwNGFjMmM0YzVkYzJhJyk7XG4gIGNvbnN0IGFjY291bnQgPSBuZXcgTDJBY2NvdW50KHNlZWQpO1xuICBhc3NlcnQoYWNjb3VudC5iampQdWJLZXkgPT0gJzB4YTU5MjI2YmViNjhkNTY1NTIxNDk3ZDM4ZTM3ZjdkMDljOWQ0ZTk3YWMxZWJjOTRmYmE1ZGU1MjRjYjFjYTRhMCcpO1xuICBhc3NlcnQoYWNjb3VudC5heC50b1N0cmluZygxNikgPT0gJzFmY2UyNWVjMmU3ZWVlYzk0MDc5ZWM3ODY2YTkzM2E4YjIxZjMzZTBlYmQ1NzVmMzAwMWQ2MmQxOTI1MWQ0NTUnKTtcbiAgYXNzZXJ0KGFjY291bnQuYXkudG9TdHJpbmcoMTYpID09ICcyMGE0MWNjYjI0ZTU1ZGJhNGZjOWViYzE3YWU5ZDRjOTA5N2Q3ZmUzMzg3ZDQ5MjE1NTU2OGRiNmJlMjY5MmE1Jyk7XG4gIGFzc2VydChhY2NvdW50LnNpZ24udG9TdHJpbmcoMTYpID09ICcxJyk7XG4gIGNvbnN0IHNpZyA9IGFjY291bnQuc2lnbkhhc2goMTM1NzkyNDY4MG4pO1xuICBhc3NlcnQoc2lnLlI4eC50b1N0cmluZygxMCkgPT0gJzE1Njc5Njk4MTc1MzY1OTY4NjcxMjg3NTkyODIxMjY4NTEyMzg0NDU0MTYzNTM3NjY1NjcwMDcxNTY0OTg0ODcxNTgxMjE5Mzk3OTY2Jyk7XG4gIGFzc2VydChzaWcuUjh5LnRvU3RyaW5nKDEwKSA9PSAnMTcwNTU0NDUyMTM5NDI4NjAxMDEzNTM2OTQ5OTMzMDIyMDcxMDMzMzA2NDIzODM3NTYwNTY4MTIyMDI4NDE3NTQwOTU0NDQ4NjAxMycpO1xuICBhc3NlcnQoc2lnLlMudG9TdHJpbmcoMTApID09ICcyMTA0NzI5MTA0MzY4MzI4MjQzOTYzNjkxMDQ1NTU1NjA2NDY3NzQwMTc5NjQwOTQ3MDI0NzE0MDk5MDMwNDUwNzk3MzU0NjI1MzA4Jyk7XG4gIGNvbnN0IHBhY2tlZFNpZyA9IGFjY291bnQuc2lnbkhhc2hQYWNrZWQoMTM1NzkyNDY4MG4pO1xuICBhc3NlcnQoXG4gICAgcGFja2VkU2lnLnRvU3RyaW5nKCdoZXgnKSA9PVxuICAgICAgJzdkZGM1YzZhYWRmNWU4MDIwMGJkOWYyOGU5ZDViZjkzMmNiYjdmNDIyNGNjZTBmYTExMTU0ZjRhZDI0ZGM1ODMxYzI5NWZiNTIyYjdiOGI0OTIxZTI3MWJjNmIyNjVmNGQ3MTE0ZmJlOTUxNmQyM2U2OTc2MDA2NTA1M2NhNzA0JyxcbiAgKTtcbiAgLy9jb25zb2xlLmxvZyhwYWNrZWRTaWcudG9TdHJpbmcoJ2hleCcpKTtcbiAgLy9jb25zb2xlLmxvZyhlZGRzYS51bnBhY2tTaWduYXR1cmUocGFja2VkU2lnKSk7XG59XG5cbmZ1bmN0aW9uIFRlc3RMMlNpZ1ZlcmlmeSgpIHtcbiAgLy8gY29waWVkIGZyb20gVGVzdEwyQWNjb3VudEtleUFuZFNpZ25cbiAgY29uc3QgcHVia2V5ID0gJ2E1OTIyNmJlYjY4ZDU2NTUyMTQ5N2QzOGUzN2Y3ZDA5YzlkNGU5N2FjMWViYzk0ZmJhNWRlNTI0Y2IxY2E0YTAnO1xuICBjb25zdCBtc2cgPSAxMzU3OTI0NjgwbjtcbiAgY29uc3Qgc2lnID1cbiAgICAnN2RkYzVjNmFhZGY1ZTgwMjAwYmQ5ZjI4ZTlkNWJmOTMyY2JiN2Y0MjI0Y2NlMGZhMTExNTRmNGFkMjRkYzU4MzFjMjk1ZmI1MjJiN2I4YjQ5MjFlMjcxYmM2YjI2NWY0ZDcxMTRmYmU5NTE2ZDIzZTY5NzYwMDY1MDUzY2E3MDQnO1xuICBjb25zdCBwdWJrZXlQb2ludCA9IGJhYnlKdWIudW5wYWNrUG9pbnQoQnVmZmVyLmZyb20ocHVia2V5LCAnaGV4JykpO1xuICBhc3NlcnQoZWRkc2EudmVyaWZ5V2l0aEhhc2hlcihtc2csIGVkZHNhLnVucGFja1NpZ25hdHVyZShCdWZmZXIuZnJvbShzaWcsICdoZXgnKSksIHB1YmtleVBvaW50LCBoYXNoKSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1haW4oKSB7XG4gIGF3YWl0IFRlc3RMMlNpZ1ZlcmlmeSgpO1xuICBhd2FpdCBUZXN0TDJBY2NvdW50S2V5QW5kU2lnbigpO1xuICBhd2FpdCBUZXN0UmVjb3ZlclB1YmxpY0tleUFuZEFkZHJlc3MoKTtcbiAgYXdhaXQgZXRoZXJzU2lnbigpO1xuICBhd2FpdCB0ZXN0TDJTaWduKCk7XG59XG5cbm1haW4oKTtcbiJdfQ==