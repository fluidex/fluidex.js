"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get_CREATE_L2_ACCOUNT_MSG = get_CREATE_L2_ACCOUNT_MSG;
exports.recoverPublicKeyFromSignature = recoverPublicKeyFromSignature;
exports.randomMnemonic = randomMnemonic;
exports.TxSignature = exports.Account = exports.L2Account = void 0;

var _eddsa = require("./eddsa");

var _circomlib = require("circomlib");

var _ffjs = require("./ffjs");

var ethers = _interopRequireWildcard(require("ethers"));

var _random = require("@ethersproject/random");

var _hdnode = require("@ethersproject/hdnode");

var _signingKey = require("@ethersproject/signing-key");

var _hash = require("./hash");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function get_CREATE_L2_ACCOUNT_MSG(chainID) {
  return 'FLUIDEX_L2_ACCOUNT' + "\nChain ID: ".concat(chainID, ".");
} // https://github.com/ethers-io/ethers.js/issues/447#issuecomment-519163178


function recoverPublicKeyFromSignature(message, signature) {
  var msgHash = ethers.utils.hashMessage(message);
  var msgHashBytes = ethers.utils.arrayify(msgHash);
  return ethers.utils.recoverPublicKey(msgHashBytes, signature);
}

var L2Account = /*#__PURE__*/function () {
  function L2Account(seed) {
    _classCallCheck(this, L2Account);

    if (seed.length != 32) {
      throw new Error('invalid l2 key seed');
    }

    this.rollupPrvKey = Buffer.from(seed);
    var bjPubKey = (0, _eddsa.prv2pub)(this.rollupPrvKey);
    this.ax = _ffjs.Scalar.fromString(bjPubKey[0].toString(16), 16);
    this.ay = _ffjs.Scalar.fromString(bjPubKey[1].toString(16), 16);

    var compressedBuff = _circomlib.babyJub.packPoint(bjPubKey);

    this.sign = 0n;

    if (compressedBuff[31] & 0x80) {
      this.sign = 1n;
    }

    this.bjjPubKey = '0x' + compressedBuff.toString('hex'); //this.bjjCompressed = utils.padZeros(ffutils.leBuff2int(compressedBuff).toString(16), 64);
  }

  _createClass(L2Account, [{
    key: "signHashPacked",
    value: function signHashPacked(h) {
      var sig = (0, _eddsa.signWithHasher)(this.rollupPrvKey, h, _hash.hash);
      return (0, _eddsa.packSignature)(sig).toString('hex');
    }
  }, {
    key: "signHash",
    value: function signHash(h) {
      var sig = (0, _eddsa.signWithHasher)(this.rollupPrvKey, h, _hash.hash);
      return {
        hash: h,
        S: sig.S,
        R8x: sig.R8[0],
        R8y: sig.R8[1]
      };
    }
  }]);

  return L2Account;
}();

exports.L2Account = L2Account;

function randomMnemonic() {
  var entropy = (0, _random.randomBytes)(16);
  var mnemonic = (0, _hdnode.entropyToMnemonic)(entropy);
  return mnemonic;
}

var TxSignature = function TxSignature() {
  _classCallCheck(this, TxSignature);
};

exports.TxSignature = TxSignature;

var Account = /*#__PURE__*/function () {
  function Account() {
    _classCallCheck(this, Account);
  }

  _createClass(Account, [{
    key: "signHash",
    value: function signHash(h) {
      return this.l2Account.signHash(h);
    }
  }, {
    key: "signHashPacked",
    value: function signHashPacked(h) {
      return this.l2Account.signHashPacked(h);
    }
  }, {
    key: "ay",
    get: function get() {
      return this.l2Account.ay;
    }
  }, {
    key: "ax",
    get: function get() {
      return this.l2Account.ax;
    }
  }, {
    key: "sign",
    get: function get() {
      return this.l2Account.sign;
    }
  }, {
    key: "bjjPubKey",
    get: function get() {
      return this.l2Account.bjjPubKey;
    }
  }], [{
    key: "fromMnemonic",
    value: function fromMnemonic(mnemonic) {
      var chainId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      var privKey = _hdnode.HDNode.fromMnemonic(mnemonic, null, null).derivePath(_hdnode.defaultPath).privateKey; //console.log('eth priv key', privKey);


      return Account.fromPrivkey(privKey, chainId);
    }
  }, {
    key: "fromPrivkey",
    value: function fromPrivkey(privKey) {
      var chainId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var msgHash = ethers.utils.hashMessage(get_CREATE_L2_ACCOUNT_MSG(chainId));
      var signKey = new _signingKey.SigningKey(privKey);
      var signature = ethers.utils.joinSignature(signKey.signDigest(msgHash));
      return Account.fromSignature(signature, chainId);
    }
  }, {
    key: "fromSignature",
    value: function fromSignature(signature) {
      var chainId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      // ethers signature is 65-byte
      var acc = new Account();
      acc.publicKey = recoverPublicKeyFromSignature(get_CREATE_L2_ACCOUNT_MSG(chainId), signature);
      acc.ethAddr = ethers.utils.computeAddress(acc.publicKey); // Derive a L2 private key from seed

      var seed = ethers.utils.arrayify(signature).slice(0, 32); //console.log('seed', seed)

      acc.l2Account = new L2Account(seed);
      return acc;
    }
  }, {
    key: "random",
    value: function random() {
      var mnemonic = randomMnemonic();
      return Account.fromMnemonic(mnemonic, 1); // default chainID: 1
    }
  }]);

  return Account;
}();

