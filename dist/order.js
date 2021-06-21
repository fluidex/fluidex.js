const Scalar = require('ffjavascript').Scalar;
import { hash } from './hash';
export var OrderSide;
(function (OrderSide) {
    OrderSide[OrderSide["Buy"] = 0] = "Buy";
    OrderSide[OrderSide["Sell"] = 1] = "Sell";
})(OrderSide || (OrderSide = {}));
export class OrderInput {
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
        let data = hash([magicHead, this.orderId, this.tokenSell, this.tokenBuy, this.totalSell, this.totalBuy]);
        //data = hash([data, accountID, nonce]);
        // nonce and orderID seems redundant?
        data = hash([data, this.accountID]);
        return data;
    }
    signWith(account) {
        this.sig = account.signHash(this.hash());
    }
}
export class OrderState {
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
        return hash(this.orderState2Array());
    }
}
//# sourceMappingURL=order.js.map