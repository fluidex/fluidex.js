"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OrderState = exports.OrderInput = exports.OrderSide = void 0;

var _hash2 = require("./hash");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Scalar = require('ffjavascript').Scalar;

var OrderSide;
exports.OrderSide = OrderSide;

(function (OrderSide) {
  OrderSide[OrderSide["Buy"] = 0] = "Buy";
  OrderSide[OrderSide["Sell"] = 1] = "Sell";
})(OrderSide || (exports.OrderSide = OrderSide = {}));

var OrderInput = /*#__PURE__*/function () {
  function OrderInput() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, OrderInput);

    _defineProperty(this, "accountID", 0n);

    _defineProperty(this, "orderId", 0n);

    _defineProperty(this, "tokenBuy", 0n);

    _defineProperty(this, "tokenSell", 0n);

    _defineProperty(this, "totalSell", 0n);

    _defineProperty(this, "totalBuy", 0n);

    _defineProperty(this, "sig", null);

    Object.assign(this, data);
  }

  _createClass(OrderInput, [{
    key: "hash",
    value: function hash() {
      // although there is no 'TxType.PlaceOrder' now, we can see it as a 'SignType'
      var magicHead = 4n; // TxType.PlaceOrder

      var data = (0, _hash2.hash)([magicHead, this.tokenSell, this.tokenBuy, this.totalSell, this.totalBuy]); //data = hash([data, accountID, nonce]);
      // nonce and orderID seems redundant?
      //data = hash([data, this.accountID]);

      return data;
    }
  }, {
    key: "signWith",
    value: function signWith(account) {
      this.sig = account.signHash(this.hash());
    }
  }], [{
    key: "createEmpty",
    value: function createEmpty() {
      var result = new OrderInput();
      return result;
    }
  }]);

  return OrderInput;
}();

exports.OrderInput = OrderInput;

var OrderState = /*#__PURE__*/function () {
  function OrderState() {
    _classCallCheck(this, OrderState);
  }

  _createClass(OrderState, [{
    key: "orderId",
    get: function get() {
      return this.orderInput.orderId;
    }
  }, {
    key: "tokenBuy",
    get: function get() {
      return this.orderInput.tokenBuy;
    }
  }, {
    key: "tokenSell",
    get: function get() {
      return this.orderInput.tokenSell;
    }
  }, {
    key: "totalSell",
    get: function get() {
      return this.orderInput.totalSell;
    }
  }, {
    key: "totalBuy",
    get: function get() {
      return this.orderInput.totalBuy;
    }
  }, {
    key: "side",
    get: function get() {
      return this.orderInput.side;
    }
  }, {
    key: "isFilled",
    value: function isFilled() {
      return this.orderInput.side == OrderSide.Buy && this.filledBuy >= this.totalBuy || this.orderInput.side == OrderSide.Sell && this.filledSell >= this.totalSell;
    }
  }, {
    key: "orderState2Array",
    value:
    /**
     * Encode an order state object into an array
     * @returns {Array} Resulting array
     */
    function orderState2Array() {
      var data = Scalar.e(0);
      data = Scalar.add(data, this.orderId);
      data = Scalar.add(data, Scalar.shl(this.tokenBuy, 32));
      data = Scalar.add(data, Scalar.shl(this.tokenSell, 64));
      return [data, Scalar.e(this.filledSell), Scalar.e(this.filledBuy), Scalar.e(this.totalSell), Scalar.e(this.totalBuy)];
    }
    /**
     * Return the hash of an order state object
     * @returns {Scalar} Resulting hash
     */

  }, {
    key: "hash",
    value: function hash() {
      return (0, _hash2.hash)(this.orderState2Array());
    }
  }], [{
    key: "fromOrderInput",
    value: function fromOrderInput(orderInput) {
      var result = new OrderState();
      result.orderInput = orderInput;
      result.filledBuy = 0n;
      result.filledSell = 0n;
      return result;
    }
  }, {
    key: "createEmpty",
    value: function createEmpty() {
      return OrderState.fromOrderInput(OrderInput.createEmpty());
    }
  }]);

  return OrderState;
}();