exports.Account = Account;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hY2NvdW50LnRzIl0sIm5hbWVzIjpbImdldF9DUkVBVEVfTDJfQUNDT1VOVF9NU0ciLCJjaGFpbklEIiwicmVjb3ZlclB1YmxpY0tleUZyb21TaWduYXR1cmUiLCJtZXNzYWdlIiwic2lnbmF0dXJlIiwibXNnSGFzaCIsImV0aGVycyIsInV0aWxzIiwiaGFzaE1lc3NhZ2UiLCJtc2dIYXNoQnl0ZXMiLCJhcnJheWlmeSIsInJlY292ZXJQdWJsaWNLZXkiLCJMMkFjY291bnQiLCJzZWVkIiwibGVuZ3RoIiwiRXJyb3IiLCJyb2xsdXBQcnZLZXkiLCJCdWZmZXIiLCJmcm9tIiwiYmpQdWJLZXkiLCJheCIsIlNjYWxhciIsImZyb21TdHJpbmciLCJ0b1N0cmluZyIsImF5IiwiY29tcHJlc3NlZEJ1ZmYiLCJiYWJ5SnViIiwicGFja1BvaW50Iiwic2lnbiIsImJqalB1YktleSIsImgiLCJzaWciLCJoYXNoIiwiUyIsIlI4eCIsIlI4IiwiUjh5IiwicmFuZG9tTW5lbW9uaWMiLCJlbnRyb3B5IiwibW5lbW9uaWMiLCJUeFNpZ25hdHVyZSIsIkFjY291bnQiLCJsMkFjY291bnQiLCJzaWduSGFzaCIsInNpZ25IYXNoUGFja2VkIiwiY2hhaW5JZCIsInByaXZLZXkiLCJIRE5vZGUiLCJmcm9tTW5lbW9uaWMiLCJkZXJpdmVQYXRoIiwiZGVmYXVsdFBhdGgiLCJwcml2YXRlS2V5IiwiZnJvbVByaXZrZXkiLCJzaWduS2V5IiwiU2lnbmluZ0tleSIsImpvaW5TaWduYXR1cmUiLCJzaWduRGlnZXN0IiwiZnJvbVNpZ25hdHVyZSIsImFjYyIsInB1YmxpY0tleSIsImV0aEFkZHIiLCJjb21wdXRlQWRkcmVzcyIsInNsaWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsU0FBU0EseUJBQVQsQ0FBbUNDLE9BQW5DLEVBQTREO0FBQzFELFNBQU8s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NkJBQTZCLENBQUNGLHlCQUF5QixDQUFDNkMsT0FBRCxDQUExQixFQUFxQ3pDLFNBQXJDLENBQTdDO0FBQ0FzRCxNQUFBQSxHQUFHLENBQUNFLE9BQUosR0FBY3RELE1BQU0sQ0FBQ0MsS0FBUCxDQUFhc0QsY0FBYixDQUE0QkgsR0FBRyxDQUFDQyxTQUFoQyxDQUFkLENBSm9ELENBS3BEOztBQUNBLFVBQU05QyxJQUFJLEdBQUdQLE1BQU0sQ0FBQ0MsS0FBUCxDQUFhRyxRQUFiLENBQXNCTixTQUF0QixFQUFpQzBELEtBQWpDLENBQXVDLENBQXZDLEVBQTBDLEVBQTFDLENBQWIsQ0FOb0QsQ0FPcEQ7O0FBQ0FKLE1BQUFBLEdBQUcsQ0FBQ2hCLFNBQUosR0FBZ0IsSUFBSTlCLFNBQUosQ0FBY0MsSUFBZCxDQUFoQjtBQUNBLGFBQU82QyxHQUFQO0FBQ0Q7OztXQUNELGtCQUF5QjtBQUN2QixVQUFNbkIsUUFBUSxHQUFHRixjQUFjLEVBQS9CO0FBQ0EsYUFBT0ksT0FBTyxDQUFDTyxZQUFSLENBQXFCVCxRQUFyQixFQUErQixDQUEvQixDQUFQLENBRnVCLENBRW1CO0FBQzNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcHJ2MnB1Yiwgc2lnbldpdGhIYXNoZXIsIHBhY2tTaWduYXR1cmUgfSBmcm9tICcuL2VkZHNhJztcbmltcG9ydCB7IGJhYnlKdWIgfSBmcm9tICdjaXJjb21saWInO1xuaW1wb3J0IHsgZmZ1dGlscywgU2NhbGFyIH0gZnJvbSAnLi9mZmpzJztcbmltcG9ydCAqIGFzIGV0aGVycyBmcm9tICdldGhlcnMnO1xuaW1wb3J0IHsgcmFuZG9tQnl0ZXMgfSBmcm9tICdAZXRoZXJzcHJvamVjdC9yYW5kb20nO1xuaW1wb3J0IHsgZGVmYXVsdFBhdGgsIEhETm9kZSwgZW50cm9weVRvTW5lbW9uaWMsIE1uZW1vbmljIH0gZnJvbSAnQGV0aGVyc3Byb2plY3QvaGRub2RlJztcbmltcG9ydCB7IFNpZ25pbmdLZXkgfSBmcm9tICdAZXRoZXJzcHJvamVjdC9zaWduaW5nLWtleSc7XG5pbXBvcnQgeyBoYXNoIH0gZnJvbSAnLi9oYXNoJztcblxuZnVuY3Rpb24gZ2V0X0NSRUFURV9MMl9BQ0NPVU5UX01TRyhjaGFpbklEOiBudW1iZXIpOiBzdHJpbmcge1xuICByZXR1cm4gJ0ZMVUlERVhfTDJfQUNDT1VOVCcgKyBgXFxuQ2hhaW4gSUQ6ICR7Y2hhaW5JRH0uYDtcbn1cblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2V0aGVycy1pby9ldGhlcnMuanMvaXNzdWVzLzQ0NyNpc3N1ZWNvbW1lbnQtNTE5MTYzMTc4XG5mdW5jdGlvbiByZWNvdmVyUHVibGljS2V5RnJvbVNpZ25hdHVyZShtZXNzYWdlOiBzdHJpbmcsIHNpZ25hdHVyZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgbXNnSGFzaCA9IGV0aGVycy51dGlscy5oYXNoTWVzc2FnZShtZXNzYWdlKTtcbiAgY29uc3QgbXNnSGFzaEJ5dGVzID0gZXRoZXJzLnV0aWxzLmFycmF5aWZ5KG1zZ0hhc2gpO1xuICByZXR1cm4gZXRoZXJzLnV0aWxzLnJlY292ZXJQdWJsaWNLZXkobXNnSGFzaEJ5dGVzLCBzaWduYXR1cmUpO1xufVxuXG5jbGFzcyBMMkFjY291bnQge1xuICBwcml2YXRlIHJvbGx1cFBydktleTogQnVmZmVyO1xuICBwdWJsaWMgYXg6IGJpZ2ludDtcbiAgcHVibGljIGF5OiBiaWdpbnQ7XG4gIHB1YmxpYyBzaWduOiBiaWdpbnQ7XG4gIHB1YmxpYyBiampQdWJLZXk6IHN0cmluZztcbiAgY29uc3RydWN0b3Ioc2VlZCkge1xuICAgIGlmIChzZWVkLmxlbmd0aCAhPSAzMikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGwyIGtleSBzZWVkJyk7XG4gICAgfVxuXG4gICAgdGhpcy5yb2xsdXBQcnZLZXkgPSBCdWZmZXIuZnJvbShzZWVkKTtcblxuICAgIGNvbnN0IGJqUHViS2V5ID0gcHJ2MnB1Yih0aGlzLnJvbGx1cFBydktleSk7XG5cbiAgICB0aGlzLmF4ID0gU2NhbGFyLmZyb21TdHJpbmcoYmpQdWJLZXlbMF0udG9TdHJpbmcoMTYpLCAxNik7XG4gICAgdGhpcy5heSA9IFNjYWxhci5mcm9tU3RyaW5nKGJqUHViS2V5WzFdLnRvU3RyaW5nKDE2KSwgMTYpO1xuXG4gICAgY29uc3QgY29tcHJlc3NlZEJ1ZmYgPSBiYWJ5SnViLnBhY2tQb2ludChialB1YktleSk7XG5cbiAgICB0aGlzLnNpZ24gPSAwbjtcbiAgICBpZiAoY29tcHJlc3NlZEJ1ZmZbMzFdICYgMHg4MCkge1xuICAgICAgdGhpcy5zaWduID0gMW47XG4gICAgfVxuICAgIHRoaXMuYmpqUHViS2V5ID0gJzB4JyArIGNvbXByZXNzZWRCdWZmLnRvU3RyaW5nKCdoZXgnKTtcbiAgICAvL3RoaXMuYmpqQ29tcHJlc3NlZCA9IHV0aWxzLnBhZFplcm9zKGZmdXRpbHMubGVCdWZmMmludChjb21wcmVzc2VkQnVmZikudG9TdHJpbmcoMTYpLCA2NCk7XG4gIH1cblxuICBzaWduSGFzaFBhY2tlZChoOiBiaWdpbnQpOiBzdHJpbmcge1xuICAgIGNvbnN0IHNpZyA9IHNpZ25XaXRoSGFzaGVyKHRoaXMucm9sbHVwUHJ2S2V5LCBoLCBoYXNoKTtcbiAgICByZXR1cm4gcGFja1NpZ25hdHVyZShzaWcpLnRvU3RyaW5nKCdoZXgnKTtcbiAgfVxuXG4gIHNpZ25IYXNoKGg6IGJpZ2ludCk6IFR4U2lnbmF0dXJlIHtcbiAgICBjb25zdCBzaWcgPSBzaWduV2l0aEhhc2hlcih0aGlzLnJvbGx1cFBydktleSwgaCwgaGFzaCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhhc2g6IGgsXG4gICAgICBTOiBzaWcuUyxcbiAgICAgIFI4eDogc2lnLlI4WzBdLFxuICAgICAgUjh5OiBzaWcuUjhbMV0sXG4gICAgfTtcbiAgfVxufVxuXG5mdW5jdGlvbiByYW5kb21NbmVtb25pYygpOiBzdHJpbmcge1xuICBsZXQgZW50cm9weTogVWludDhBcnJheSA9IHJhbmRvbUJ5dGVzKDE2KTtcbiAgY29uc3QgbW5lbW9uaWMgPSBlbnRyb3B5VG9NbmVtb25pYyhlbnRyb3B5KTtcbiAgcmV0dXJuIG1uZW1vbmljO1xufVxuXG5jbGFzcyBUeFNpZ25hdHVyZSB7XG4gIGhhc2g6IGJpZ2ludDtcbiAgUzogYmlnaW50O1xuICBSOHg6IGJpZ2ludDtcbiAgUjh5OiBiaWdpbnQ7XG59XG5jbGFzcyBBY2NvdW50IHtcbiAgcHVibGljIHB1YmxpY0tleTogc3RyaW5nO1xuICBwdWJsaWMgZXRoQWRkcjogc3RyaW5nO1xuICBwdWJsaWMgbDJBY2NvdW50OiBMMkFjY291bnQ7XG5cbiAgc3RhdGljIGZyb21NbmVtb25pYyhtbmVtb25pYywgY2hhaW5JZCA9IDEpOiBBY2NvdW50IHtcbiAgICBjb25zdCBwcml2S2V5ID0gSEROb2RlLmZyb21NbmVtb25pYyhtbmVtb25pYywgbnVsbCwgbnVsbCkuZGVyaXZlUGF0aChkZWZhdWx0UGF0aCkucHJpdmF0ZUtleTtcbiAgICAvL2NvbnNvbGUubG9nKCdldGggcHJpdiBrZXknLCBwcml2S2V5KTtcbiAgICByZXR1cm4gQWNjb3VudC5mcm9tUHJpdmtleShwcml2S2V5LCBjaGFpbklkKTtcbiAgfVxuICBzdGF0aWMgZnJvbVByaXZrZXkocHJpdktleSwgY2hhaW5JZCA9IDEpOiBBY2NvdW50IHtcbiAgICBjb25zdCBtc2dIYXNoID0gZXRoZXJzLnV0aWxzLmhhc2hNZXNzYWdlKGdldF9DUkVBVEVfTDJfQUNDT1VOVF9NU0coY2hhaW5JZCkpO1xuICAgIGNvbnN0IHNpZ25LZXkgPSBuZXcgU2lnbmluZ0tleShwcml2S2V5KTtcbiAgICBjb25zdCBzaWduYXR1cmUgPSBldGhlcnMudXRpbHMuam9pblNpZ25hdHVyZShzaWduS2V5LnNpZ25EaWdlc3QobXNnSGFzaCkpO1xuICAgIHJldHVybiBBY2NvdW50LmZyb21TaWduYXR1cmUoc2lnbmF0dXJlLCBjaGFpbklkKTtcbiAgfVxuICBzdGF0aWMgZnJvbVNpZ25hdHVyZShzaWduYXR1cmUsIGNoYWluSWQgPSAxKTogQWNjb3VudCB7XG4gICAgLy8gZXRoZXJzIHNpZ25hdHVyZSBpcyA2NS1ieXRlXG4gICAgbGV0IGFjYyA9IG5ldyBBY2NvdW50KCk7XG4gICAgYWNjLnB1YmxpY0tleSA9IHJlY292ZXJQdWJsaWNLZXlGcm9tU2lnbmF0dXJlKGdldF9DUkVBVEVfTDJfQUNDT1VOVF9NU0coY2hhaW5JZCksIHNpZ25hdHVyZSk7XG4gICAgYWNjLmV0aEFkZHIgPSBldGhlcnMudXRpbHMuY29tcHV0ZUFkZHJlc3MoYWNjLnB1YmxpY0tleSk7XG4gICAgLy8gRGVyaXZlIGEgTDIgcHJpdmF0ZSBrZXkgZnJvbSBzZWVkXG4gICAgY29uc3Qgc2VlZCA9IGV0aGVycy51dGlscy5hcnJheWlmeShzaWduYXR1cmUpLnNsaWNlKDAsIDMyKTtcbiAgICAvL2NvbnNvbGUubG9nKCdzZWVkJywgc2VlZClcbiAgICBhY2MubDJBY2NvdW50ID0gbmV3IEwyQWNjb3VudChzZWVkKTtcbiAgICByZXR1cm4gYWNjO1xuICB9XG4gIHN0YXRpYyByYW5kb20oKTogQWNjb3VudCB7XG4gICAgY29uc3QgbW5lbW9uaWMgPSByYW5kb21NbmVtb25pYygpO1xuICAgIHJldHVybiBBY2NvdW50LmZyb21NbmVtb25pYyhtbmVtb25pYywgMSk7IC8vIGRlZmF1bHQgY2hhaW5JRDogMVxuICB9XG4gIHNpZ25IYXNoKGg6IGJpZ2ludCk6IFR4U2lnbmF0dXJlIHtcbiAgICByZXR1cm4gdGhpcy5sMkFjY291bnQuc2lnbkhhc2goaCk7XG4gIH1cbiAgc2lnbkhhc2hQYWNrZWQoaDogYmlnaW50KTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5sMkFjY291bnQuc2lnbkhhc2hQYWNrZWQoaCk7XG4gIH1cbiAgZ2V0IGF5KCk6IGJpZ2ludCB7XG4gICAgcmV0dXJuIHRoaXMubDJBY2NvdW50LmF5O1xuICB9XG4gIGdldCBheCgpOiBiaWdpbnQge1xuICAgIHJldHVybiB0aGlzLmwyQWNjb3VudC5heDtcbiAgfVxuICBnZXQgc2lnbigpOiBiaWdpbnQge1xuICAgIHJldHVybiB0aGlzLmwyQWNjb3VudC5zaWduO1xuICB9XG4gIGdldCBiampQdWJLZXkoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5sMkFjY291bnQuYmpqUHViS2V5O1xuICB9XG59XG5leHBvcnQgeyBMMkFjY291bnQsIEFjY291bnQsIGdldF9DUkVBVEVfTDJfQUNDT1VOVF9NU0csIHJlY292ZXJQdWJsaWNLZXlGcm9tU2lnbmF0dXJlLCByYW5kb21NbmVtb25pYywgVHhTaWduYXR1cmUgfTtcbiJdfQ==