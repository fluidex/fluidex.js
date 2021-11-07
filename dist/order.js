"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderState = exports.OrderInput = exports.OrderSide = void 0;
const Scalar = require('ffjavascript').Scalar;
const hash_1 = require("./hash");
var OrderSide;
(function (OrderSide) {
    OrderSide[OrderSide["Buy"] = 0] = "Buy";
    OrderSide[OrderSide["Sell"] = 1] = "Sell";
})(OrderSide = exports.OrderSide || (exports.OrderSide = {}));
class OrderInput {
    constructor(data = {}) {
        this.accountID = 0n;
        this.orderId = 0n;
        this.tokenBuy = 0n;
        this.tokenSell = 0n;
        this.totalSell = 0n;
        this.totalBuy = 0n;
        this.sig = null;
        Object.assign(this, data);
    }
    static createEmpty() {
        let result = new OrderInput();
        return result;
    }
    hash() {
        // although there is no 'TxType.PlaceOrder' now, we can see it as a 'SignType'
        const magicHead = 4n; // TxType.PlaceOrder
        let data = hash_1.hash([magicHead, this.tokenSell, this.tokenBuy, this.totalSell, this.totalBuy]);
        //data = hash([data, accountID, nonce]);
        // nonce and orderID seems redundant?
        //data = hash([data, this.accountID]);
        return data;
    }
    signWith(account) {
        this.sig = account.signHash(this.hash());
    }
}
exports.OrderInput = OrderInput;
class OrderState {
    get orderId() {
        return this.orderInput.orderId;
    }
    get tokenBuy() {
        return this.orderInput.tokenBuy;
    }
    get tokenSell() {
        return this.orderInput.tokenSell;
    }
    get totalSell() {
        return this.orderInput.totalSell;
    }
    get totalBuy() {
        return this.orderInput.totalBuy;
    }
    get side() {
        return this.orderInput.side;
    }
    isFilled() {
        return ((this.orderInput.side == OrderSide.Buy && this.filledBuy >= this.totalBuy) ||
            (this.orderInput.side == OrderSide.Sell && this.filledSell >= this.totalSell));
    }
    static fromOrderInput(orderInput) {
        let result = new OrderState();
        result.orderInput = orderInput;
        result.filledBuy = 0n;
        result.filledSell = 0n;
        return result;
    }
    static createEmpty() {
        return OrderState.fromOrderInput(OrderInput.createEmpty());
    }
    /**
     * Encode an order state object into an array
     * @returns {Array} Resulting array
     */
    orderState2Array() {
        let data = Scalar.e(0);
        data = Scalar.add(data, this.orderId);
        data = Scalar.add(data, Scalar.shl(this.tokenBuy, 32));
        data = Scalar.add(data, Scalar.shl(this.tokenSell, 64));
        return [data, Scalar.e(this.filledSell), Scalar.e(this.filledBuy), Scalar.e(this.totalSell), Scalar.e(this.totalBuy)];
    }
    /**
     * Return the hash of an order state object
     * @returns {Scalar} Resulting hash
     */
    hash() {
        return hash_1.hash(this.orderState2Array());
    }
}
exports.OrderState = OrderState;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvb3JkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUU5QyxpQ0FBOEI7QUFFOUIsSUFBWSxTQUdYO0FBSEQsV0FBWSxTQUFTO0lBQ25CLHVDQUFHLENBQUE7SUFDSCx5Q0FBSSxDQUFBO0FBQ04sQ0FBQyxFQUhXLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBR3BCO0FBRUQsTUFBYSxVQUFVO0lBU3JCLFlBQVksT0FBNEIsRUFBRTtRQVIxQyxjQUFTLEdBQVcsRUFBRSxDQUFDO1FBQ3ZCLFlBQU8sR0FBVyxFQUFFLENBQUM7UUFDckIsYUFBUSxHQUFXLEVBQUUsQ0FBQztRQUN0QixjQUFTLEdBQVcsRUFBRSxDQUFDO1FBQ3ZCLGNBQVMsR0FBVyxFQUFFLENBQUM7UUFDdkIsYUFBUSxHQUFXLEVBQUUsQ0FBQztRQUN0QixRQUFHLEdBQWdCLElBQUksQ0FBQztRQUd0QixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBQ0QsTUFBTSxDQUFDLFdBQVc7UUFDaEIsSUFBSSxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztRQUM5QixPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBQ0QsSUFBSTtRQUNGLDhFQUE4RTtRQUM5RSxNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUMsQ0FBQyxvQkFBb0I7UUFDMUMsSUFBSSxJQUFJLEdBQUcsV0FBSSxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzNGLHdDQUF3QztRQUN4QyxxQ0FBcUM7UUFDckMsc0NBQXNDO1FB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