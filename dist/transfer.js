"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TransferTx = void 0;

var _hash2 = require("./hash");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TransferTx = /*#__PURE__*/function () {
  function TransferTx() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, TransferTx);

    _defineProperty(this, "token_id", 0n);

    _defineProperty(this, "amount", 0n);

    _defineProperty(this, "from", 0n);

    _defineProperty(this, "from_nonce", 0n);

    _defineProperty(this, "to", 0n);

    _defineProperty(this, "sig", null);

    Object.assign(this, data);
  }

  _createClass(TransferTx, [{
    key: "hash",
    value: function hash() {
      var magicHead = 2n; // TxType.Transfer

      var data = (0, _hash2.hash)([magicHead, this.token_id, this.amount, this.from, this.from_nonce, this.to]);
      return data;
    }
  }, {
    key: "signWith",
    value: function signWith(account) {
      this.sig = account.signHash(this.hash());
    }
  }]);

  return TransferTx;
}();

exports.TransferTx = TransferTx;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90cmFuc2Zlci50cyJdLCJuYW1lcyI6WyJUcmFuc2ZlclR4IiwiZGF0YSIsIk9iamVjdCIsImFzc2lnbiIsIm1hZ2ljSGVhZCIsInRva2VuX2lkIiwiYW1vdW50IiwiZnJvbSIsImZyb21fbm9uY2UiLCJ0byIsImFjY291bnQiLCJzaWciLCJzaWduSGFzaCIsImhhc2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7Ozs7Ozs7OztJQUVhQSxVO0FBT1gsd0JBQTRDO0FBQUEsUUFBaENDLElBQWdDLHVFQUFKLEVBQUk7O0FBQUE7O0FBQUEsc0NBTnpCLEVBTXlCOztBQUFBLG9DQUwzQixFQUsyQjs7QUFBQSxrQ0FKN0IsRUFJNkI7O0FBQUEsd0NBSHZCLEVBR3VCOztBQUFBLGdDQUYvQixFQUUrQjs7QUFBQSxpQ0FEekIsSUFDeUI7O0FBQzFDQyxJQUFBQSxNQUFNLENBQUNDLE1BQVAsQ0FBYyxJQUFkLEVBQW9CRixJQUFwQjtBQUNEOzs7O1dBQ0QsZ0JBQWU7QUFDYixVQUFNRyxTQUFTLEdBQUcsRUFBbEIsQ0FEYSxDQUNTOztBQUN0QixVQUFJSCxJQUFJLEdBQUcsaUJBQUssQ0FBQ0csU0FBRCxFQUFZLEtBQUtDLFFBQWpCLEVBQTJCLEtBQUtDLE1BQWhDLEVBQXdDLEtBQUtDLElBQTdDLEVBQW1ELEtBQUtDLFVBQXhELEVBQW9FLEtBQUtDLEVBQXpFLENBQUwsQ0FBWDtBQUNBLGFBQU9SLElBQVA7QUFDRDs7O1dBQ0Qsa0JBQVNTLE9BQVQsRUFBMkI7QUFDekIsV0FBS0MsR0FBTCxHQUFXRCxPQUFPLENBQUNFLFFBQVIsQ0FBaUIsS0FBS0MsSUFBTCxFQUFqQixDQUFYO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY2NvdW50LCBUeFNpZ25hdHVyZSB9IGZyb20gJy4vYWNjb3VudCc7XG5pbXBvcnQgeyBoYXNoIH0gZnJvbSAnLi9oYXNoJztcblxuZXhwb3J0IGNsYXNzIFRyYW5zZmVyVHgge1xuICB0b2tlbl9pZDogYmlnaW50ID0gMG47XG4gIGFtb3VudDogYmlnaW50ID0gMG47XG4gIGZyb206IGJpZ2ludCA9IDBuO1xuICBmcm9tX25vbmNlOiBiaWdpbnQgPSAwbjtcbiAgdG86IGJpZ2ludCA9IDBuO1xuICBzaWc6IFR4U2lnbmF0dXJlID0gbnVsbDtcbiAgY29uc3RydWN0b3IoZGF0YTogUGFydGlhbDxUcmFuc2ZlclR4PiA9IHt9KSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBkYXRhKTtcbiAgfVxuICBoYXNoKCk6IGJpZ2ludCB7XG4gICAgY29uc3QgbWFnaWNIZWFkID0gMm47IC8vIFR4VHlwZS5UcmFuc2ZlclxuICAgIGxldCBkYXRhID0gaGFzaChbbWFnaWNIZWFkLCB0aGlzLnRva2VuX2lkLCB0aGlzLmFtb3VudCwgdGhpcy5mcm9tLCB0aGlzLmZyb21fbm9uY2UsIHRoaXMudG9dKTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuICBzaWduV2l0aChhY2NvdW50OiBBY2NvdW50KSB7XG4gICAgdGhpcy5zaWcgPSBhY2NvdW50LnNpZ25IYXNoKHRoaXMuaGFzaCgpKTtcbiAgfVxufVxuIl19