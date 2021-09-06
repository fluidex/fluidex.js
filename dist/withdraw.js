"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WithdrawTx = void 0;

var _hash2 = require("./hash");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var WithdrawTx = /*#__PURE__*/function () {
  function WithdrawTx() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, WithdrawTx);

    _defineProperty(this, "account_id", 0n);

    _defineProperty(this, "token_id", 0n);

    _defineProperty(this, "amount", 0n);

    _defineProperty(this, "nonce", 0n);

    _defineProperty(this, "old_balance", 0n);

    _defineProperty(this, "sig", null);

    Object.assign(this, data);
  }

  _createClass(WithdrawTx, [{
    key: "hash",
    value: function hash() {
      var magicHead = 3n; // TxType.Withdraw

      return (0, _hash2.hash)([magicHead, this.account_id, this.token_id, this.amount, this.nonce, this.old_balance]);
    }
  }, {
    key: "signWith",
    value: function signWith(account) {
      this.sig = account.signHash(this.hash());
    }
  }]);

  return WithdrawTx;
}();

exports.WithdrawTx = WithdrawTx;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93aXRoZHJhdy50cyJdLCJuYW1lcyI6WyJXaXRoZHJhd1R4IiwiZGF0YSIsIk9iamVjdCIsImFzc2lnbiIsIm1hZ2ljSGVhZCIsImFjY291bnRfaWQiLCJ0b2tlbl9pZCIsImFtb3VudCIsIm5vbmNlIiwib2xkX2JhbGFuY2UiLCJhY2NvdW50Iiwic2lnIiwic2lnbkhhc2giLCJoYXNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7Ozs7Ozs7Ozs7SUFFYUEsVTtBQU9YLHdCQUE0QztBQUFBLFFBQWhDQyxJQUFnQyx1RUFBSixFQUFJOztBQUFBOztBQUFBLHdDQU52QixFQU11Qjs7QUFBQSxzQ0FMekIsRUFLeUI7O0FBQUEsb0NBSjNCLEVBSTJCOztBQUFBLG1DQUg1QixFQUc0Qjs7QUFBQSx5Q0FGdEIsRUFFc0I7O0FBQUEsaUNBRHpCLElBQ3lCOztBQUMxQ0MsSUFBQUEsTUFBTSxDQUFDQyxNQUFQLENBQWMsSUFBZCxFQUFvQkYsSUFBcEI7QUFDRDs7OztXQUNELGdCQUFlO0FBQ2IsVUFBTUcsU0FBUyxHQUFHLEVBQWxCLENBRGEsQ0FDUzs7QUFDdEIsYUFBTyxpQkFBSyxDQUFDQSxTQUFELEVBQVksS0FBS0MsVUFBakIsRUFBNkIsS0FBS0MsUUFBbEMsRUFBNEMsS0FBS0MsTUFBakQsRUFBeUQsS0FBS0MsS0FBOUQsRUFBcUUsS0FBS0MsV0FBMUUsQ0FBTCxDQUFQO0FBQ0Q7OztXQUNELGtCQUFTQyxPQUFULEVBQTJCO0FBQ3pCLFdBQUtDLEdBQUwsR0FBV0QsT0FBTyxDQUFDRSxRQUFSLENBQWlCLEtBQUtDLElBQUwsRUFBakIsQ0FBWDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWNjb3VudCwgVHhTaWduYXR1cmUgfSBmcm9tICcuL2FjY291bnQnO1xuaW1wb3J0IHsgaGFzaCB9IGZyb20gJy4vaGFzaCc7XG5cbmV4cG9ydCBjbGFzcyBXaXRoZHJhd1R4IHtcbiAgYWNjb3VudF9pZDogYmlnaW50ID0gMG47XG4gIHRva2VuX2lkOiBiaWdpbnQgPSAwbjtcbiAgYW1vdW50OiBiaWdpbnQgPSAwbjtcbiAgbm9uY2U6IGJpZ2ludCA9IDBuO1xuICBvbGRfYmFsYW5jZTogYmlnaW50ID0gMG47XG4gIHNpZzogVHhTaWduYXR1cmUgPSBudWxsO1xuICBjb25zdHJ1Y3RvcihkYXRhOiBQYXJ0aWFsPFdpdGhkcmF3VHg+ID0ge30pIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIGRhdGEpO1xuICB9XG4gIGhhc2goKTogYmlnaW50IHtcbiAgICBjb25zdCBtYWdpY0hlYWQgPSAzbjsgLy8gVHhUeXBlLldpdGhkcmF3XG4gICAgcmV0dXJuIGhhc2goW21hZ2ljSGVhZCwgdGhpcy5hY2NvdW50X2lkLCB0aGlzLnRva2VuX2lkLCB0aGlzLmFtb3VudCwgdGhpcy5ub25jZSwgdGhpcy5vbGRfYmFsYW5jZV0pO1xuICB9XG4gIHNpZ25XaXRoKGFjY291bnQ6IEFjY291bnQpIHtcbiAgICB0aGlzLnNpZyA9IGFjY291bnQuc2lnbkhhc2godGhpcy5oYXNoKCkpO1xuICB9XG59XG4iXX0=