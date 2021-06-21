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
  assert(packedSig.toString('hex') == "7ddc5c6aadf5e80200bd9f28e9d5bf932cbb7f4224cce0fa11154f4ad24dc5831c295fb522b7b8b4921e271bc6b265f4d7114fbe9516d23e69760065053ca704"); //console.log(packedSig.toString('hex'));
  //console.log(eddsa.unpackSignature(packedSig));
}

function TestL2SigVerify() {
  // copied from TestL2AccountKeyAndSign
  var pubkey = "a59226beb68d565521497d38e37f7d09c9d4e97ac1ebc94fba5de524cb1ca4a0";
  var msg = 1357924680n;
  var sig = "7ddc5c6aadf5e80200bd9f28e9d5bf932cbb7f4224cce0fa11154f4ad24dc5831c295fb522b7b8b4921e271bc6b265f4d7114fbe9516d23e69760065053ca704";
  var pubkeyPoint = babyJub.unpackPoint(Buffer.from(pubkey, "hex"));
  assert(eddsa.verifyWithHasher(msg, eddsa.unpackSignature(Buffer.from(sig, "hex")), pubkeyPoint, _hash.hash));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hY2NvdW50X3Rlc3QudHMiXSwibmFtZXMiOlsiYmFieUp1YiIsInJlcXVpcmUiLCJrZWNjYWsyNTYiLCJUZXN0UmVjb3ZlclB1YmxpY0tleUFuZEFkZHJlc3MiLCJNTkVNT05JQyIsIndhbGxldCIsImV0aGVycyIsIldhbGxldCIsImZyb21NbmVtb25pYyIsIm1lc3NhZ2UiLCJnZXRBZGRyZXNzIiwiZXhwZWN0ZWRBZGRyZXNzIiwiZXhwZWN0ZWRQdWJsaWNLZXkiLCJfc2lnbmluZ0tleSIsInB1YmxpY0tleSIsInNpZ25NZXNzYWdlIiwic2lnbmF0dXJlIiwicGsiLCJhc3NlcnQiLCJhZGRyIiwidXRpbHMiLCJjb21wdXRlQWRkcmVzcyIsInByaXZLZXkiLCJ0ZXN0TDJTaWduIiwiYWNjIiwiQWNjb3VudCIsImZyb21Qcml2a2V5IiwiY29uc29sZSIsImxvZyIsImJqalB1YktleSIsImV0aGVyc1NpZ24iLCJzaWduZXIiLCJmcm9tU2lnbmF0dXJlIiwiVGVzdEwyQWNjb3VudEtleUFuZFNpZ24iLCJzZWVkIiwiYXJyYXlpZnkiLCJhY2NvdW50IiwiTDJBY2NvdW50IiwiYXgiLCJ0b1N0cmluZyIsImF5Iiwic2lnbiIsInNpZyIsInNpZ25IYXNoIiwiUjh4IiwiUjh5IiwiUyIsInBhY2tlZFNpZyIsInNpZ25IYXNoUGFja2VkIiwiVGVzdEwyU2lnVmVyaWZ5IiwicHVia2V5IiwibXNnIiwicHVia2V5UG9pbnQiLCJ1bnBhY2tQb2ludCIsIkJ1ZmZlciIsImZyb20iLCJlZGRzYSIsInZlcmlmeVdpdGhIYXNoZXIiLCJ1bnBhY2tTaWduYXR1cmUiLCJoYXNoIiwibWFpbiJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUdBOzs7Ozs7Ozs7O0FBRkEsSUFBTUEsT0FBTyxHQUFHQyxPQUFPLENBQUMsV0FBRCxDQUFQLENBQXFCRCxPQUFyQzs7QUFDQSxJQUFNRSxTQUFTLEdBQUdELE9BQU8sQ0FBQyxTQUFELENBQVAs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aEIsdUJBQXVCLEVBRi9COztBQUFBO0FBQUE7QUFBQSxtQkFHUTlCLDhCQUE4QixFQUh0Qzs7QUFBQTtBQUFBO0FBQUEsbUJBSVEyQixVQUFVLEVBSmxCOztBQUFBO0FBQUE7QUFBQSxtQkFLUVAsVUFBVSxFQUxsQjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHOzs7O0FBUUFxQyxJQUFJIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZXRoZXJzIGZyb20gJ2V0aGVycyc7XG5pbXBvcnQgKiBhcyBhc3NlcnQgZnJvbSAnYXNzZXJ0JztcbmltcG9ydCAqIGFzIGVkZHNhIGZyb20gJy4vZWRkc2EnO1xuaW1wb3J0IHsgaGFzaCB9IGZyb20gJy4vaGFzaCc7XG5jb25zdCBiYWJ5SnViID0gcmVxdWlyZSgnY2lyY29tbGliJykuYmFieUp1YjtcbmNvbnN0IGtlY2NhazI1NiA9IHJlcXVpcmUoJ2pzLXNoYTMnKS5rZWNjYWsyNTY7XG5pbXBvcnQgeyBMMkFjY291bnQsIEFjY291bnQsIGdldF9DUkVBVEVfTDJfQUNDT1VOVF9NU0csIHJlY292ZXJQdWJsaWNLZXlGcm9tU2lnbmF0dXJlIH0gZnJvbSAnLi9hY2NvdW50JztcblxuYXN5bmMgZnVuY3Rpb24gVGVzdFJlY292ZXJQdWJsaWNLZXlBbmRBZGRyZXNzKCkge1xuICBjb25zdCBNTkVNT05JQyA9ICdyYWRhciBibHVyIGNhYmJhZ2UgY2hlZiBmaXggZW5naW5lIGVtYmFyayBqb3kgc2NoZW1lIGZpY3Rpb24gbWFzdGVyIHJlbGVhc2UnO1xuICBjb25zdCB3YWxsZXQgPSBldGhlcnMuV2FsbGV0LmZyb21NbmVtb25pYyhNTkVNT05JQywgbnVsbCk7XG4gIGNvbnN0IG1lc3NhZ2UgPSBnZXRfQ1JFQVRFX0wyX0FDQ09VTlRfTVNHKG51bGwpO1xuICBjb25zdCBleHBlY3RlZEFkZHJlc3MgPSBhd2FpdCB3YWxsZXQuZ2V0QWRkcmVzcygpO1xuICBjb25zdCBleHBlY3RlZFB1YmxpY0tleSA9IHdhbGxldC5fc2lnbmluZ0tleSgpLnB1YmxpY0tleTtcbiAgY29uc3Qgc2lnbmF0dXJlID0gYXdhaXQgd2FsbGV0LnNpZ25NZXNzYWdlKG1lc3NhZ2UpO1xuXG4gIC8vIGNvbnNvbGUubG9nKFwiQWRkcmVzczpcIiwgZXhwZWN0ZWRBZGRyZXNzKTtcbiAgLy8gY29uc29sZS5sb2coXCJQdWJsaWNLZXk6XCIsIGV4cGVjdGVkUHVibGljS2V5KTtcbiAgLy8gY29uc29sZS5sb2coXCJNZXNzYWdlOlwiLCBtZXNzYWdlKTtcbiAgLy8gY29uc29sZS5sb2coXCJTaWduYXR1cmU6XCIsIHNpZ25hdHVyZSk7XG5cbiAgY29uc3QgcGsgPSByZWNvdmVyUHVibGljS2V5RnJvbVNpZ25hdHVyZShtZXNzYWdlLCBzaWduYXR1cmUpO1xuICBhc3NlcnQocGsgPT0gZXhwZWN0ZWRQdWJsaWNLZXksICdQdWJsaWNLZXkgbWlzbWF0Y2gnKTtcbiAgY29uc3QgYWRkciA9IGV0aGVycy51dGlscy5jb21wdXRlQWRkcmVzcyhwayk7XG4gIGFzc2VydChhZGRyID09IGV4cGVjdGVkQWRkcmVzcywgJ0FkZHJlc3MgbWlzbWF0Y2gnKTtcbn1cbmNvbnN0IHByaXZLZXkgPSAnMHgwYjIyZjg1MmNkMDczODZiY2U1MzNmMjAzODgyMWZkY2ViZDljNWNlZDllM2NkNTFlM2EwNWQ0MjFkYmZkNzg1JztcbmZ1bmN0aW9uIHRlc3RMMlNpZ24oKSB7XG4gIGNvbnN0IGFjYyA9IEFjY291bnQuZnJvbVByaXZrZXkocHJpdktleSk7XG4gIC8vIDB4N2I3MDg0M2E0MjExNGU4ODE0OWUzOTYxNDk1YzAzZjlhNDEyOTJjOGI5N2JkMWUyMDI2NTk3ZDE4NTQ3ODI5M1xuICBjb25zb2xlLmxvZyhhY2MuYmpqUHViS2V5KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZXRoZXJzU2lnbigpIHtcbiAgbGV0IHNpZ25lciA9IG5ldyBldGhlcnMuV2FsbGV0KHByaXZLZXkpO1xuICBjb25zdCBtZXNzYWdlID0gZ2V0X0NSRUFURV9MMl9BQ0NPVU5UX01TRyhudWxsKTtcbiAgY29uc3Qgc2lnbmF0dXJlID0gYXdhaXQgc2lnbmVyLnNpZ25NZXNzYWdlKG1lc3NhZ2UpO1xuICAvLyAweDk5ODIzNjRiZjcwOWZlY2RmODMwYTcxZjQxNzE4MmUzYTdmNzE3YTYzNjMxODBmZjMzNzg0ZTI4MjM5MzVmOGI1NTkzMmE1MzUzZmIxMjhmYzdlM2Q2YzRhZWQ1NzEzOGFkY2U3NzJjZTU5NDMzOGE4ZjQ5ODVkNjY2ODYyN2IzMWNcbiAgY29uc29sZS5sb2coc2lnbmF0dXJlKTtcbiAgY29uc3QgYWNjID0gQWNjb3VudC5mcm9tU2lnbmF0dXJlKHNpZ25hdHVyZSk7XG4gIC8vIDB4N2I3MDg0M2E0MjExNGU4ODE0OWUzOTYxNDk1YzAzZjlhNDEyOTJjOGI5N2JkMWUyMDI2NTk3ZDE4NTQ3ODI5M1xuICBjb25zb2xlLmxvZyhhY2MuYmpqUHViS2V5KTtcbn1cblxuZnVuY3Rpb24gVGVzdEwyQWNjb3VudEtleUFuZFNpZ24oKSB7XG4gIC8qXG4gIGNvbnN0IHdhbGxldCA9IGV0aGVycy5XYWxsZXQuY3JlYXRlUmFuZG9tKCk7XG4gIGNvbnN0IG1zZ0hhc2ggPSBldGhlcnMudXRpbHMuaGFzaE1lc3NhZ2UoZ2V0X0NSRUFURV9MMl9BQ0NPVU5UX01TRyhudWxsKSk7XG4gIGNvbnN0IHNpZ25hdHVyZSA9IGV0aGVycy51dGlscy5qb2luU2lnbmF0dXJlKHdhbGxldC5fc2lnbmluZ0tleSgpLnNpZ25EaWdlc3QobXNnSGFzaCkpO1xuICBjb25zdCBzZWVkID0gZXRoZXJzLnV0aWxzLmFycmF5aWZ5KHNpZ25hdHVyZSkuc2xpY2UoMCwgMzIpO1xuICAqL1xuICBjb25zdCBzZWVkID0gZXRoZXJzLnV0aWxzLmFycmF5aWZ5KCcweDg3YjM0YjJiODQyZGIwY2M5NDU2NTkzNjYwNjgwNTNmMzI1ZmYyMjdmZDljNjc4OGIyNTA0YWMyYzRjNWRjMmEnKTtcbiAgY29uc3QgYWNjb3VudCA9IG5ldyBMMkFjY291bnQoc2VlZCk7XG4gIGFzc2VydChhY2NvdW50LmJqalB1YktleSA9PSAnMHhhNTkyMjZiZWI2OGQ1NjU1MjE0OTdkMzhlMzdmN2QwOWM5ZDRlOTdhYzFlYmM5NGZiYTVkZTUyNGNiMWNhNGEwJyk7XG4gIGFzc2VydChhY2NvdW50LmF4LnRvU3RyaW5nKDE2KSA9PSAnMWZjZTI1ZWMyZTdlZWVjOTQwNzllYzc4NjZhOTMzYThiMjFmMzNlMGViZDU3NWYzMDAxZDYyZDE5MjUxZDQ1NScpO1xuICBhc3NlcnQoYWNjb3VudC5heS50b1N0cmluZygxNikgPT0gJzIwYTQxY2NiMjRlNTVkYmE0ZmM5ZWJjMTdhZTlkNGM5MDk3ZDdmZTMzODdkNDkyMTU1NTY4ZGI2YmUyNjkyYTUnKTtcbiAgYXNzZXJ0KGFjY291bnQuc2lnbi50b1N0cmluZygxNikgPT0gJzEnKTtcbiAgY29uc3Qgc2lnID0gYWNjb3VudC5zaWduSGFzaCgxMzU3OTI0Njgwbik7XG4gIGFzc2VydChzaWcuUjh4LnRvU3RyaW5nKDEwKSA9PSAnMTU2Nzk2OTgxNzUzNjU5Njg2NzEyODc1OTI4MjEyNjg1MTIzODQ0NTQxNjM1Mzc2NjU2NzAwNzE1NjQ5ODQ4NzE1ODEyMTkzOTc5NjYnKTtcbiAgYXNzZXJ0KHNpZy5SOHkudG9TdHJpbmcoMTApID09ICcxNzA1NTQ0NTIxMzk0Mjg2MDEwMTM1MzY5NDk5MzMwMjIwNzEwMzMzMDY0MjM4Mzc1NjA1NjgxMjIwMjg0MTc1NDA5NTQ0NDg2MDEzJyk7XG4gIGFzc2VydChzaWcuUy50b1N0cmluZygxMCkgPT0gJzIxMDQ3MjkxMDQzNjgzMjgyNDM5NjM2OTEwNDU1NTU2MDY0Njc3NDAxNzk2NDA5NDcwMjQ3MTQwOTkwMzA0NTA3OTczNTQ2MjUzMDgnKTtcbiAgY29uc3QgcGFja2VkU2lnID0gYWNjb3VudC5zaWduSGFzaFBhY2tlZCgxMzU3OTI0Njgwbik7XG4gIGFzc2VydChwYWNrZWRTaWcudG9TdHJpbmcoJ2hleCcpID09IFwiN2RkYzVjNmFhZGY1ZTgwMjAwYmQ5ZjI4ZTlkNWJmOTMyY2JiN2Y0MjI0Y2NlMGZhMTExNTRmNGFkMjRkYzU4MzFjMjk1ZmI1MjJiN2I4YjQ5MjFlMjcxYmM2YjI2NWY0ZDcxMTRmYmU5NTE2ZDIzZTY5NzYwMDY1MDUzY2E3MDRcIik7XG4gIC8vY29uc29sZS5sb2cocGFja2VkU2lnLnRvU3RyaW5nKCdoZXgnKSk7XG4gIC8vY29uc29sZS5sb2coZWRkc2EudW5wYWNrU2lnbmF0dXJlKHBhY2tlZFNpZykpO1xufVxuXG5mdW5jdGlvbiBUZXN0TDJTaWdWZXJpZnkoKSB7XG4gIC8vIGNvcGllZCBmcm9tIFRlc3RMMkFjY291bnRLZXlBbmRTaWduXG4gIGNvbnN0IHB1YmtleSA9IFwiYTU5MjI2YmViNjhkNTY1NTIxNDk3ZDM4ZTM3ZjdkMDljOWQ0ZTk3YWMxZWJjOTRmYmE1ZGU1MjRjYjFjYTRhMFwiO1xuICBjb25zdCBtc2cgPSAxMzU3OTI0NjgwbjtcbiAgY29uc3Qgc2lnID0gXCI3ZGRjNWM2YWFkZjVlODAyMDBiZDlmMjhlOWQ1YmY5MzJjYmI3ZjQyMjRjY2UwZmExMTE1NGY0YWQyNGRjNTgzMWMyOTVmYjUyMmI3YjhiNDkyMWUyNzFiYzZiMjY1ZjRkNzExNGZiZTk1MTZkMjNlNjk3NjAwNjUwNTNjYTcwNFwiO1xuICBjb25zdCBwdWJrZXlQb2ludCA9IGJhYnlKdWIudW5wYWNrUG9pbnQoQnVmZmVyLmZyb20ocHVia2V5LCBcImhleFwiKSk7XG4gIGFzc2VydChlZGRzYS52ZXJpZnlXaXRoSGFzaGVyKG1zZywgZWRkc2EudW5wYWNrU2lnbmF0dXJlKEJ1ZmZlci5mcm9tKHNpZywgXCJoZXhcIikpLCBwdWJrZXlQb2ludCwgaGFzaCkpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBtYWluKCkge1xuICBhd2FpdCBUZXN0TDJTaWdWZXJpZnkoKTtcbiAgYXdhaXQgVGVzdEwyQWNjb3VudEtleUFuZFNpZ24oKTtcbiAgYXdhaXQgVGVzdFJlY292ZXJQdWJsaWNLZXlBbmRBZGRyZXNzKCk7XG4gIGF3YWl0IGV0aGVyc1NpZ24oKTtcbiAgYXdhaXQgdGVzdEwyU2lnbigpO1xufVxuXG5tYWluKCk7XG4iXX0=