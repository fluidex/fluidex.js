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
      return (0, _eddsa.packSignature)(sig);
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

      var privKey = _hdnode.HDNode.fromMnemonic(mnemonic, null, null).derivePath(_hdnode.defaultPath).privateKey;

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

      var seed = ethers.utils.arrayify(signature).slice(0, 32);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hY2NvdW50LnRzIl0sIm5hbWVzIjpbImdldF9DUkVBVEVfTDJfQUNDT1VOVF9NU0ciLCJjaGFpbklEIiwicmVjb3ZlclB1YmxpY0tleUZyb21TaWduYXR1cmUiLCJtZXNzYWdlIiwic2lnbmF0dXJlIiwibXNnSGFzaCIsImV0aGVycyIsInV0aWxzIiwiaGFzaE1lc3NhZ2UiLCJtc2dIYXNoQnl0ZXMiLCJhcnJheWlmeSIsInJlY292ZXJQdWJsaWNLZXkiLCJMMkFjY291bnQiLCJzZWVkIiwibGVuZ3RoIiwiRXJyb3IiLCJyb2xsdXBQcnZLZXkiLCJCdWZmZXIiLCJmcm9tIiwiYmpQdWJLZXkiLCJheCIsIlNjYWxhciIsImZyb21TdHJpbmciLCJ0b1N0cmluZyIsImF5IiwiY29tcHJlc3NlZEJ1ZmYiLCJiYWJ5SnViIiwicGFja1BvaW50Iiwic2lnbiIsImJqalB1YktleSIsImgiLCJzaWciLCJoYXNoIiwiUyIsIlI4eCIsIlI4IiwiUjh5IiwicmFuZG9tTW5lbW9uaWMiLCJlbnRyb3B5IiwibW5lbW9uaWMiLCJUeFNpZ25hdHVyZSIsIkFjY291bnQiLCJsMkFjY291bnQiLCJzaWduSGFzaCIsImNoYWluSWQiLCJwcml2S2V5IiwiSEROb2RlIiwiZnJvbU1uZW1vbmljIiwiZGVyaXZlUGF0aCIsImRlZmF1bHRQYXRoIiwicHJpdmF0ZUtleSIsImZyb21Qcml2a2V5Iiwic2lnbktleSIsIlNpZ25pbmdLZXkiLCJqb2luU2lnbmF0dXJlIiwic2lnbkRpZ2VzdCIsImZyb21TaWduYXR1cmUiLCJhY2MiLCJwdWJsaWNLZXkiLCJldGhBZGRyIiwiY29tcHV0ZUFkZHJlc3MiLCJzbGljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUdBLFNBQVNBLHlCQUFULENBQW1DQyxPQUFuQyxFQUE0RDtBQUMxRCxTQUFPLDZDQUFzQ0EsT0FBdEMsTUFB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Q0MsU0FBaEMsQ0FBZCxDQUpvRCxDQUtwRDs7QUFDQSxVQUFNN0MsSUFBSSxHQUFHUCxNQUFNLENBQUNDLEtBQVAsQ0FBYUcsUUFBYixDQUFzQk4sU0FBdEIsRUFBaUN5RCxLQUFqQyxDQUF1QyxDQUF2QyxFQUEwQyxFQUExQyxDQUFiO0FBQ0FKLE1BQUFBLEdBQUcsQ0FBQ2YsU0FBSixHQUFnQixJQUFJOUIsU0FBSixDQUFjQyxJQUFkLENBQWhCO0FBQ0EsYUFBTzRDLEdBQVA7QUFDRDs7O1dBQ0Qsa0JBQXlCO0FBQ3ZCLFVBQU1sQixRQUFRLEdBQUdGLGNBQWMsRUFBL0I7QUFDQSxhQUFPSSxPQUFPLENBQUNNLFlBQVIsQ0FBcUJSLFFBQXJCLEVBQStCLENBQS9CLENBQVAsQ0FGdUIsQ0FFbUI7QUFDM0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3BydjJwdWIsIHNpZ25XaXRoSGFzaGVyLCBwYWNrU2lnbmF0dXJlfSBmcm9tICcuL2VkZHNhJztcbmltcG9ydCB7YmFieUp1Yn0gZnJvbSAnY2lyY29tbGliJztcbmltcG9ydCB7IGZmdXRpbHMsIFNjYWxhciB9IGZyb20gJy4vZmZqcyc7XG5pbXBvcnQgKiBhcyBldGhlcnMgZnJvbSAnZXRoZXJzJztcbmltcG9ydCB7IHJhbmRvbUJ5dGVzIH0gZnJvbSAnQGV0aGVyc3Byb2plY3QvcmFuZG9tJztcbmltcG9ydCB7IGRlZmF1bHRQYXRoLCBIRE5vZGUsIGVudHJvcHlUb01uZW1vbmljLCBNbmVtb25pYyB9IGZyb20gJ0BldGhlcnNwcm9qZWN0L2hkbm9kZSc7XG5pbXBvcnQgeyBTaWduaW5nS2V5IH0gZnJvbSAnQGV0aGVyc3Byb2plY3Qvc2lnbmluZy1rZXknO1xuaW1wb3J0IHsgaGFzaCB9IGZyb20gJy4vaGFzaCc7XG5cblxuZnVuY3Rpb24gZ2V0X0NSRUFURV9MMl9BQ0NPVU5UX01TRyhjaGFpbklEOiBudW1iZXIpOiBzdHJpbmcge1xuICByZXR1cm4gJ0ZMVUlERVhfTDJfQUNDT1VOVCcgKyBgXFxuQ2hhaW4gSUQ6ICR7Y2hhaW5JRH0uYDtcbn1cblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2V0aGVycy1pby9ldGhlcnMuanMvaXNzdWVzLzQ0NyNpc3N1ZWNvbW1lbnQtNTE5MTYzMTc4XG5mdW5jdGlvbiByZWNvdmVyUHVibGljS2V5RnJvbVNpZ25hdHVyZShtZXNzYWdlOiBzdHJpbmcsIHNpZ25hdHVyZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgbXNnSGFzaCA9IGV0aGVycy51dGlscy5oYXNoTWVzc2FnZShtZXNzYWdlKTtcbiAgY29uc3QgbXNnSGFzaEJ5dGVzID0gZXRoZXJzLnV0aWxzLmFycmF5aWZ5KG1zZ0hhc2gpO1xuICByZXR1cm4gZXRoZXJzLnV0aWxzLnJlY292ZXJQdWJsaWNLZXkobXNnSGFzaEJ5dGVzLCBzaWduYXR1cmUpO1xufVxuXG5jbGFzcyBMMkFjY291bnQge1xuICBwcml2YXRlIHJvbGx1cFBydktleTogQnVmZmVyO1xuICBwdWJsaWMgYXg6IGJpZ2ludDtcbiAgcHVibGljIGF5OiBiaWdpbnQ7XG4gIHB1YmxpYyBzaWduOiBiaWdpbnQ7XG4gIHB1YmxpYyBiampQdWJLZXk6IHN0cmluZztcbiAgY29uc3RydWN0b3Ioc2VlZCkge1xuICAgIGlmIChzZWVkLmxlbmd0aCAhPSAzMikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGwyIGtleSBzZWVkJyk7XG4gICAgfVxuXG4gICAgdGhpcy5yb2xsdXBQcnZLZXkgPSBCdWZmZXIuZnJvbShzZWVkKTtcblxuICAgIGNvbnN0IGJqUHViS2V5ID0gcHJ2MnB1Yih0aGlzLnJvbGx1cFBydktleSk7XG5cbiAgICB0aGlzLmF4ID0gU2NhbGFyLmZyb21TdHJpbmcoYmpQdWJLZXlbMF0udG9TdHJpbmcoMTYpLCAxNik7XG4gICAgdGhpcy5heSA9IFNjYWxhci5mcm9tU3RyaW5nKGJqUHViS2V5WzFdLnRvU3RyaW5nKDE2KSwgMTYpO1xuXG4gICAgY29uc3QgY29tcHJlc3NlZEJ1ZmYgPSBiYWJ5SnViLnBhY2tQb2ludChialB1YktleSk7XG5cbiAgICB0aGlzLnNpZ24gPSAwbjtcbiAgICBpZiAoY29tcHJlc3NlZEJ1ZmZbMzFdICYgMHg4MCkge1xuICAgICAgdGhpcy5zaWduID0gMW47XG4gICAgfVxuICAgIHRoaXMuYmpqUHViS2V5ID0gJzB4JyArIGNvbXByZXNzZWRCdWZmLnRvU3RyaW5nKCdoZXgnKTtcbiAgICAvL3RoaXMuYmpqQ29tcHJlc3NlZCA9IHV0aWxzLnBhZFplcm9zKGZmdXRpbHMubGVCdWZmMmludChjb21wcmVzc2VkQnVmZikudG9TdHJpbmcoMTYpLCA2NCk7XG4gIH1cblxuICBzaWduSGFzaFBhY2tlZChoOiBiaWdpbnQpIHtcbiAgICBjb25zdCBzaWcgPSBzaWduV2l0aEhhc2hlcih0aGlzLnJvbGx1cFBydktleSwgaCwgaGFzaCk7XG4gICAgcmV0dXJuIHBhY2tTaWduYXR1cmUoc2lnKTtcbiAgfVxuXG4gIHNpZ25IYXNoKGg6IGJpZ2ludCk6IFR4U2lnbmF0dXJlIHtcbiAgICBjb25zdCBzaWcgPSBzaWduV2l0aEhhc2hlcih0aGlzLnJvbGx1cFBydktleSwgaCwgaGFzaCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhhc2g6IGgsXG4gICAgICBTOiBzaWcuUyxcbiAgICAgIFI4eDogc2lnLlI4WzBdLFxuICAgICAgUjh5OiBzaWcuUjhbMV0sXG4gICAgfTtcbiAgfVxufVxuXG5mdW5jdGlvbiByYW5kb21NbmVtb25pYygpOiBzdHJpbmcge1xuICBsZXQgZW50cm9weTogVWludDhBcnJheSA9IHJhbmRvbUJ5dGVzKDE2KTtcbiAgY29uc3QgbW5lbW9uaWMgPSBlbnRyb3B5VG9NbmVtb25pYyhlbnRyb3B5KTtcbiAgcmV0dXJuIG1uZW1vbmljO1xufVxuXG5jbGFzcyBUeFNpZ25hdHVyZSB7XG4gIGhhc2g6IGJpZ2ludDtcbiAgUzogYmlnaW50O1xuICBSOHg6IGJpZ2ludDtcbiAgUjh5OiBiaWdpbnQ7XG59XG5jbGFzcyBBY2NvdW50IHtcbiAgcHVibGljIHB1YmxpY0tleTogc3RyaW5nO1xuICBwdWJsaWMgZXRoQWRkcjogc3RyaW5nO1xuICBwdWJsaWMgbDJBY2NvdW50OiBMMkFjY291bnQ7XG5cbiAgc3RhdGljIGZyb21NbmVtb25pYyhtbmVtb25pYywgY2hhaW5JZCA9IDEpOiBBY2NvdW50IHtcbiAgICBjb25zdCBwcml2S2V5ID0gSEROb2RlLmZyb21NbmVtb25pYyhtbmVtb25pYywgbnVsbCwgbnVsbCkuZGVyaXZlUGF0aChkZWZhdWx0UGF0aCkucHJpdmF0ZUtleTtcbiAgICByZXR1cm4gQWNjb3VudC5mcm9tUHJpdmtleShwcml2S2V5LCBjaGFpbklkKTtcbiAgfVxuICBzdGF0aWMgZnJvbVByaXZrZXkocHJpdktleSwgY2hhaW5JZCA9IDEpOiBBY2NvdW50IHtcbiAgICBjb25zdCBtc2dIYXNoID0gZXRoZXJzLnV0aWxzLmhhc2hNZXNzYWdlKGdldF9DUkVBVEVfTDJfQUNDT1VOVF9NU0coY2hhaW5JZCkpO1xuICAgIGNvbnN0IHNpZ25LZXkgPSBuZXcgU2lnbmluZ0tleShwcml2S2V5KTtcbiAgICBjb25zdCBzaWduYXR1cmUgPSBldGhlcnMudXRpbHMuam9pblNpZ25hdHVyZShzaWduS2V5LnNpZ25EaWdlc3QobXNnSGFzaCkpO1xuICAgIHJldHVybiBBY2NvdW50LmZyb21TaWduYXR1cmUoc2lnbmF0dXJlLCBjaGFpbklkKTtcbiAgfVxuICBzdGF0aWMgZnJvbVNpZ25hdHVyZShzaWduYXR1cmUsIGNoYWluSWQgPSAxKTogQWNjb3VudCB7XG4gICAgLy8gZXRoZXJzIHNpZ25hdHVyZSBpcyA2NS1ieXRlXG4gICAgbGV0IGFjYyA9IG5ldyBBY2NvdW50KCk7XG4gICAgYWNjLnB1YmxpY0tleSA9IHJlY292ZXJQdWJsaWNLZXlGcm9tU2lnbmF0dXJlKGdldF9DUkVBVEVfTDJfQUNDT1VOVF9NU0coY2hhaW5JZCksIHNpZ25hdHVyZSk7XG4gICAgYWNjLmV0aEFkZHIgPSBldGhlcnMudXRpbHMuY29tcHV0ZUFkZHJlc3MoYWNjLnB1YmxpY0tleSk7XG4gICAgLy8gRGVyaXZlIGEgTDIgcHJpdmF0ZSBrZXkgZnJvbSBzZWVkXG4gICAgY29uc3Qgc2VlZCA9IGV0aGVycy51dGlscy5hcnJheWlmeShzaWduYXR1cmUpLnNsaWNlKDAsIDMyKTtcbiAgICBhY2MubDJBY2NvdW50ID0gbmV3IEwyQWNjb3VudChzZWVkKTtcbiAgICByZXR1cm4gYWNjO1xuICB9XG4gIHN0YXRpYyByYW5kb20oKTogQWNjb3VudCB7XG4gICAgY29uc3QgbW5lbW9uaWMgPSByYW5kb21NbmVtb25pYygpO1xuICAgIHJldHVybiBBY2NvdW50LmZyb21NbmVtb25pYyhtbmVtb25pYywgMSk7IC8vIGRlZmF1bHQgY2hhaW5JRDogMVxuICB9XG4gIHNpZ25IYXNoKGg6IGJpZ2ludCk6IFR4U2lnbmF0dXJlIHtcbiAgICByZXR1cm4gdGhpcy5sMkFjY291bnQuc2lnbkhhc2goaCk7XG4gIH1cbiAgZ2V0IGF5KCk6IGJpZ2ludCB7XG4gICAgcmV0dXJuIHRoaXMubDJBY2NvdW50LmF5O1xuICB9XG4gIGdldCBheCgpOiBiaWdpbnQge1xuICAgIHJldHVybiB0aGlzLmwyQWNjb3VudC5heDtcbiAgfVxuICBnZXQgc2lnbigpOiBiaWdpbnQge1xuICAgIHJldHVybiB0aGlzLmwyQWNjb3VudC5zaWduO1xuICB9XG4gIGdldCBiampQdWJLZXkoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5sMkFjY291bnQuYmpqUHViS2V5O1xuICB9XG59XG5leHBvcnQgeyBMMkFjY291bnQsIEFjY291bnQsIGdldF9DUkVBVEVfTDJfQUNDT1VOVF9NU0csIHJlY292ZXJQdWJsaWNLZXlGcm9tU2lnbmF0dXJlLCByYW5kb21NbmVtb25pYywgVHhTaWduYXR1cmUgfTtcbiJdfQ==