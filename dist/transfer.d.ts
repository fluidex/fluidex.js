import { Account, TxSignature } from './account';
export declare class TransferTx {
    token_id: bigint;
    amount: bigint;
    from: bigint;
    from_nonce: bigint;
    to: bigint;
    sig: TxSignature;
    constructor(data?: Partial<TransferTx>);
    hash(): bigint;
    signWith(account: Account): void;
}