exports.OrderState = OrderState;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vcmRlci50cyJdLCJuYW1lcyI6WyJTY2FsYXIiLCJyZXF1aXJlIiwiT3JkZXJTaWRlIiwiT3JkZXJJbnB1dCIsImRhdGEiLCJPYmplY3QiLCJhc3NpZ24iLCJtYWdpY0hlYWQiLCJ0b2tlblNlbGwiLCJ0b2tlbkJ1eSIsInRvdGFsU2VsbCIsInRvdGFsQnV5IiwiYWNjb3VudCIsInNpZyIsInNpZ25IYXNoIiwiaGFzaCIsInJlc3VsdCIsIk9yZGVyU3RhdGUiLCJvcmRlcklucHV0Iiwib3JkZXJJZCIsInNpZGUiLCJCdXkiLCJmaWxsZWRCdXkiLCJTZWxsIiwiZmlsbGVkU2VsbCIsImUiLCJhZGQiLCJzaGwiLCJvcmRlclN0YXRlMkFycmF5IiwiZnJvbU9yZGVySW5wdXQiLCJjcmVhdGVFbXB0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOzs7Ozs7Ozs7O0FBRkEsSUFBTUEsTUFBTSxHQUFHQyxPQUFPLENBQUMsY0FBRCxDQUFQLENBQXdCRCxNQUF2Qzs7SUFJWUUsUzs7O1dBQUFBLFM7QUFBQUEsRUFBQUEsUyxDQUFBQSxTO0FBQUFBLEVBQUFBLFMsQ0FBQUEsUztHQUFBQSxTLHlCQUFBQSxTOztJQUtDQyxVO0FBU1gsd0JBQTRDO0FBQUEsUUFBaENDLElBQWdDLHVFQUFKLEVBQUk7O0FBQUE7O0FBQUEsdUNBUnhCLEVBUXdCOztBQUFBLHFDQVAxQixFQU8wQjs7QUFBQSxzQ0FOekIsRUFNeUI7O0FBQUEsdUNBTHhCLEVBS3dCOztBQUFBLHVDQUp4QixFQUl3Qjs7QUFBQSxzQ0FIekIsRUFHeUI7O0FBQUEsaUNBRnpCLElBRXlCOztBQUMxQ0MsSUFBQUEsTUFBTSxDQUFDQyxNQUFQLENBQWMsSUFBZCxFQUFvQkYsSUFBcEI7QUFDRDs7OztXQUtELGdCQUFlO0FBQ2I7QUFDQSxVQUFNRyxTQUFTLEdBQUcsRUFBbEIsQ0FGYSxDQUVTOztBQUN0QixVQUFJSCxJQUFJLEdBQUcsaUJBQUssQ0FBQ0csU0FBRCxFQUFZLEtBQUtDLFNBQWpCLEVB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LCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBTY2FsYXIgPSByZXF1aXJlKCdmZmphdmFzY3JpcHQnKS5TY2FsYXI7XG5pbXBvcnQgeyBBY2NvdW50LCBUeFNpZ25hdHVyZSB9IGZyb20gJy4vYWNjb3VudCc7XG5pbXBvcnQgeyBoYXNoIH0gZnJvbSAnLi9oYXNoJztcblxuZXhwb3J0IGVudW0gT3JkZXJTaWRlIHtcbiAgQnV5LFxuICBTZWxsLFxufVxuXG5leHBvcnQgY2xhc3MgT3JkZXJJbnB1dCB7XG4gIGFjY291bnRJRDogYmlnaW50ID0gMG47XG4gIG9yZGVySWQ6IGJpZ2ludCA9IDBuO1xuICB0b2tlbkJ1eTogYmlnaW50ID0gMG47XG4gIHRva2VuU2VsbDogYmlnaW50ID0gMG47XG4gIHRvdGFsU2VsbDogYmlnaW50ID0gMG47XG4gIHRvdGFsQnV5OiBiaWdpbnQgPSAwbjtcbiAgc2lnOiBUeFNpZ25hdHVyZSA9IG51bGw7XG4gIHNpZGU6IE9yZGVyU2lkZTtcbiAgY29uc3RydWN0b3IoZGF0YTogUGFydGlhbDxPcmRlcklucHV0PiA9IHt9KSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBkYXRhKTtcbiAgfVxuICBzdGF0aWMgY3JlYXRlRW1wdHkoKTogT3JkZXJJbnB1dCB7XG4gICAgbGV0IHJlc3VsdCA9IG5ldyBPcmRlcklucHV0KCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBoYXNoKCk6IGJpZ2ludCB7XG4gICAgLy8gYWx0aG91Z2ggdGhlcmUgaXMgbm8gJ1R4VHlwZS5QbGFjZU9yZGVyJyBub3csIHdlIGNhbiBzZWUgaXQgYXMgYSAnU2lnblR5cGUnXG4gICAgY29uc3QgbWFnaWNIZWFkID0gNG47IC8vIFR4VHlwZS5QbGFjZU9yZGVyXG4gICAgbGV0IGRhdGEgPSBoYXNoKFttYWdpY0hlYWQsIHRoaXMudG9rZW5TZWxsLCB0aGlzLnRva2VuQnV5LCB0aGlzLnRvdGFsU2VsbCwgdGhpcy50b3RhbEJ1eV0pO1xuICAgIC8vZGF0YSA9IGhhc2goW2RhdGEsIGFjY291bnRJRCwgbm9uY2VdKTtcbiAgICAvLyBub25jZSBhbmQgb3JkZXJJRCBzZWVtcyByZWR1bmRhbnQ/XG4gICAgLy9kYXRhID0gaGFzaChbZGF0YSwgdGhpcy5hY2NvdW50SURdKTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuICBzaWduV2l0aChhY2NvdW50OiBBY2NvdW50KSB7XG4gICAgdGhpcy5zaWcgPSBhY2NvdW50LnNpZ25IYXNoKHRoaXMuaGFzaCgpKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgT3JkZXJTdGF0ZSB7XG4gIG9yZGVySW5wdXQ6IE9yZGVySW5wdXQ7XG5cbiAgZmlsbGVkU2VsbDogYmlnaW50O1xuICBmaWxsZWRCdXk6IGJpZ2ludDtcblxuICBnZXQgb3JkZXJJZCgpOiBiaWdpbnQge1xuICAgIHJldHVybiB0aGlzLm9yZGVySW5wdXQub3JkZXJJZDtcbiAgfVxuICBnZXQgdG9rZW5CdXkoKTogYmlnaW50IHtcbiAgICByZXR1cm4gdGhpcy5vcmRlcklucHV0LnRva2VuQnV5O1xuICB9XG4gIGdldCB0b2tlblNlbGwoKTogYmlnaW50IHtcbiAgICByZXR1cm4gdGhpcy5vcmRlcklucHV0LnRva2VuU2VsbDtcbiAgfVxuICBnZXQgdG90YWxTZWxsKCk6IGJpZ2ludCB7XG4gICAgcmV0dXJuIHRoaXMub3JkZXJJbnB1dC50b3RhbFNlbGw7XG4gIH1cbiAgZ2V0IHRvdGFsQnV5KCk6IGJpZ2ludCB7XG4gICAgcmV0dXJuIHRoaXMub3JkZXJJbnB1dC50b3RhbEJ1eTtcbiAgfVxuICBnZXQgc2lkZSgpOiBPcmRlclNpZGUge1xuICAgIHJldHVybiB0aGlzLm9yZGVySW5wdXQuc2lkZTtcbiAgfVxuICBpc0ZpbGxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgKHRoaXMub3JkZXJJbnB1dC5zaWRlID09IE9yZGVyU2lkZS5CdXkgJiYgdGhpcy5maWxsZWRCdXkgPj0gdGhpcy50b3RhbEJ1eSkgfHxcbiAgICAgICh0aGlzLm9yZGVySW5wdXQuc2lkZSA9PSBPcmRlclNpZGUuU2VsbCAmJiB0aGlzLmZpbGxlZFNlbGwgPj0gdGhpcy50b3RhbFNlbGwpXG4gICAgKTtcbiAgfVxuICBzdGF0aWMgZnJvbU9yZGVySW5wdXQob3JkZXJJbnB1dCk6IE9yZGVyU3RhdGUge1xuICAgIGxldCByZXN1bHQgPSBuZXcgT3JkZXJTdGF0ZSgpO1xuICAgIHJlc3VsdC5vcmRlcklucHV0ID0gb3JkZXJJbnB1dDtcbiAgICByZXN1bHQuZmlsbGVkQnV5ID0gMG47XG4gICAgcmVzdWx0LmZpbGxlZFNlbGwgPSAwbjtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHN0YXRpYyBjcmVhdGVFbXB0eSgpOiBPcmRlclN0YXRlIHtcbiAgICByZXR1cm4gT3JkZXJTdGF0ZS5mcm9tT3JkZXJJbnB1dChPcmRlcklucHV0LmNyZWF0ZUVtcHR5KCkpO1xuICB9XG4gIC8qKlxuICAgKiBFbmNvZGUgYW4gb3JkZXIgc3RhdGUgb2JqZWN0IGludG8gYW4gYXJyYXlcbiAgICogQHJldHVybnMge0FycmF5fSBSZXN1bHRpbmcgYXJyYXlcbiAgICovXG4gIHByaXZhdGUgb3JkZXJTdGF0ZTJBcnJheSgpOiBBcnJheTxiaWdpbnQ+IHtcbiAgICBsZXQgZGF0YSA9IFNjYWxhci5lKDApO1xuXG4gICAgZGF0YSA9IFNjYWxhci5hZGQoZGF0YSwgdGhpcy5vcmRlcklkKTtcbiAgICBkYXRhID0gU2NhbGFyLmFkZChkYXRhLCBTY2FsYXIuc2hsKHRoaXMudG9rZW5CdXksIDMyKSk7XG4gICAgZGF0YSA9IFNjYWxhci5hZGQoZGF0YSwgU2NhbGFyLnNobCh0aGlzLnRva2VuU2VsbCwgNjQpKTtcblxuICAgIHJldHVybiBbZGF0YSwgU2NhbGFyLmUodGhpcy5maWxsZWRTZWxsKSwgU2NhbGFyLmUodGhpcy5maWxsZWRCdXkpLCBTY2FsYXIuZSh0aGlzLnRvdGFsU2VsbCksIFNjYWxhci5lKHRoaXMudG90YWxCdXkpXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGhhc2ggb2YgYW4gb3JkZXIgc3RhdGUgb2JqZWN0XG4gICAqIEByZXR1cm5zIHtTY2FsYXJ9IFJlc3VsdGluZyBoYXNoXG4gICAqL1xuICBoYXNoKCk6IGJpZ2ludCB7XG4gICAgcmV0dXJuIGhhc2godGhpcy5vcmRlclN0YXRlMkFycmF5KCkpO1xuICB9XG59XG4iXX0=