import { Account, TxSignature } from './account';
export declare enum OrderSide {
    Buy = 0,
    Sell = 1
}
export declare class OrderInput {
    accountID: bigint;
    orderId: bigint;
    tokenBuy: bigint;
    tokenSell: bigint;
    totalSell: bigint;
    totalBuy: bigint;
    sig: TxSignature;
    side: OrderSide;
    constructor(data?: Partial<OrderInput>);
    static createEmpty(): OrderInput;
    hash(): bigint;
    signWith(account: Account): void;
}
export declare class OrderState {
    orderInput: OrderInput;
    filledSell: bigint;
    filledBuy: bigint;
    get orderId(): bigint;
    get tokenBuy(): bigint;
    get tokenSell(): bigint;
    get totalSell(): bigint;
    get totalBuy(): bigint;
    get side(): OrderSide;
    isFilled(): boolean;
    static fromOrderInput(orderInput: any): OrderState;
    static createEmpty(): OrderState;
    /**
     * Encode an order state object into an array
     * @returns {Array} Resulting array
     */
    private orderState2Array;
    /**
     * Return the hash of an order state object
     * @returns {Scalar} Resulting hash
     */
    hash(): bigint;
}
